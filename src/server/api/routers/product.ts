import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";

export const productRouter = createTRPCRouter({
  // Get all products with optional filtering
  getAll: publicProcedure
    .input(
      z.object({
        categorySlug: z.string().optional(),
        featured: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          active: true,
          ...(input.categorySlug && {
            category: {
              slug: input.categorySlug,
            },
          }),
          ...(input.featured !== undefined && {
            featured: input.featured,
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
              sku: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: input.limit,
        skip: input.offset,
      });

      return products.map((product) => ({
        ...product,
        price: product.price.toNumber(),
      }));
    }),

  // Get single product by slug
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
            select: {
              id: true,
              size: true,
              color: true,
              stock: true,
              sku: true,
            },
          },
        },
      });

      if (!product) {
        return null;
      }

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
        },
        take: input.limit,
      });

      return products.map((product) => ({
        ...product,
        price: product.price.toNumber(),
      }));
    }),

  // Admin: Create product (temporarily disabled role check)
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        price: z.number().min(0),
        images: z.array(z.string()).default([]),
        categoryId: z.string(),
        featured: z.boolean().default(false),
        variants: z.array(
          z.object({
            size: z.string(),
            color: z.string(),
            stock: z.number().min(0),
            sku: z.string(),
          })
        ).default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Re-enable admin check when auth is fully configured
      // if (ctx.session.user.role !== "ADMIN") {
      //   throw new Error("Unauthorized");
      // }

      const { variants, ...productData } = input;

      const product = await ctx.db.product.create({
        data: {
          ...productData,
          price: productData.price,
        },
      });

      // Create variants
      if (variants.length > 0) {
        await ctx.db.productVariant.createMany({
          data: variants.map((variant) => ({
            ...variant,
            productId: product.id,
          })),
        });
      }

      return product;
    }),

  // Admin: Update product (temporarily disabled role check)
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().min(0).optional(),
        images: z.array(z.string()).optional(),
        featured: z.boolean().optional(),
        active: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Re-enable admin check when auth is fully configured
      // if (ctx.session.user.role !== "ADMIN") {
      //   throw new Error("Unauthorized");
      // }

      const { id, ...updateData } = input;

      return await ctx.db.product.update({
        where: { id },
        data: updateData,
      });
    }),

  // Admin: Delete product (temporarily disabled role check)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: Re-enable admin check when auth is fully configured
      // if (ctx.session.user.role !== "ADMIN") {
      //   throw new Error("Unauthorized");
      // }

      return await ctx.db.product.update({
        where: { id: input.id },
        data: { active: false },
      });
    }),
});