import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('Clearing existing product data...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});

  // Create products
  console.log('Creating products...');

  const product1 = await prisma.product.create({
    data: {
      id: 'product-1',
      name: 'Classic Chronograph Watch',
      description: 'Elegant timepiece with chronograph functionality',
      price: 29999, // $299.99
      originalPrice: 39999, // $399.99
      imageUrl: '/api/placeholder/150/150',
      category: 'watches',
      stock: 1,
      isActive: true,
      variants: {
        create: [
          { type: 'color', value: 'Black', stock: 30 },
          { type: 'color', value: 'Silver', stock: 40 },
          { type: 'color', value: 'Gold', stock: 30 },
          { type: 'size', value: 'Standard', stock: 50 },
          { type: 'size', value: 'Large', stock: 50 },
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      id: 'product-2',
      name: 'Sport Diver Watch',
      description: 'Professional diving watch with 200m water resistance',
      price: 39998, // $399.98
      originalPrice: null,
      imageUrl: '/api/placeholder/150/150',
      category: 'watches',
      stock: 75,
      isActive: true,
      variants: {
        create: [
          { type: 'color', value: 'Blue', stock: 25 },
          { type: 'color', value: 'Black', stock: 30 },
          { type: 'color', value: 'Red', stock: 20 },
          { type: 'size', value: 'Standard', stock: 40 },
          { type: 'size', value: 'Large', stock: 35 },
        ],
      },
    },
  });

  const product3 = await prisma.product.create({
    data: {
      id: 'product-3',
      name: 'Smart Watch',
      description: 'Advanced smartwatch with fitness tracking',
      price: 24999, // $249.99
      originalPrice: null,
      imageUrl: '/placeholder-product.jpg',
      category: 'smartwatches',
      stock: 150,
      isActive: true,
      variants: {
        create: [
          { type: 'color', value: 'Silver', stock: 50 },
          { type: 'color', value: 'Black', stock: 60 },
          { type: 'color', value: 'Gold', stock: 40 },
          { type: 'size', value: '38mm', stock: 50 },
          { type: 'size', value: '42mm', stock: 60 },
          { type: 'size', value: '44mm', stock: 40 },
        ],
      },
    },
  });

  const product4 = await prisma.product.create({
    data: {
      id: 'product-4',
      name: 'Phone Case',
      description: 'Protective case for your smartphone',
      price: 1999, // $19.99
      originalPrice: null,
      imageUrl: '/placeholder-product.jpg',
      category: 'accessories',
      stock: 500,
      isActive: true,
      variants: {
        create: [
          { type: 'color', value: 'Clear', stock: 150 },
          { type: 'color', value: 'Black', stock: 150 },
          { type: 'color', value: 'Blue', stock: 100 },
          { type: 'color', value: 'Red', stock: 100 },
          { type: 'size', value: 'iPhone 14', stock: 150 },
          { type: 'size', value: 'iPhone 15', stock: 200 },
          { type: 'size', value: 'Samsung S24', stock: 150 },
        ],
      },
    },
  });

  console.log('Created products:', {
    product1: product1.name,
    product2: product2.name,
    product3: product3.name,
    product4: product4.name
  });
  console.log('Seeding finished successfully!');
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
