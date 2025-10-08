import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

const shippingInfoSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().default("US"),
});

export const orderRouter = createTRPCRouter({
  // Create order from cart
  create: protectedProcedure
    .input(
      z.object({
        shippingInfo: shippingInfoSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { shippingInfo } = input;

      // Get cart items
      const cartItems = await ctx.db.cartItem.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          product: true,
          variant: true,
        },
      });

      if (cartItems.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cart is empty",
        });
      }

      // Check stock availability
      for (const item of cartItems) {
        if (item.variant.stock < item.quantity) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Not enough stock for ${item.product.name} (${item.variant.size}/${item.variant.color})`,
          });
        }
      }

      // Calculate totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price.toNumber() * item.quantity,
        0
      );
      const tax = subtotal * 0.08; // 8% tax
      const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
      const total = subtotal + tax + shipping;

      // Generate order number
      const orderNumber = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

      // Create order
      const order = await ctx.db.order.create({
        data: {
          orderNumber,
          userId: ctx.session.user.id,
          status: "PENDING",
          subtotal,
          tax,
          shipping,
          total,
          shippingName: shippingInfo.name,
          shippingEmail: shippingInfo.email,
          shippingAddress1: shippingInfo.address1,
          shippingAddress2: shippingInfo.address2,
          shippingCity: shippingInfo.city,
          shippingState: shippingInfo.state,
          shippingZip: shippingInfo.zip,
          shippingCountry: shippingInfo.country,
          orderItems: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });

      // Update stock quantities
      for (const item of cartItems) {
        await ctx.db.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear cart
      await ctx.db.cartItem.deleteMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      return {
        ...order,
        subtotal: order.subtotal.toNumber(),
        tax: order.tax.toNumber(),
        shipping: order.shipping.toNumber(),
        total: order.total.toNumber(),
        orderItems: order.orderItems.map((item) => ({
          ...item,
          price: item.price.toNumber(),
        })),
      };
    }),

  // Get user's orders
  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: true,
              },
            },
            variant: {
              select: {
                size: true,
                color: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders.map((order) => ({
      ...order,
      subtotal: order.subtotal.toNumber(),
      tax: order.tax.toNumber(),
      shipping: order.shipping.toNumber(),
      total: order.total.toNumber(),
      orderItems: order.orderItems.map((item) => ({
        ...item,
        price: item.price.toNumber(),
      })),
    }));
  }),

  // Get order by ID
  getById: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: {
          id: input.orderId,
          userId: ctx.session.user.id,
        },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                },
              },
              variant: {
                select: {
                  size: true,
                  color: true,
                },
              },
            },
          },
        },
      });

      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }

      return {
        ...order,
        subtotal: order.subtotal.toNumber(),
        tax: order.tax.toNumber(),
        shipping: order.shipping.toNumber(),
        total: order.total.toNumber(),
        orderItems: order.orderItems.map((item) => ({
          ...item,
          price: item.price.toNumber(),
        })),
      };
    }),
});