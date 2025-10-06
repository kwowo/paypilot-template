import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return categories;
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.category.findUnique({
        where: { slug: input.slug },
        include: {
          products: {
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
          },
        },
      });

      if (!category) {
        throw new Error("Category not found");
      }

      return {
        ...category,
        products: category.products.map(product => ({
          ...product,
          price: product.price.toNumber(),
        })),
      };
    }),
});