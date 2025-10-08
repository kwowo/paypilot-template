import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany(); 
  await prisma.cartItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Graphic Tees",
        slug: "graphic-tees",
      },
    }),
    prisma.category.create({
      data: {
        name: "Plain Tees", 
        slug: "plain-tees",
      },
    }),
    prisma.category.create({
      data: {
        name: "Vintage",
        slug: "vintage",
      },
    }),
    prisma.category.create({
      data: {
        name: "Sports",
        slug: "sports",
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create products (t-shirts)
  const products = [
    {
      name: "Classic Logo Tee",
      slug: "classic-logo-tee",
      description: "Premium cotton t-shirt with our classic logo design. Comfortable fit for everyday wear.",
      price: 29.99,
      categoryId: categories[0]!.id, // Graphic Tees
      featured: true,
      images: [], // Using CSS placeholders only
    },
    {
      name: "Vintage Band Tee",
      slug: "vintage-band-tee", 
      description: "Retro-style band t-shirt with distressed print. Perfect for music lovers.",
      price: 34.99,
      categoryId: categories[2]!.id, // Vintage
      featured: true,
      images: [],
    },
    {
      name: "Plain White Tee",
      slug: "plain-white-tee",
      description: "Essential plain white t-shirt. 100% organic cotton, soft and breathable.",
      price: 19.99,
      categoryId: categories[1]!.id, // Plain Tees
      featured: false,
      images: [],
    },
    {
      name: "Sports Performance Tee",
      slug: "sports-performance-tee",
      description: "Moisture-wicking athletic t-shirt. Perfect for workouts and active lifestyle.",
      price: 39.99,
      categoryId: categories[3]!.id, // Sports
      featured: true,
      images: [],
    },
    {
      name: "Abstract Art Tee",
      slug: "abstract-art-tee",
      description: "Unique abstract design on premium cotton. Limited edition artistic collection.",
      price: 32.99,
      categoryId: categories[0]!.id, // Graphic Tees
      featured: false,
      images: [],
    },
    {
      name: "Plain Black Tee", 
      slug: "plain-black-tee",
      description: "Essential plain black t-shirt. Classic fit, comfortable and versatile.",
      price: 19.99,
      categoryId: categories[1]!.id, // Plain Tees
      featured: false,
      images: [],
    },
    {
      name: "Retro Gaming Tee",
      slug: "retro-gaming-tee",
      description: "Nostalgic gaming-themed design. Perfect for gamers and retro enthusiasts.",
      price: 27.99,
      categoryId: categories[0]!.id, // Graphic Tees
      featured: true,
      images: [],
    },
    {
      name: "Athletic Training Tee",
      slug: "athletic-training-tee", 
      description: "Professional training t-shirt with advanced fabric technology.",
      price: 44.99,
      categoryId: categories[3]!.id, // Sports
      featured: false,
      images: [],
    },
  ];

  const createdProducts = [];
  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData,
    });
    createdProducts.push(product);
  }

  console.log(`✅ Created ${createdProducts.length} products`);

  // Create variants for each product (different sizes and colors)
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["Black", "White", "Navy", "Gray", "Red"];

  for (const product of createdProducts) {
    const variants = [];
    
    // Create variants for each size/color combination
    for (const size of sizes) {
      for (const color of colors) {
        // Skip some combinations to make it realistic
        if (product.slug === "plain-white-tee" && color !== "White") continue;
        if (product.slug === "plain-black-tee" && color !== "Black") continue;
        
        variants.push({
          size,
          color,
          stock: Math.floor(Math.random() * 50) + 10, // Random stock 10-59
          productId: product.id,
        });
      }
    }

    await prisma.productVariant.createMany({
      data: variants,
    });
  }

  console.log("✅ Created product variants");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });