import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "mens" },
      update: {},
      create: {
        name: "Men's T-Shirts",
        slug: "mens",
        description: "Premium quality men's t-shirts in various styles and colors",
        image: "/categories/mens.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "womens" },
      update: {},
      create: {
        name: "Women's T-Shirts",
        slug: "womens",
        description: "Stylish and comfortable women's t-shirts for every occasion",
        image: "/categories/womens.jpg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "unisex" },
      update: {},
      create: {
        name: "Unisex T-Shirts",
        slug: "unisex",
        description: "Versatile unisex t-shirts perfect for everyone",
        image: "/categories/unisex.jpg",
      },
    }),
  ]);

  console.log("✅ Categories created");

  // Create products
  const products = [
    {
      name: "Classic Cotton Tee",
      slug: "classic-cotton-tee",
      description: "A timeless classic made from 100% premium cotton. Soft, comfortable, and perfect for everyday wear.",
      price: 24.99,
      image: "/products/classic-cotton-tee.jpg",
      images: [
        "/products/classic-cotton-tee.jpg",
        "/products/classic-cotton-tee-2.jpg",
        "/products/classic-cotton-tee-3.jpg",
      ],
      stock: 50,
      sizes: ["S", "M", "L", "XL"] as any[],
      colors: ["BLACK", "WHITE", "GRAY", "BLUE"] as any[],
      featured: true,
      categoryId: categories[2].id, // Unisex
    },
    {
      name: "Premium Organic Tee",
      slug: "premium-organic-tee",
      description: "Eco-friendly organic cotton t-shirt with a modern fit. Sustainably made and incredibly soft.",
      price: 34.99,
      image: "/products/premium-organic-tee.jpg",
      images: [
        "/products/premium-organic-tee.jpg",
        "/products/premium-organic-tee-2.jpg",
      ],
      stock: 30,
      sizes: ["XS", "S", "M", "L", "XL"] as any[],
      colors: ["WHITE", "GRAY", "GREEN", "BLACK"] as any[],
      featured: true,
      categoryId: categories[2].id, // Unisex
    },
    {
      name: "Vintage Graphic Tee",
      slug: "vintage-graphic-tee",
      description: "Retro-style graphic t-shirt with a vintage wash. Perfect for making a statement.",
      price: 29.99,
      image: "/products/vintage-graphic-tee.jpg",
      images: [
        "/products/vintage-graphic-tee.jpg",
        "/products/vintage-graphic-tee-2.jpg",
        "/products/vintage-graphic-tee-3.jpg",
      ],
      stock: 25,
      sizes: ["S", "M", "L", "XL", "XXL"] as any[],
      colors: ["BLACK", "GRAY", "RED", "BLUE"] as any[],
      featured: false,
      categoryId: categories[0].id, // Men's
    },
    {
      name: "Fitted V-Neck Tee",
      slug: "fitted-v-neck-tee",
      description: "Flattering fitted v-neck t-shirt with a feminine silhouette. Made from soft cotton blend.",
      price: 26.99,
      image: "/products/fitted-v-neck-tee.jpg",
      images: [
        "/products/fitted-v-neck-tee.jpg",
        "/products/fitted-v-neck-tee-2.jpg",
      ],
      stock: 40,
      sizes: ["XS", "S", "M", "L", "XL"] as any[],
      colors: ["WHITE", "BLACK", "PINK", "PURPLE", "BLUE"] as any[],
      featured: true,
      categoryId: categories[1].id, // Women's
    },
    {
      name: "Muscle Tank Top",
      slug: "muscle-tank-top",
      description: "Sleeveless muscle tank perfect for workouts or casual wear. Lightweight and breathable.",
      price: 19.99,
      image: "/products/muscle-tank-top.jpg",
      images: [
        "/products/muscle-tank-top.jpg",
        "/products/muscle-tank-top-2.jpg",
      ],
      stock: 35,
      sizes: ["S", "M", "L", "XL", "XXL"] as any[],
      colors: ["BLACK", "WHITE", "GRAY", "RED"] as any[],
      featured: false,
      categoryId: categories[0].id, // Men's
    },
    {
      name: "Oversized Comfort Tee",
      slug: "oversized-comfort-tee",
      description: "Relaxed oversized fit t-shirt for ultimate comfort. Perfect for lounging or street style.",
      price: 32.99,
      image: "/products/oversized-comfort-tee.jpg",
      images: [
        "/products/oversized-comfort-tee.jpg",
        "/products/oversized-comfort-tee-2.jpg",
        "/products/oversized-comfort-tee-3.jpg",
      ],
      stock: 45,
      sizes: ["S", "M", "L", "XL"] as any[],
      colors: ["BLACK", "WHITE", "GRAY", "PINK", "YELLOW"] as any[],
      featured: false,
      categoryId: categories[1].id, // Women's
    },
    {
      name: "Performance Athletic Tee",
      slug: "performance-athletic-tee",
      description: "Moisture-wicking performance t-shirt designed for active lifestyles. Quick-dry technology.",
      price: 39.99,
      image: "/products/performance-athletic-tee.jpg",
      images: [
        "/products/performance-athletic-tee.jpg",
        "/products/performance-athletic-tee-2.jpg",
      ],
      stock: 60,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"] as any[],
      colors: ["BLACK", "WHITE", "BLUE", "RED", "GREEN"] as any[],
      featured: true,
      categoryId: categories[2].id, // Unisex
    },
    {
      name: "Striped Long Sleeve Tee",
      slug: "striped-long-sleeve-tee",
      description: "Classic striped long sleeve t-shirt with a timeless design. Perfect for layering.",
      price: 36.99,
      image: "/products/striped-long-sleeve-tee.jpg",
      images: [
        "/products/striped-long-sleeve-tee.jpg",
        "/products/striped-long-sleeve-tee-2.jpg",
      ],
      stock: 20,
      sizes: ["S", "M", "L", "XL"] as any[],
      colors: ["WHITE", "BLUE", "RED", "GREEN"] as any[],
      featured: false,
      categoryId: categories[2].id, // Unisex
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });
  }

  console.log("✅ Products created");

  // Create a test user with admin role
  await prisma.user.upsert({
    where: { email: "admin@tshirtstore.com" },
    update: {},
    create: {
      name: "Store Admin",
      email: "admin@tshirtstore.com",
      emailVerified: true,
      role: "ADMIN" as any, // Type assertion for now
    },
  });

  console.log("✅ Test user created");
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });