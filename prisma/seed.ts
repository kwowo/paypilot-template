import { db } from "../src/server/db";

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  const categories = await Promise.all([
    db.category.create({
      data: {
        name: "Men's T-Shirts",
        slug: "mens-tshirts",
        description: "High-quality t-shirts for men",
        image: "/categories/mens-tshirts.jpg",
      },
    }),
    db.category.create({
      data: {
        name: "Women's T-Shirts",
        slug: "womens-tshirts", 
        description: "Stylish t-shirts for women",
        image: "/categories/womens-tshirts.jpg",
      },
    }),
    db.category.create({
      data: {
        name: "Unisex T-Shirts",
        slug: "unisex-tshirts",
        description: "T-shirts for everyone",
        image: "/categories/unisex-tshirts.jpg",
      },
    }),
    db.category.create({
      data: {
        name: "Kids T-Shirts",
        slug: "kids-tshirts",
        description: "Fun t-shirts for kids",
        image: "/categories/kids-tshirts.jpg",
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
      salePrice: 19.99,
      images: [
        "/products/classic-cotton-tee-black.jpg",
        "/products/classic-cotton-tee-white.jpg",
        "/products/classic-cotton-tee-gray.jpg",
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Black", "White", "Gray", "Navy", "Red"],
      inventory: 100,
      featured: true,
      categoryId: categories[2].id, // Unisex
    },
    {
      name: "Graphic Print Tee - 'Adventure Awaits'",
      slug: "adventure-awaits-graphic-tee",
      description: "Bold graphic design for the adventurous spirit. Premium quality print that won't fade.",
      price: 29.99,
      images: [
        "/products/adventure-awaits-tee-main.jpg",
        "/products/adventure-awaits-tee-back.jpg",
      ],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Forest Green", "Navy", "Charcoal"],
      inventory: 75,
      featured: true,
      categoryId: categories[2].id, // Unisex
    },
    {
      name: "Women's V-Neck Tee",
      slug: "womens-vneck-tee",
      description: "Flattering v-neck cut with a soft, breathable fabric blend. Perfect for layering or wearing alone.",
      price: 26.99,
      salePrice: 22.99,
      images: [
        "/products/womens-vneck-pink.jpg",
        "/products/womens-vneck-lavender.jpg",
        "/products/womens-vneck-mint.jpg",
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Pink", "Lavender", "Mint", "Coral", "White"],
      inventory: 85,
      featured: true,
      categoryId: categories[1].id, // Women's
    },
    {
      name: "Men's Muscle Fit Tee",
      slug: "mens-muscle-fit-tee",
      description: "Athletic cut designed to show off your physique. Made with moisture-wicking fabric.",
      price: 32.99,
      images: [
        "/products/mens-muscle-black.jpg",
        "/products/mens-muscle-gray.jpg",
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Black", "Gray", "Navy", "Maroon"],
      inventory: 60,
      featured: false,
      categoryId: categories[0].id, // Men's
    },
    {
      name: "Kids Dinosaur Tee",
      slug: "kids-dinosaur-tee",
      description: "Fun dinosaur design that kids love! Soft fabric that's gentle on sensitive skin.",
      price: 18.99,
      images: [
        "/products/kids-dinosaur-green.jpg",
        "/products/kids-dinosaur-blue.jpg",
      ],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Green", "Blue", "Orange"],
      inventory: 40,
      featured: true,
      categoryId: categories[3].id, // Kids
    },
    {
      name: "Vintage Wash Tee",
      slug: "vintage-wash-tee",
      description: "Pre-washed for that perfect vintage look and feel. Gets softer with every wash.",
      price: 35.99,
      salePrice: 28.99,
      images: [
        "/products/vintage-wash-faded-blue.jpg",
        "/products/vintage-wash-stone.jpg",
      ],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Faded Blue", "Stone", "Rust", "Olive"],
      inventory: 55,
      featured: false,
      categoryId: categories[2].id, // Unisex
    },
    {
      name: "Organic Cotton Basic Tee",
      slug: "organic-cotton-basic-tee",
      description: "Made from 100% certified organic cotton. Sustainable and comfortable.",
      price: 39.99,
      images: [
        "/products/organic-cotton-natural.jpg",
        "/products/organic-cotton-cream.jpg",
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Natural", "Cream", "Light Gray"],
      inventory: 70,
      featured: true,
      categoryId: categories[2].id, // Unisex
    },
    {
      name: "Women's Crop Top Tee",
      slug: "womens-crop-top-tee",
      description: "Trendy cropped length with a relaxed fit. Perfect for high-waisted bottoms.",
      price: 24.99,
      images: [
        "/products/womens-crop-black.jpg",
        "/products/womens-crop-white.jpg",
      ],
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "White", "Pink", "Sage Green"],
      inventory: 45,
      featured: false,
      categoryId: categories[1].id, // Women's
    },
  ];

  for (const product of products) {
    await db.product.create({
      data: {
        ...product,
        sizes: product.sizes as any,
      },
    });
  }

  console.log("✅ Products created");

  // Create admin user
  const adminUser = await db.user.create({
    data: {
      name: "Admin User",
      email: "admin@tshirtstore.com",
      emailVerified: true,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created");
  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });