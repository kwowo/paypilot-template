import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "@/server/api/trpc";

export const productRouter = createTRPCRouter({
  // Get all products with optional filtering
  getAll: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      featured: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          active: true,
          ...(input.category && {
            category: {
              slug: input.category,
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
        },
        orderBy: { createdAt: "desc" },
        take: input.limit,
        skip: input.offset,
      });

      return products.map((product: any) => ({
        ...product,
        price: product.price.toNumber(),
        salePrice: product.salePrice?.toNumber(),
      }));
    }),

  // Get single product by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { slug: input.slug, active: true },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      return {
        ...product,
        price: product.price.toNumber(),
        salePrice: product.salePrice?.toNumber(),
      };
    }),

  // Get featured products
  getFeatured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(20).default(8) }))
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.product.findMany({
        where: {
          active: true,
          featured: true,
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
        orderBy: { createdAt: "desc" },
        take: input.limit,
      });

      return products.map((product: any) => ({
        ...product,
        price: product.price.toNumber(),
        salePrice: product.salePrice?.toNumber(),
      }));
    }),

  // Admin: Create product
  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      price: z.number().positive(),
      salePrice: z.number().positive().optional(),
      images: z.array(z.string().url()),
      sizes: z.array(z.enum(["XS", "S", "M", "L", "XL", "XXL"])),
      colors: z.array(z.string().min(1)),
      inventory: z.number().min(0).default(0),
      featured: z.boolean().default(false),
      categoryId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.create({
        data: input,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
    }),

  // Admin: Update product
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      slug: z.string().min(1).optional(),
      description: z.string().optional(),
      price: z.number().positive().optional(),
      salePrice: z.number().positive().optional(),
      images: z.array(z.string().url()).optional(),
      sizes: z.array(z.enum(["XS", "S", "M", "L", "XL", "XXL"])).optional(),
      colors: z.array(z.string().min(1)).optional(),
      inventory: z.number().min(0).optional(),
      featured: z.boolean().optional(),
      active: z.boolean().optional(),
      categoryId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.product.update({
        where: { id },
        data,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });
    }),

  // Admin: Delete product
  remove: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.delete({
        where: { id: input.id },
      });
    }),
});