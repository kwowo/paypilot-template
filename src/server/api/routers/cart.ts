import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const cartRouter = createTRPCRouter({
  getItems: protectedProcedure.query(async ({ ctx }) => {
    const cartItems = await ctx.db.cartItem.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        product: {
          include: {
            category: {
              select: { id: true, name: true, slug: true },
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
      },
    }));
  }),

  addItem: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().min(1).max(10),
        size: z.enum(["XS", "S", "M", "L", "XL", "XXL"]),
        color: z.enum(["BLACK", "WHITE", "GRAY", "RED", "BLUE", "GREEN", "YELLOW", "PINK", "PURPLE", "ORANGE"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { productId, quantity, size, color } = input;

      // Check if product exists and is active
      const product = await ctx.db.product.findUnique({
        where: { id: productId, active: true },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Check if item already exists in cart
      const existingItem = await ctx.db.cartItem.findUnique({
        where: {
          userId_productId_size_color: {
            userId: ctx.session.user.id,
            productId,
            size: size as any,
            color: color as any,
          },
        },
      });

      if (existingItem) {
        // Update quantity
        return ctx.db.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        // Create new cart item
        return ctx.db.cartItem.create({
          data: {
            userId: ctx.session.user.id,
            productId,
            quantity,
            size: size as any,
            color: color as any,
          },
        });
      }
    }),

  updateQuantity: protectedProcedure
    .input(
      z.object({
        itemId: z.string(),
        quantity: z.number().min(1).max(10),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { itemId, quantity } = input;

      const cartItem = await ctx.db.cartItem.findUnique({
        where: { id: itemId, userId: ctx.session.user.id },
      });

      if (!cartItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart item not found",
        });
      }

      return ctx.db.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }),

  removeItem: protectedProcedure
    .input(z.object({ itemId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const cartItem = await ctx.db.cartItem.findUnique({
        where: { id: input.itemId, userId: ctx.session.user.id },
      });

      if (!cartItem) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Cart item not found",
        });
      }

      return ctx.db.cartItem.delete({
        where: { id: input.itemId },
      });
    }),

  clearCart: protectedProcedure.mutation(async ({ ctx }) => {
    return ctx.db.cartItem.deleteMany({
      where: { userId: ctx.session.user.id },
    });
  }),

  getTotal: protectedProcedure.query(async ({ ctx }) => {
    const cartItems = await ctx.db.cartItem.findMany({
      where: { userId: ctx.session.user.id },
      include: { product: true },
    });

    const subtotal = cartItems.reduce((total, item) => {
      return total + item.product.price.toNumber() * item.quantity;
    }, 0);

    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shipping;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      tax: Number(tax.toFixed(2)),
      shipping: Number(shipping.toFixed(2)),
      total: Number(total.toFixed(2)),
      itemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
    };
  }),
});