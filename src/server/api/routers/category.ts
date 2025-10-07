import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  // Get all categories
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.category.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: {
                active: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });
  }),

  // Get category by slug with products
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          products: {
            where: {
              active: true,
            },
            include: {
              variants: {
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
          },
        },
      });

      if (!category) {
        return null;
      }

      return {
        ...category,
        products: category.products.map((product) => ({
          ...product,
          price: product.price.toNumber(),
        })),
      };
    }),
});