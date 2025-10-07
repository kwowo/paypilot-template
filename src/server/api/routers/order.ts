import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const orderRouter = createTRPCRouter({
  // Get user's orders
  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany({
      where: {
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
        shippingAddress: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders.map((order) => ({
      ...order,
      total: order.total.toNumber(),
      subtotal: order.subtotal.toNumber(),
      tax: order.tax.toNumber(),
      shipping: order.shipping.toNumber(),
      items: order.items.map((item) => ({
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
          userId: ctx.session.user.id, // Ensure user owns this order
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
          shippingAddress: true,
          billingAddress: true,
        },
      });

      if (!order) {
        return null;
      }

      return {
        ...order,
        total: order.total.toNumber(),
        subtotal: order.subtotal.toNumber(),
        tax: order.tax.toNumber(),
        shipping: order.shipping.toNumber(),
        items: order.items.map((item) => ({
          ...item,
          price: item.price.toNumber(),
        })),
      };
    }),

  // Create order from cart
  createFromCart: protectedProcedure
    .input(
      z.object({
        shippingAddress: z.object({
          firstName: z.string(),
          lastName: z.string(),
          company: z.string().optional(),
          address1: z.string(),
          address2: z.string().optional(),
          city: z.string(),
          state: z.string(),
          postalCode: z.string(),
          country: z.string().default("US"),
          phone: z.string().optional(),
        }),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get cart items
      const cartItems = await ctx.db.cartItem.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          product: {
            select: {
              price: true,
            },
          },
        },
      });

      if (cartItems.length === 0) {
        throw new Error("Cart is empty");
      }

      // Calculate totals
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.product.price.toNumber(),
        0
      );
      const tax = subtotal * 0.08; // 8% tax
      const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
      const total = subtotal + tax + shipping;

      // Create shipping address
      const shippingAddress = await ctx.db.address.create({
        data: {
          ...input.shippingAddress,
          userId: ctx.session.user.id,
        },
      });

      // Generate order number
      const orderNumber = `TS-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

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
          shippingAddressId: shippingAddress.id,
          notes: input.notes,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: true,
          shippingAddress: true,
        },
      });

      // Clear cart
      await ctx.db.cartItem.deleteMany({
        where: {
          userId: ctx.session.user.id,
        },
      });

      return {
        ...order,
        total: order.total.toNumber(),
        subtotal: order.subtotal.toNumber(),
        tax: order.tax.toNumber(),
        shipping: order.shipping.toNumber(),
      };
    }),

  // Admin: Get all orders
  getAll: protectedProcedure
    .input(
      z.object({
        status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      // TODO: Re-enable admin check when auth is fully configured
      // if (ctx.session.user.role !== "ADMIN") {
      //   throw new Error("Unauthorized");
      // }

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
                  name: true,
                },
              },
            },
          },
          shippingAddress: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        skip: input.offset,
      });

      return orders.map((order) => ({
        ...order,
        total: order.total.toNumber(),
        subtotal: order.subtotal.toNumber(),
        tax: order.tax.toNumber(),
        shipping: order.shipping.toNumber(),
        items: order.items.map((item) => ({
          ...item,
          price: item.price.toNumber(),
        })),
      }));
    }),

  // Admin: Update order status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Re-enable admin check when auth is fully configured
      // if (ctx.session.user.role !== "ADMIN") {
      //   throw new Error("Unauthorized");
      // }

      return await ctx.db.order.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
});