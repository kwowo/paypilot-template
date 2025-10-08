import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const cartRouter = createTRPCRouter({
  // Get user's cart items
  getItems: protectedProcedure.query(async ({ ctx }) => {
    const cartItems = await ctx.db.cartItem.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
          },
        },
        variant: {
          select: {
            id: true,
            size: true,
            color: true,
            stock: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Convert Decimal to number and calculate totals
    return cartItems.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: item.product.price.toNumber(),
      },
      total: item.product.price.toNumber() * item.quantity,
    }));
  }),

  // Add item to cart
  addItem: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        variantId: z.string(),
        quantity: z.number().min(1).default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, variantId, quantity } = input;

      // Check if variant exists and has stock
      const variant = await ctx.db.productVariant.findUnique({
        where: { id: variantId },
        include: {
          product: true,
        },
      });

      if (!variant || !variant.active) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product variant not found",
        });
      }

      if (variant.stock < quantity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not enough stock available",
        });
      }

      // Check if item already exists in cart
      const existingItem = await ctx.db.cartItem.findUnique({
        where: {
          userId_productId_variantId: {
            userId: ctx.session.user.id,
            productId,
            variantId,
          },
        },
      });

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity;
        
        if (variant.stock < newQuantity) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Not enough stock available",
          });
        }

        return await ctx.db.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQuantity },
        });
      }

      // Create new cart item
      return await ctx.db.cartItem.create({
        data: {
          userId: ctx.session.user.id,
          productId,
          variantId,
          quantity,
        },
      });
    }),

  // Update item quantity
  updateQuantity: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        quantity: z.number().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { itemId, quantity } = input;

      // Get cart item with variant info
      const cartItem = await ctx.db.cartItem.findUnique({
        where: {
          id: itemId,
          userId: ctx.session.user.id,
        },
        include: {
          variant: true,
        },
      });

      if (!cartItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart item not found",
        });
      }

      if (cartItem.variant.stock < quantity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not enough stock available",
        });
      }

      return await ctx.db.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }),

  // Remove item from cart
  removeItem: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.cartItem.delete({
        where: {
          id: input.itemId,
          userId: ctx.session.user.id,
        },
      });
    }),

  // Clear entire cart
  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.db.cartItem.deleteMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  // Get cart summary (total items, total price)
  getSummary: protectedProcedure.query(async ({ ctx }) => {
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

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.product.price.toNumber() * item.quantity,
      0
    );

    return {
      totalItems,
      totalPrice,
    };
  }),
});