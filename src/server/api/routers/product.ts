import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const productRouter = createTRPCRouter({
  // Get all products with filtering
  getAll: publicProcedure
    .input(
      z.object({
        categorySlug: z.string().optional(),
        featured: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { categorySlug, featured, limit, cursor } = input;

      const products = await ctx.db.product.findMany({
        where: {
          active: true,
          ...(categorySlug && {
            category: {
              slug: categorySlug,
            },
          }),
          ...(featured !== undefined && { featured }),
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
            where: { active: true },
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
        take: limit + 1,
        ...(cursor && {
          cursor: {
            id: cursor,
          },
          skip: 1,
        }),
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (products.length > limit) {
        const nextItem = products.pop();
        nextCursor = nextItem!.id;
      }

      // Convert Decimal to number for serialization
      return {
        products: products.map((product) => ({
          ...product,
          price: product.price.toNumber(),
        })),
        nextCursor,
      };
    }),

  // Get product by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: {
          slug: input.slug,
          active: true,
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
            where: { active: true },
            select: {
              id: true,
              size: true,
              color: true,
              stock: true,
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

      // Convert Decimal to number
      return {
        ...product,
        price: product.price.toNumber(),
      };
    }),

  // Search products
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          active: true,
          OR: [
            {
              name: {
                contains: input.query,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: input.query,
                mode: "insensitive",
              },
            },
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
          variants: {
            where: { active: true },
            select: {
              id: true,
              size: true,
              color: true,
              stock: true,
            },
          },
        },
        take: input.limit,
        orderBy: {
          createdAt: "desc",
        },
      });

      // Convert Decimal to number
      return products.map((product) => ({
        ...product,
        price: product.price.toNumber(),
      }));
    }),

  // Get available sizes and colors for filtering
  getFilters: publicProcedure.query(async ({ ctx }) => {
    const variants = await ctx.db.productVariant.findMany({
      where: { active: true },
      select: {
        size: true,
        color: true,
      },
      distinct: ["size", "color"],
    });

    const sizes = Array.from(new Set(variants.map((v) => v.size))).sort();
    const colors = Array.from(new Set(variants.map((v) => v.color))).sort();

    return { sizes, colors };
  }),
});