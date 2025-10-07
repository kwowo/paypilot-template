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
        description: "Comfortable and stylish t-shirts for men",
        image: "/products/placeholder.svg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "womens" },
      update: {},
      create: {
        name: "Women's T-Shirts",
        slug: "womens", 
        description: "Trendy and comfortable t-shirts for women",
        image: "/products/placeholder.svg",
      },
    }),
    prisma.category.upsert({
      where: { slug: "unisex" },
      update: {},
      create: {
        name: "Unisex T-Shirts",
        slug: "unisex",
        description: "Classic t-shirts for everyone",
        image: "/products/placeholder.svg",
      },
    }),
  ]);

  console.log("✅ Categories created");

  // Create products
  const products = [
    {
      name: "Classic Black Tee",
      slug: "classic-black-tee",
      description: "A timeless black t-shirt made from 100% organic cotton. Perfect for any occasion.",
      price: 29.99,
      images: ["/products/placeholder.svg"],
      featured: true,
      categoryId: categories[2].id, // unisex
      variants: [
        { size: "S", color: "Black", stock: 50, sku: "CBT-S-BLK" },
        { size: "M", color: "Black", stock: 75, sku: "CBT-M-BLK" },
        { size: "L", color: "Black", stock: 60, sku: "CBT-L-BLK" },
        { size: "XL", color: "Black", stock: 40, sku: "CBT-XL-BLK" },
      ],
    },
    {
      name: "Vintage White Tee",
      slug: "vintage-white-tee",
      description: "Soft vintage-style white t-shirt with a relaxed fit.",
      price: 24.99,
      images: ["/products/placeholder.svg"],
      featured: true,
      categoryId: categories[2].id, // unisex
      variants: [
        { size: "S", color: "White", stock: 45, sku: "VWT-S-WHT" },
        { size: "M", color: "White", stock: 70, sku: "VWT-M-WHT" },
        { size: "L", color: "White", stock: 55, sku: "VWT-L-WHT" },
        { size: "XL", color: "White", stock: 35, sku: "VWT-XL-WHT" },
      ],
    },
    {
      name: "Men's Navy Crew",
      slug: "mens-navy-crew",
      description: "Premium navy blue crew neck t-shirt for men. Made from soft cotton blend.",
      price: 32.99,
      images: ["/products/placeholder.svg"],
      featured: false,
      categoryId: categories[0].id, // mens
      variants: [
        { size: "S", color: "Navy", stock: 30, sku: "MNC-S-NVY" },
        { size: "M", color: "Navy", stock: 50, sku: "MNC-M-NVY" },
        { size: "L", color: "Navy", stock: 45, sku: "MNC-L-NVY" },
        { size: "XL", color: "Navy", stock: 25, sku: "MNC-XL-NVY" },
        { size: "XXL", color: "Navy", stock: 15, sku: "MNC-XXL-NVY" },
      ],
    },
    {
      name: "Women's Pink V-Neck",
      slug: "womens-pink-v-neck",
      description: "Flattering pink v-neck t-shirt designed specifically for women.",
      price: 27.99,
      images: ["/products/placeholder.svg"],
      featured: true,
      categoryId: categories[1].id, // womens
      variants: [
        { size: "XS", color: "Pink", stock: 25, sku: "WPV-XS-PNK" },
        { size: "S", color: "Pink", stock: 40, sku: "WPV-S-PNK" },
        { size: "M", color: "Pink", stock: 55, sku: "WPV-M-PNK" },
        { size: "L", color: "Pink", stock: 35, sku: "WPV-L-PNK" },
        { size: "XL", color: "Pink", stock: 20, sku: "WPV-XL-PNK" },
      ],
    },
    {
      name: "Graphic Print Tee",
      slug: "graphic-print-tee",
      description: "Cool graphic print t-shirt with modern design. Available in multiple colors.",
      price: 35.99,
      images: ["/products/placeholder.svg"],
      featured: false,
      categoryId: categories[2].id, // unisex
      variants: [
        { size: "S", color: "Gray", stock: 20, sku: "GPT-S-GRY" },
        { size: "M", color: "Gray", stock: 30, sku: "GPT-M-GRY" },
        { size: "L", color: "Gray", stock: 25, sku: "GPT-L-GRY" },
        { size: "S", color: "Blue", stock: 15, sku: "GPT-S-BLU" },
        { size: "M", color: "Blue", stock: 25, sku: "GPT-M-BLU" },
        { size: "L", color: "Blue", stock: 20, sku: "GPT-L-BLU" },
      ],
    },
    {
      name: "Eco-Friendly Bamboo Tee",
      slug: "eco-bamboo-tee",
      description: "Sustainable t-shirt made from bamboo fiber. Soft, breathable, and eco-friendly.",
      price: 39.99,
      images: ["/products/placeholder.svg"],
      featured: true,
      categoryId: categories[2].id, // unisex
      variants: [
        { size: "S", color: "Green", stock: 30, sku: "EBT-S-GRN" },
        { size: "M", color: "Green", stock: 45, sku: "EBT-M-GRN" },
        { size: "L", color: "Green", stock: 40, sku: "EBT-L-GRN" },
        { size: "XL", color: "Green", stock: 25, sku: "EBT-XL-GRN" },
      ],
    },
  ];

  for (const productData of products) {
    const { variants, ...product } = productData;
    
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        price: product.price,
      },
    });

    // Create variants
    for (const variant of variants) {
      await prisma.productVariant.upsert({
        where: { sku: variant.sku },
        update: {},
        create: {
          ...variant,
          productId: createdProduct.id,
        },
      });
    }
  }

  console.log("✅ Products and variants created");

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@tshirtstore.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@tshirtstore.com",
      emailVerified: true,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created");
  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });