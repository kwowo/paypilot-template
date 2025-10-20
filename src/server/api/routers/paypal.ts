import { z } from "zod";
import { createTRPCRouter, rateLimitedOrderProcedure, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { createPayPalOrder, capturePayPalOrder } from "@/lib/paypal";
import { calculateReservationExpiry, lazyCleanupExpiredOrders } from "@/lib/lazy-cleanup";
import { logger } from "@/lib/logger";
import crypto from "crypto";

const SHIPPING_RATES = {
  standard: 999,
  express: 1999,
} as const;

export const paypalRouter = createTRPCRouter({
  createOrder: rateLimitedOrderProcedure.input(z.object({
    shippingInfo: z.object({
      firstName: z.string().max(100).regex(/^[a-zA-Z\s'-]+$/),
      lastName: z.string().max(100).regex(/^[a-zA-Z\s'-]+$/),
      email: z.string().email().max(255),
      phone: z.string().max(20).regex(/^[\d\s\-\(\)\+]*$/).optional(),
      address: z.string().max(200).regex(/^[a-zA-Z0-9\s,.\-#]+$/),
      apartment: z.string().max(50).regex(/^[a-zA-Z0-9\s,.\-#]*$/).optional(),
      city: z.string().max(100).regex(/^[a-zA-Z\s,.\-]+$/),
      state: z.string().max(50),
      zipCode: z.string().max(20).regex(/^[a-zA-Z0-9\s\-]+$/),
      country: z.string().max(2),
    }),
    shippingMethod: z.enum(["standard", "express"]),
    idempotencyKey: z.string().optional(),
  })).mutation(async ({ ctx, input }) => {
    await lazyCleanupExpiredOrders();
    const user = ctx.session.user;
    const { shippingInfo, shippingMethod, idempotencyKey } = input;

    if (idempotencyKey) {
      const existingOrder = await db.order.findFirst({
        where: { 
          userId: user.id, 
          idempotencyKey: idempotencyKey,
        },
        include: { items: true },
      });

      if (existingOrder) {
        return {
          success: true,
          orderID: existingOrder.paypalOrderId ?? "",
          orderId: existingOrder.id,
          orderNumber: existingOrder.orderNumber,
          status: "CREATED",
          amount: (existingOrder.total / 100).toFixed(2),
          subtotal: existingOrder.subtotal,
          shippingCost: existingOrder.shippingCost,
          total: existingOrder.total,
        };
      }
    }

    const cartItems = await db.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            isActive: true,
          },
        },
      },
    });

    if (cartItems.length === 0) {
      logger.warn({
        event: "order_creation_failed",
        userId: user.id,
        reason: "empty_cart",
      }, "Order creation attempted with empty cart");
      throw new Error("Cart is empty");
    }

    const orderResult = await db.$transaction(async (tx) => {
      const productIds = [...new Set(cartItems.map((item) => item.product.id))];
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
        },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));

      for (const item of cartItems) {
        const product = productMap.get(item.product.id);
        
        if (!product?.isActive) {
          logger.warn({
            event: "order_creation_failed",
            userId: user.id,
            productId: item.product.id,
            reason: "product_inactive",
          }, `Product "${item.product.name}" is no longer available`);
          throw new Error(`Product "${item.product.name}" is no longer available`);
        }

        if (product.stock < item.quantity) {
          logger.warn({
            event: "order_creation_failed",
            userId: user.id,
            productId: item.product.id,
            requestedQuantity: item.quantity,
            availableStock: product.stock,
            reason: "insufficient_stock",
          }, `Insufficient stock for "${item.product.name}"`);
          throw new Error(
            `Insufficient stock for "${item.product.name}". Only ${product.stock} available`
          );
        }
      }

      for (const item of cartItems) {
        const product = productMap.get(item.product.id);
        if (!product) continue;

        await tx.product.update({
          where: { 
            id: item.product.id,
            stock: { gte: item.quantity }
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      const subtotal = cartItems.reduce(
        (sum, item) => {
          const product = productMap.get(item.product.id);
          return sum + (product?.price ?? 0) * item.quantity;
        },
        0
      );
      const shippingCost = SHIPPING_RATES[shippingMethod];
      const total = subtotal + shippingCost;

      const orderNumber = `ORD-${Date.now()}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
      const reservationExpiresAt = calculateReservationExpiry();

      const order = await tx.order.create({
        data: {
          userId: user.id,
          orderNumber,
          idempotencyKey: idempotencyKey ?? null,
          subtotal,
          shippingCost,
          total,
          shippingMethod,
          shippingFirstName: shippingInfo.firstName,
          shippingLastName: shippingInfo.lastName,
          shippingEmail: shippingInfo.email,
          shippingPhone: shippingInfo.phone ?? null,
          shippingAddress: shippingInfo.address,
          shippingApartment: shippingInfo.apartment ?? null,
          shippingCity: shippingInfo.city,
          shippingState: shippingInfo.state,
          shippingZipCode: shippingInfo.zipCode,
          shippingCountry: shippingInfo.country,
          status: "pending",
          paymentStatus: "pending",
          reservationExpiresAt,
          items: {
            create: cartItems.map((item) => {
              const product = productMap.get(item.product.id);
              return {
                productId: item.product.id,
                productName: item.product.name,
                color: item.color,
                size: item.size,
                price: product?.price ?? 0,
                quantity: item.quantity,
              };
            }),
          },
        },
      });

      logger.info({
        event: "stock_reserved",
        userId: user.id,
        orderId: order.id,
        orderNumber: order.orderNumber,
        itemCount: cartItems.length,
        total,
      }, "Stock reserved for order");

      return { order, subtotal, shippingCost, total };
    });

    const { order, subtotal, shippingCost, total } = orderResult;

    const paypalAmount = (total / 100).toFixed(2);
    let paypalOrder;
    
    try {
      paypalOrder = await createPayPalOrder(paypalAmount, "USD");
      logger.info({
        event: "paypal_order_created",
        userId: user.id,
        orderId: order.id,
        orderNumber: order.orderNumber,
        paypalOrderId: paypalOrder.id,
        amount: paypalAmount,
      }, "PayPal order created successfully");
    } catch (paypalError) {
      logger.error({
        event: "paypal_order_creation_failed",
        userId: user.id,
        orderId: order.id,
        orderNumber: order.orderNumber,
        amount: paypalAmount,
        error: paypalError instanceof Error ? paypalError.message : String(paypalError),
      }, "Failed to create PayPal order, reversing stock");

      await db.$transaction(async (tx) => {
        const orderItems = await tx.orderItem.findMany({
          where: { orderId: order.id },
        });

        for (const item of orderItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          });
        }

        await tx.order.update({
          where: { id: order.id },
          data: {
            status: "cancelled",
            paymentStatus: "failed",
          },
        });
      });

      throw paypalError;
    }

    await db.order.update({
      where: { id: order.id },
      data: {
        paypalOrderId: paypalOrder.id,
      },
    });

    return {
      success: true,
      orderID: paypalOrder.id,
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: paypalOrder.status,
      amount: paypalAmount,
      subtotal,
      shippingCost,
      total,
    };
  }),

  captureOrder: protectedProcedure.input(z.object({
    orderID: z.string(),
  })).mutation(async ({ ctx, input }) => {
    await lazyCleanupExpiredOrders();
    const user = ctx.session.user;
    const { orderID } = input;
    
    const order = await db.order.findUnique({
      where: { paypalOrderId: orderID },
      include: { items: true },
    });
    
    if (!order) {
      logger.warn({
        event: "payment_capture_failed",
        userId: user.id,
        paypalOrderId: orderID,
        reason: "order_not_found",
      }, "Payment capture failed - order not found");
      throw new Error("Order not found");
    }
    if (order.userId !== user.id) {
      logger.warn({
        event: "payment_capture_failed",
        userId: user.id,
        orderId: order.id,
        orderUserId: order.userId,
        paypalOrderId: orderID,
        reason: "unauthorized",
      }, "Payment capture failed - unauthorized access attempt");
      throw new Error("Unauthorized - Order does not belong to you");
    }
    
    const captureResult = await capturePayPalOrder(orderID);
    
    const capturedAmount = parseFloat(captureResult.purchase_units[0]?.payments.captures[0]?.amount.value ?? "0");
    const expectedAmount = order.total / 100;
    
    if (Math.abs(capturedAmount - expectedAmount) > 0.01) {
      logger.error({
        event: "payment_amount_mismatch",
        userId: user.id,
        orderId: order.id,
        orderNumber: order.orderNumber,
        paypalOrderId: orderID,
        expectedAmount,
        capturedAmount,
        difference: Math.abs(capturedAmount - expectedAmount),
      }, "Payment amount mismatch detected");
    }
    
    await db.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "confirmed",
          paymentStatus: "paid",
        },
      });
      
      await tx.cartItem.deleteMany({
        where: { userId: user.id },
      });
    });
    
    logger.info({
      event: "payment_captured",
      userId: user.id,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paypalOrderId: orderID,
      amount: capturedAmount,
    }, "Payment captured successfully");
    
    return captureResult;
  }),
});
