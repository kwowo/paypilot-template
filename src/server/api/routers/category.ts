import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// Mock category data
const mockCategories = [
  {
    id: "1",
    name: "Men",
    slug: "men",
    description: "T-shirts for men",
    image: "/categories/men.jpg",
    active: true,
    _count: { products: 2 },
  },
  {
    id: "2",
    name: "Women",
    slug: "women", 
    description: "T-shirts for women",
    image: "/categories/women.jpg",
    active: true,
    _count: { products: 1 },
  },
  {
    id: "3",
    name: "Kids",
    slug: "kids",
    description: "T-shirts for kids",
    image: "/categories/kids.jpg", 
    active: true,
    _count: { products: 1 },
  },
];

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure
    .query(async () => {
      return mockCategories;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const category = mockCategories.find(c => c.slug === input.slug);

      if (!category) {
        throw new Error("Category not found");
      }

      // Mock products for this category
      const mockProducts = [
        {
          id: "1",
          name: "Classic Black T-Shirt",
          slug: "classic-black-tshirt",
          description: "Premium cotton t-shirt in classic black.",
          price: 29.99,
          images: ["/products/black-tshirt-1.jpg"],
          variants: [
            { id: "1", size: "S", color: "Black", inventory: 10 },
            { id: "2", size: "M", color: "Black", inventory: 15 },
          ],
        },
      ];

      return {
        ...category,
        products: mockProducts.filter(() => true), // All products for now
      };
    }),
});