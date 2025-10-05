import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const productRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        categorySlug: z.string().optional(),
        featured: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(20),
        page: z.number().min(1).default(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { categorySlug, featured, limit, page } = input;
      const offset = (page - 1) * limit;

      const where: any = { active: true };

      if (categorySlug) {
        where.category = { slug: categorySlug };
      }

      if (featured !== undefined) {
        where.featured = featured;
      }

      const [products, total] = await Promise.all([
        ctx.db.product.findMany({
          where,
          include: {
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: limit,
          skip: offset,
        }),
        ctx.db.product.count({ where }),
      ]);

      return {
        products: products.map((product) => ({
          ...product,
          price: product.price.toNumber(),
        })),
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { slug: input.slug, active: true },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
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

  getFeatured: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      where: { featured: true, active: true },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    return products.map((product) => ({
      ...product,
      price: product.price.toNumber(),
    }));
  }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          active: true,
          OR: [
            { name: { contains: input.query, mode: "insensitive" } },
            { description: { contains: input.query, mode: "insensitive" } },
          ],
        },
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        take: input.limit,
        orderBy: { createdAt: "desc" },
      });

      return products.map((product) => ({
        ...product,
        price: product.price.toNumber(),
      }));
    }),
});