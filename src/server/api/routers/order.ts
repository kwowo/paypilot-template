import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  adminProcedure,
} from "@/server/api/trpc";

export const orderRouter = createTRPCRouter({
  // Create order from cart
  create: protectedProcedure
    .input(z.object({
      shippingName: z.string().min(1),
      shippingEmail: z.string().email(),
      shippingAddress: z.string().min(1),
      shippingCity: z.string().min(1),
      shippingState: z.string().min(1),
      shippingZip: z.string().min(1),
      shippingCountry: z.string().default("US"),
      paymentMethod: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get user's cart items
      const cartItems = await ctx.db.cartItem.findMany({
        where: { userId: ctx.session.user.id },
        include: {
          product: true,
        },
      });

      if (cartItems.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cart is empty",
        });
      }

      // Calculate totals
      const subtotal = cartItems.reduce((sum: number, item: any) => {
        const price = item.product.salePrice || item.product.price;
        return sum + price.toNumber() * item.quantity;
      }, 0);

      const tax = subtotal * 0.08; // 8% tax
      const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
      const total = subtotal + tax + shipping;

      // Create order with transaction
      const order = await ctx.db.$transaction(async (tx: any) => {
        // Create the order
        const newOrder = await tx.order.create({
          data: {
            userId: ctx.session.user.id,
            status: "PENDING",
            subtotal,
            tax,
            shipping,
            total,
            ...input,
          },
        });

        // Create order items
        const orderItems = await Promise.all(
          cartItems.map((cartItem: any) =>
            tx.orderItem.create({
              data: {
                orderId: newOrder.id,
                productId: cartItem.productId,
                quantity: cartItem.quantity,
                size: cartItem.size,
                color: cartItem.color,
                price: cartItem.product.salePrice || cartItem.product.price,
              },
            })
          )
        );

        // Update product inventory
        await Promise.all(
          cartItems.map((cartItem: any) =>
            tx.product.update({
              where: { id: cartItem.productId },
              data: {
                inventory: {
                  decrement: cartItem.quantity,
                },
              },
            })
          )
        );

        // Clear user's cart
        await tx.cartItem.deleteMany({
          where: { userId: ctx.session.user.id },
        });

        return newOrder;
      });

      return {
        ...order,
        subtotal: order.subtotal.toNumber(),
        tax: order.tax.toNumber(),
        shipping: order.shipping.toNumber(),
        total: order.total.toNumber(),
      };
    }),

  // Get user's orders
  getMyOrders: protectedProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const orders = await ctx.db.order.findMany({
        where: { userId: ctx.session.user.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: input.limit,
        skip: input.offset,
      });

      return orders.map((order: any) => ({
        ...order,
        subtotal: order.subtotal.toNumber(),
        tax: order.tax.toNumber(),
        shipping: order.shipping.toNumber(),
        total: order.total.toNumber(),
        items: order.items.map((item: any) => ({
          ...item,
          price: item.price.toNumber(),
        })),
      }));
    }),

  // Get single order by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: true,
                  category: {
                    select: {
                      name: true,
                      slug: true,
                    },
                  },
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
        items: order.items.map((item: any) => ({
          ...item,
          price: item.price.toNumber(),
        })),
      };
    }),

  // Admin: Get all orders
  getAll: adminProcedure
    .input(z.object({
      status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const orders = await ctx.db.order.findMany({
        where: {
          ...(input.status && { status: input.status }),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: input.limit,
        skip: input.offset,
      });

      return orders.map((order: any) => ({
        ...order,
        subtotal: order.subtotal.toNumber(),
        tax: order.tax.toNumber(),
        shipping: order.shipping.toNumber(),
        total: order.total.toNumber(),
        items: order.items.map((item: any) => ({
          ...item,
          price: item.price.toNumber(),
        })),
      }));
    }),

  // Admin: Update order status
  updateStatus: adminProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.order.update({
        where: { id: input.id },
        data: { status: input.status },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }),
});