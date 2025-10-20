import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const productRouter = createTRPCRouter({
  // Get all products with optional filtering
  getAll: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          featured: z.boolean().optional(),
          limit: z.number().min(1).max(100).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          isActive: true,
          ...(input?.category && { category: input.category }),
        },
        include: {
          variants: true,
        },
        take: input?.limit,
        orderBy: {
          createdAt: "desc",
        },
      });

      // Convert price from cents to dollars and ensure variants are properly typed
      return products.map((product) => ({
        ...product,
        price: product.price / 100,
        originalPrice: product.originalPrice ? product.originalPrice / 100 : null,
        variants: product.variants,
      }));
    }),

  // Get single product by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: {
          id: input.id,
        },
        include: {
          variants: true,
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      return {
        ...product,
        price: product.price / 100,
        originalPrice: product.originalPrice ? product.originalPrice / 100 : null,
        variants: product.variants,
      };
    }),

  // Get product by slug (for URL-friendly routing)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      // Since we don't have a slug field, we'll use the id
      // In a real app, you'd add a slug field to the schema
      const product = await ctx.db.product.findFirst({
        where: {
          id: input.slug,
          isActive: true,
        },
        include: {
          variants: true,
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      return {
        ...product,
        price: product.price / 100,
        originalPrice: product.originalPrice ? product.originalPrice / 100 : null,
        variants: product.variants,
      };
    }),

  // Get all categories
  getCategories: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      where: {
        isActive: true,
      },
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    return products
      .map((p) => p.category)
      .filter((cat): cat is string => cat !== null)
      .map((category) => ({
        slug: category,
        name: category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " "),
      }));
  }),

  // Get products by category
  getByCategory: publicProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          category: input.category,
          isActive: true,
        },
        include: {
          variants: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return products.map((product) => ({
        ...product,
        price: product.price / 100,
        originalPrice: product.originalPrice ? product.originalPrice / 100 : null,
        variants: product.variants,
      }));
    }),
});
