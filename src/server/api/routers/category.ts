import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  // Get all categories
  getAll: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: {
            products: {
              where: { active: true },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return categories.map((category) => ({
      ...category,
      productCount: category._count.products,
      _count: undefined,
    }));
  }),

  // Get category by slug with products
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: { slug: input.slug },
        include: {
          products: {
            where: { active: true },
            include: {
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
          },
        },
      });

      if (!category) {
        throw new Error("Category not found");
      }

      // Convert Decimal to number for products
      return {
        ...category,
        products: category.products.map((product) => ({
          ...product,
          price: product.price.toNumber(),
        })),
      };
    }),
});