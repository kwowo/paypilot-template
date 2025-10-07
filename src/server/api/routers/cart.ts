import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

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
            sku: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return cartItems.map((item) => ({
      ...item,
      product: {
        ...item.product,
        price: item.product.price.toNumber(),
      },
    }));
  }),

  // Add item to cart
  addItem: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        quantity: z.number().min(1).default(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingItem = await ctx.db.cartItem.findFirst({
        where: {
          userId: ctx.session.user.id,
          productId: input.productId,
          variantId: input.variantId ?? null,
        },
      });

      if (existingItem) {
        // Update quantity if item already exists
        return await ctx.db.cartItem.update({
          where: {
            id: existingItem.id,
          },
          data: {
            quantity: existingItem.quantity + input.quantity,
          },
        });
      } else {
        // Create new cart item
        return await ctx.db.cartItem.create({
          data: {
            userId: ctx.session.user.id,
            productId: input.productId,
            variantId: input.variantId ?? null,
            quantity: input.quantity,
          },
        });
      }
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
      return await ctx.db.cartItem.update({
        where: {
          id: input.itemId,
          userId: ctx.session.user.id, // Ensure user owns this cart item
        },
        data: {
          quantity: input.quantity,
        },
      });
    }),

  // Remove item from cart
  removeItem: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.cartItem.delete({
        where: {
          id: input.itemId,
          userId: ctx.session.user.id, // Ensure user owns this cart item
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
      (sum, item) => sum + item.quantity * item.product.price.toNumber(),
      0
    );

    return {
      totalItems,
      totalPrice,
    };
  }),
});