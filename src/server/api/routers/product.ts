import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

// Mock product data for development
const mockProducts = [
  {
    id: "1",
    name: "Classic Black T-Shirt",
    slug: "classic-black-tshirt",
    description: "Premium cotton t-shirt in classic black. Perfect for everyday wear.",
    price: 29.99,
    images: ["/products/black-tshirt-1.jpg", "/products/black-tshirt-2.jpg"],
    category: { id: "1", name: "Men", slug: "men" },
    categoryId: "1",
    featured: true,
    active: true,
    variants: [
      { id: "1", size: "S", color: "Black", inventory: 10 },
      { id: "2", size: "M", color: "Black", inventory: 15 },
      { id: "3", size: "L", color: "Black", inventory: 12 },
      { id: "4", size: "XL", color: "Black", inventory: 8 },
    ],
  },
  {
    id: "2", 
    name: "White Cotton Tee",
    slug: "white-cotton-tee",
    description: "Soft and comfortable white cotton t-shirt. A wardrobe essential.",
    price: 24.99,
    images: ["/products/white-tshirt-1.jpg", "/products/white-tshirt-2.jpg"],
    category: { id: "2", name: "Women", slug: "women" },
    categoryId: "2",
    featured: true,
    active: true,
    variants: [
      { id: "5", size: "XS", color: "White", inventory: 8 },
      { id: "6", size: "S", color: "White", inventory: 12 },
      { id: "7", size: "M", color: "White", inventory: 15 },
      { id: "8", size: "L", color: "White", inventory: 10 },
    ],
  },
  {
    id: "3",
    name: "Vintage Band Tee",
    slug: "vintage-band-tee",
    description: "Retro-style band t-shirt with vintage wash finish.",
    price: 34.99,
    images: ["/products/band-tshirt-1.jpg", "/products/band-tshirt-2.jpg"],
    category: { id: "1", name: "Men", slug: "men" },
    categoryId: "1",
    featured: false,
    active: true,
    variants: [
      { id: "9", size: "M", color: "Gray", inventory: 6 },
      { id: "10", size: "L", color: "Gray", inventory: 4 },
      { id: "11", size: "XL", color: "Gray", inventory: 3 },
    ],
  },
  {
    id: "4",
    name: "Kids Rainbow Tee",
    slug: "kids-rainbow-tee",
    description: "Colorful rainbow design t-shirt perfect for kids.",
    price: 19.99,
    images: ["/products/kids-rainbow-1.jpg", "/products/kids-rainbow-2.jpg"],
    category: { id: "3", name: "Kids", slug: "kids" },
    categoryId: "3",
    featured: true,
    active: true,
    variants: [
      { id: "12", size: "XS", color: "Multi", inventory: 15 },
      { id: "13", size: "S", color: "Multi", inventory: 12 },
      { id: "14", size: "M", color: "Multi", inventory: 8 },
    ],
  },
];

export const productRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ 
      category: z.string().optional(),
      featured: z.boolean().optional(),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ input }) => {
      let filteredProducts = mockProducts;

      if (input.category) {
        filteredProducts = filteredProducts.filter(p => p.category.slug === input.category);
      }

      if (input.featured !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.featured === input.featured);
      }

      return filteredProducts.slice(0, input.limit);
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const product = mockProducts.find(p => p.slug === input.slug);

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    }),

  getFeatured: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(10).default(6) }))
    .query(async ({ input }) => {
      return mockProducts.filter(p => p.featured).slice(0, input.limit);
    }),

  search: publicProcedure
    .input(z.object({ 
      query: z.string().min(1),
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ input }) => {
      const filteredProducts = mockProducts.filter(p => 
        p.name.toLowerCase().includes(input.query.toLowerCase()) ||
        p.description.toLowerCase().includes(input.query.toLowerCase())
      );

      return filteredProducts.slice(0, input.limit);
    }),
});