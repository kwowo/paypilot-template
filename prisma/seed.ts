import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create categories
  const menCategory = await prisma.category.upsert({
    where: { slug: "men" },
    update: {},
    create: {
      name: "Men",
      slug: "men",
      description: "T-shirts for men",
      image: "/categories/men.jpg",
    },
  });

  const womenCategory = await prisma.category.upsert({
    where: { slug: "women" },
    update: {},
    create: {
      name: "Women",
      slug: "women", 
      description: "T-shirts for women",
      image: "/categories/women.jpg",
    },
  });

  const kidsCategory = await prisma.category.upsert({
    where: { slug: "kids" },
    update: {},
    create: {
      name: "Kids",
      slug: "kids",
      description: "T-shirts for kids",
      image: "/categories/kids.jpg",
    },
  });

  // Create products
  const blackTshirt = await prisma.product.upsert({
    where: { slug: "classic-black-tshirt" },
    update: {},
    create: {
      name: "Classic Black T-Shirt",
      slug: "classic-black-tshirt",
      description: "Premium cotton t-shirt in classic black. Perfect for everyday wear.",
      price: 29.99,
      images: ["/products/black-tshirt-1.jpg", "/products/black-tshirt-2.jpg"],
      categoryId: menCategory.id,
      featured: true,
    },
  });

  const whiteTee = await prisma.product.upsert({
    where: { slug: "white-cotton-tee" },
    update: {},
    create: {
      name: "White Cotton Tee",
      slug: "white-cotton-tee",
      description: "Soft and comfortable white cotton t-shirt. A wardrobe essential.",
      price: 24.99,
      images: ["/products/white-tshirt-1.jpg", "/products/white-tshirt-2.jpg"],
      categoryId: womenCategory.id,
      featured: true,
    },
  });

  const kidsRainbow = await prisma.product.upsert({
    where: { slug: "kids-rainbow-tee" },
    update: {},
    create: {
      name: "Kids Rainbow Tee",
      slug: "kids-rainbow-tee",
      description: "Colorful rainbow design t-shirt perfect for kids.",
      price: 19.99,
      images: ["/products/kids-rainbow-1.jpg", "/products/kids-rainbow-2.jpg"],
      categoryId: kidsCategory.id,
      featured: true,
    },
  });

  // Create product variants
  await prisma.productVariant.createMany({
    data: [
      // Black T-shirt variants
      { productId: blackTshirt.id, size: "S", color: "Black", inventory: 10 },
      { productId: blackTshirt.id, size: "M", color: "Black", inventory: 15 },
      { productId: blackTshirt.id, size: "L", color: "Black", inventory: 12 },
      { productId: blackTshirt.id, size: "XL", color: "Black", inventory: 8 },
      
      // White tee variants
      { productId: whiteTee.id, size: "XS", color: "White", inventory: 8 },
      { productId: whiteTee.id, size: "S", color: "White", inventory: 12 },
      { productId: whiteTee.id, size: "M", color: "White", inventory: 15 },
      { productId: whiteTee.id, size: "L", color: "White", inventory: 10 },
      
      // Kids rainbow variants
      { productId: kidsRainbow.id, size: "XS", color: "Multi", inventory: 15 },
      { productId: kidsRainbow.id, size: "S", color: "Multi", inventory: 12 },
      { productId: kidsRainbow.id, size: "M", color: "Multi", inventory: 8 },
    ],
    skipDuplicates: true,
  });

  console.log("Database seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });