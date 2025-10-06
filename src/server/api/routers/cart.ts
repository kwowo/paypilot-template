import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";

export const cartRouter = createTRPCRouter({
  getItems: publicProcedure
    .input(z.object({ sessionId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const where = ctx.session?.user?.id
        ? { userId: ctx.session.user.id }
        : { sessionId: input.sessionId || "" };

      const cartItems = await ctx.db.cartItem.findMany({
        where,
        include: {
          product: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
          variant: true,
        },
        orderBy: { createdAt: "desc" },
      });

      return cartItems.map(item => ({
        ...item,
        product: {
          ...item.product,
          price: item.product.price.toNumber(),
        },
      }));
    }),

  addItem: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        variantId: z.string().optional(),
        quantity: z.number().min(1).default(1),
        sessionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const where = ctx.session?.user?.id
        ? { userId: ctx.session.user.id, productId: input.productId, variantId: input.variantId }
        : { sessionId: input.sessionId || "", productId: input.productId, variantId: input.variantId };

      // Check if item already exists in cart
      const existingItem = await ctx.db.cartItem.findFirst({ where });

      if (existingItem) {
        // Update quantity if item exists
        return await ctx.db.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + input.quantity },
          include: {
            product: true,
            variant: true,
          },
        });
      } else {
        // Create new cart item
        return await ctx.db.cartItem.create({
          data: {
            productId: input.productId,
            variantId: input.variantId,
            quantity: input.quantity,
            userId: ctx.session?.user?.id,
            sessionId: input.sessionId,
          },
          include: {
            product: true,
            variant: true,
          },
        });
      }
    }),

  updateQuantity: publicProcedure
    .input(
      z.object({
        itemId: z.string(),
        quantity: z.number().min(0),
        sessionId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.quantity === 0) {
        // Remove item if quantity is 0
        return await ctx.db.cartItem.delete({
          where: { id: input.itemId },
        });
      }

      return await ctx.db.cartItem.update({
        where: { id: input.itemId },
        data: { quantity: input.quantity },
        include: {
          product: true,
          variant: true,
        },
      });
    }),

  removeItem: publicProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.cartItem.delete({
        where: { id: input.itemId },
      });
    }),

  clearCart: publicProcedure
    .input(z.object({ sessionId: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const where = ctx.session?.user?.id
        ? { userId: ctx.session.user.id }
        : { sessionId: input.sessionId || "" };

      return await ctx.db.cartItem.deleteMany({ where });
    }),
});