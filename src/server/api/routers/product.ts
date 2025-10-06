import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        categorySlug: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          isActive: true,
          ...(input.categorySlug && {
            category: { slug: input.categorySlug },
          }),
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          variants: {
            select: {
              id: true,
              size: true,
              color: true,
              stock: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        ...(input.cursor && {
          cursor: { id: input.cursor },
          skip: 1,
        }),
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (products.length > input.limit) {
        const nextItem = products.pop();
        nextCursor = nextItem!.id;
      }

      return {
        products: products.map(product => ({
          ...product,
          price: product.price.toNumber(),
        })),
        nextCursor,
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { slug: input.slug },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          variants: {
            select: {
              id: true,
              size: true,
              color: true,
              stock: true,
              sku: true,
            },
            orderBy: [
              { size: "asc" },
              { color: "asc" },
            ],
          },
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      return {
        ...product,
        price: product.price.toNumber(),
      };
    }),

  getFeatured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(8) }))
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: { isActive: true },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: input.limit,
      });

      return products.map(product => ({
        ...product,
        price: product.price.toNumber(),
      }));
    }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: input.query, mode: "insensitive" } },
            { description: { contains: input.query, mode: "insensitive" } },
          ],
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        take: input.limit,
        orderBy: { createdAt: "desc" },
      });

      return products.map(product => ({
        ...product,
        price: product.price.toNumber(),
      }));
    }),
});