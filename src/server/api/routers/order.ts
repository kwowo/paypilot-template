import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";

const orderCreateInput = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  shippingAddress: z.string().min(1),
  shippingCity: z.string().min(1),
  shippingState: z.string().min(1),
  shippingZip: z.string().min(1),
  shippingCountry: z.string().min(1),
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingZip: z.string().optional(),
  billingCountry: z.string().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number().min(1),
    })
  ),
  sessionId: z.string().optional(),
});

export const orderRouter = createTRPCRouter({
  create: publicProcedure
    .input(orderCreateInput)
    .mutation(async ({ ctx, input }) => {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}`;

      // Calculate total price
      const productIds = input.items.map(item => item.productId);
      const products = await ctx.db.product.findMany({
        where: { id: { in: productIds } },
        include: { variants: true },
      });

      let total = 0;
      const orderItems = [];

      for (const item of input.items) {
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);

        const variant = item.variantId 
          ? product.variants.find(v => v.id === item.variantId)
          : null;

        const price = product.price.toNumber();
        total += price * item.quantity;

        orderItems.push({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: product.price,
          productName: product.name,
          productSlug: product.slug,
          variantSize: variant?.size,
          variantColor: variant?.color,
        });
      }

      // Create order
      const order = await ctx.db.order.create({
        data: {
          orderNumber,
          status: "PENDING",
          total,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          shippingAddress: input.shippingAddress,
          shippingCity: input.shippingCity,
          shippingState: input.shippingState,
          shippingZip: input.shippingZip,
          shippingCountry: input.shippingCountry,
          billingAddress: input.billingAddress,
          billingCity: input.billingCity,
          billingState: input.billingState,
          billingZip: input.billingZip,
          billingCountry: input.billingCountry,
          userId: ctx.session?.user?.id,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });

      // Clear cart after successful order
      if (ctx.session?.user?.id) {
        await ctx.db.cartItem.deleteMany({
          where: { userId: ctx.session.user.id },
        });
      } else if (input.sessionId) {
        await ctx.db.cartItem.deleteMany({
          where: { sessionId: input.sessionId },
        });
      }

      return {
        ...order,
        total: order.total.toNumber(),
        items: order.items.map(item => ({
          ...item,
          price: item.price.toNumber(),
          product: {
            ...item.product,
            price: item.product.price.toNumber(),
          },
        })),
      };
    }),

  getByOrderNumber: publicProcedure
    .input(z.object({ orderNumber: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: { orderNumber: input.orderNumber },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      return {
        ...order,
        total: order.total.toNumber(),
        items: order.items.map(item => ({
          ...item,
          price: item.price.toNumber(),
          product: {
            ...item.product,
            price: item.product.price.toNumber(),
          },
        })),
      };
    }),

  getUserOrders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders.map(order => ({
      ...order,
      total: order.total.toNumber(),
      items: order.items.map(item => ({
        ...item,
        price: item.price.toNumber(),
        product: {
          ...item.product,
          price: item.product.price.toNumber(),
        },
      })),
    }));
  }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // This would typically require admin permissions
      return await ctx.db.order.update({
        where: { id: input.orderId },
        data: { status: input.status },
      });
    }),
});