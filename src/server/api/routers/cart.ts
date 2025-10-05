import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const cartRouter = createTRPCRouter({
  // Get user's cart items
  getItems: protectedProcedure.query(async ({ ctx }) => {
    const cartItems = await ctx.db.cartItem.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        product: {
          include: {
            category: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return cartItems.map((item: any) => ({
      ...item,
      product: {
        ...item.product,
        price: item.product.price.toNumber(),
        salePrice: item.product.salePrice?.toNumber(),
      },
    }));
  }),

  // Add item to cart
  addItem: protectedProcedure
    .input(z.object({
      productId: z.string(),
      size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
      color: z.string(),
      quantity: z.number().min(1).default(1),
    }))
    .mutation(async ({ ctx, input }) => {
      // Check if product exists and is active
      const product = await ctx.db.product.findUnique({
        where: { id: input.productId, active: true },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Check inventory
      if (product.inventory < input.quantity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not enough inventory",
        });
      }

      // Upsert cart item (update if exists, create if not)
      const cartItem = await ctx.db.cartItem.upsert({
        where: {
          userId_productId_size_color: {
            userId: ctx.session.user.id,
            productId: input.productId,
            size: input.size,
            color: input.color,
          },
        },
        update: {
          quantity: {
            increment: input.quantity,
          },
        },
        create: {
          userId: ctx.session.user.id,
          productId: input.productId,
          size: input.size,
          color: input.color,
          quantity: input.quantity,
        },
        include: {
          product: true,
        },
      });

      return {
        ...cartItem,
        product: {
          ...cartItem.product,
          price: cartItem.product.price.toNumber(),
          salePrice: cartItem.product.salePrice?.toNumber(),
        },
      };
    }),

  // Update cart item quantity
  updateQuantity: protectedProcedure
    .input(z.object({
      id: z.string(),
      quantity: z.number().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      // If quantity is 0, remove the item
      if (input.quantity === 0) {
        return ctx.db.cartItem.delete({
          where: {
            id: input.id,
            userId: ctx.session.user.id,
          },
        });
      }

      return ctx.db.cartItem.update({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          quantity: input.quantity,
        },
        include: {
          product: true,
        },
      });
    }),

  // Remove item from cart
  removeItem: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.cartItem.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  // Clear entire cart
  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.db.cartItem.deleteMany({
      where: { userId: ctx.session.user.id },
    });
  }),

  // Get cart summary (total items, total price)
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const cartItems = await ctx.db.cartItem.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        product: true,
      },
    });

    const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum: number, item: any) => {
      const price = item.product.salePrice || item.product.price;
      return sum + price.toNumber() * item.quantity;
    }, 0);

    return {
      totalItems,
      totalPrice,
      itemCount: cartItems.length,
    };
  }),
});