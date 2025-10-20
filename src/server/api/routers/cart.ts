import { z } from "zod";
import { createTRPCRouter, protectedProcedure, rateLimitedCartProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";

const SHIPPING_RATES = {
  standard: 999, // $9.99
  express: 1999, // $19.99
} as const;

export const cartRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    const cartItems = await db.cartItem.findMany({
      where: { userId: user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            originalPrice: true,
            imageUrl: true,
            stock: true,
            isActive: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    const items = cartItems.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      color: item.color,
      size: item.size,
      price: item.product.price,
      originalPrice: item.product.originalPrice,
      quantity: item.quantity,
      imageUrl: item.product.imageUrl,
      cachedPrice: item.product.price,
    }));
    const subtotal = items.reduce((sum: number, item) => sum + item.price * item.quantity, 0);
    const userRecord = await db.user.findUnique({
      where: { id: user.id },
      select: {
        shippingMethod: true,
        shippingFirstName: true,
        shippingLastName: true,
        shippingEmail: true,
        shippingPhone: true,
        shippingAddress: true,
        shippingApartment: true,
        shippingCity: true,
        shippingState: true,
        shippingZipCode: true,
        shippingCountry: true,
      },
    });
    const shippingInfo = {
      firstName: userRecord?.shippingFirstName ?? "",
      lastName: userRecord?.shippingLastName ?? "",
      email: userRecord?.shippingEmail ?? "",
      phone: userRecord?.shippingPhone ?? "",
      address: userRecord?.shippingAddress ?? "",
      apartment: userRecord?.shippingApartment ?? "",
      city: userRecord?.shippingCity ?? "",
      state: userRecord?.shippingState ?? "",
      zipCode: userRecord?.shippingZipCode ?? "",
      country: userRecord?.shippingCountry ?? "US",
    };
    const shippingMethod = userRecord?.shippingMethod === "express" ? "express" : "standard";
    const shippingCost = SHIPPING_RATES[shippingMethod];
    const total = subtotal + shippingCost;
    return {
      success: true,
      cartItems: items,
      subtotal,
      shippingCost,
      total,
      shippingInfo,
      shippingMethod,
    };
  }),

  add: rateLimitedCartProcedure.input(z.object({
    productId: z.string(),
    color: z.string(),
    size: z.string(),
    quantity: z.number().min(1).max(99),
  })).mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;
    const { productId, color, size, quantity } = input;
    const MAX_CART_ITEMS = 50;
    const currentCartSize = await db.cartItem.count({
      where: { userId: user.id }
    });
    if (currentCartSize >= MAX_CART_ITEMS) {
      throw new Error(`Cart full (max ${MAX_CART_ITEMS} items)`);
    }
    const product = await db.product.findUnique({
      where: { id: productId, isActive: true },
      include: {
        variants: true,
      },
    });
    if (!product) {
      throw new Error("Product not found or unavailable");
    }
    const hasColor = product.variants.some((v: { type: string; value: string }) => v.type === "color" && v.value === color);
    const hasSize = product.variants.some((v: { type: string; value: string }) => v.type === "size" && v.value === size);
    if (!hasColor || !hasSize) {
      throw new Error("Invalid color or size for this product");
    }
    // Check existing cart quantity for this specific variant
    const existingCartItem = await db.cartItem.findUnique({
      where: {
        userId_productId_color_size: {
          userId: user.id,
          productId,
          color,
          size,
        },
      },
    });
    const existingQuantity = existingCartItem?.quantity ?? 0;
    const totalQuantity = existingQuantity + quantity;
    if (totalQuantity > product.stock) {
      throw new Error(`Only ${product.stock} items in stock. You already have ${existingQuantity} in your cart.`);
    }
    const cartItem = await db.cartItem.upsert({
      where: {
        userId_productId_color_size: {
          userId: user.id,
          productId,
          color,
          size,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        userId: user.id,
        productId,
        color,
        size,
        quantity,
      },
      include: {
        product: true,
      },
    });
    return {
      success: true,
      message: "Item added to cart",
      cartItem: {
        id: cartItem.product.id,
        name: cartItem.product.name,
        color: cartItem.color,
        size: cartItem.size,
        price: cartItem.product.price,
        originalPrice: cartItem.product.originalPrice,
        quantity: cartItem.quantity,
        imageUrl: cartItem.product.imageUrl,
      },
    };
  }),

  updateShipping: protectedProcedure.input(z.object({
    shippingInfo: z.object({
      firstName: z.string().max(100).regex(/^[a-zA-Z\s'-]+$/).optional(),
      lastName: z.string().max(100).regex(/^[a-zA-Z\s'-]+$/).optional(),
      email: z.string().email().max(255).optional(),
      phone: z.string().max(20).regex(/^[\d\s\-\(\)\+]+$/).optional(),
      address: z.string().max(200).regex(/^[a-zA-Z0-9\s,.\-#]+$/).optional(),
      apartment: z.string().max(50).regex(/^[a-zA-Z0-9\s,.\-#]*$/).optional(),
      city: z.string().max(100).regex(/^[a-zA-Z\s,.\-]+$/).optional(),
      state: z.string().max(50).optional(),
      zipCode: z.string().max(20).regex(/^[a-zA-Z0-9\s\-]+$/).optional(),
      country: z.string().max(2).optional(),
    }),
    shippingMethod: z.enum(["standard", "express"]),
  })).mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;
    const { shippingInfo, shippingMethod } = input;
    if (!shippingMethod || !SHIPPING_RATES[shippingMethod]) {
      throw new Error("Invalid shipping method");
    }
    await db.user.update({
      where: { id: user.id },
      data: {
        shippingMethod,
        shippingFirstName: shippingInfo?.firstName ?? "",
        shippingLastName: shippingInfo?.lastName ?? "",
        shippingEmail: shippingInfo?.email ?? "",
        shippingPhone: shippingInfo?.phone ?? "",
        shippingAddress: shippingInfo?.address ?? "",
        shippingApartment: shippingInfo?.apartment ?? "",
        shippingCity: shippingInfo?.city ?? "",
        shippingState: shippingInfo?.state ?? "",
        shippingZipCode: shippingInfo?.zipCode ?? "",
        shippingCountry: shippingInfo?.country ?? "US",
      },
    });
    return { success: true };
  }),

  update: rateLimitedCartProcedure.input(z.object({
    productId: z.string(),
    color: z.string(),
    size: z.string(),
    quantity: z.number().min(0).max(99),
  })).mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;
    const { productId, color, size, quantity } = input;
    if (quantity === 0) {
      await db.cartItem.deleteMany({
        where: {
          userId: user.id,
          productId,
          color,
          size,
        },
      });
      return { success: true, message: "Item removed from cart" };
    }
    // Check stock before updating
    const product = await db.product.findUnique({
      where: { id: productId, isActive: true },
      select: { stock: true },
    });
    if (!product) {
      throw new Error("Product not found or unavailable");
    }
    if (quantity > product.stock) {
      throw new Error(`Only ${product.stock} items in stock`);
    }
    const updated = await db.cartItem.updateMany({
      where: {
        userId: user.id,
        productId,
        color,
        size,
      },
      data: { quantity },
    });
    if (updated.count === 0) {
      throw new Error("Cart item not found");
    }
    return { success: true, message: "Cart updated" };
  }),

  remove: rateLimitedCartProcedure.input(z.object({
    productId: z.string(),
    color: z.string(),
    size: z.string(),
  })).mutation(async ({ ctx, input }) => {
    const user = ctx.session.user;
    const { productId, color, size } = input;
    await db.cartItem.deleteMany({
      where: {
        userId: user.id,
        productId,
        color,
        size,
      },
    });
    return { success: true, message: "Item removed from cart" };
  }),
});
