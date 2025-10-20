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
      name: 'Classic Cotton Tee',
      description: 'Soft and comfortable everyday t-shirt made from 100% premium cotton',
      price: 2499, // $24.99
      originalPrice: 2999, // $29.99
      imageUrl: '/api/placeholder/400/400',
      category: 'basics',
      stock: 200,
      isActive: true,
      variants: {
        create: [
          { type: 'color', value: 'White', stock: 50 },
          { type: 'color', value: 'Black', stock: 50 },
          { type: 'color', value: 'Navy', stock: 50 },
          { type: 'color', value: 'Gray', stock: 50 },
          { type: 'size', value: 'S', stock: 40 },
          { type: 'size', value: 'M', stock: 60 },
          { type: 'size', value: 'L', stock: 60 },
          { type: 'size', value: 'XL', stock: 40 },
        ],
      },
    },
  });

  const product2 = await prisma.product.create({
    data: {
      id: 'product-2',
      name: 'Graphic Print Tee',
      description: 'Express yourself with bold graphics on premium quality fabric',
      price: 2999, // $29.99
      originalPrice: null,
      imageUrl: '/api/placeholder/400/400',
      category: 'graphic',
      stock: 150,
      isActive: true,
      variants: {
        create: [
          { type: 'color', value: 'Black', stock: 40 },
          { type: 'color', value: 'White', stock: 40 },
          { type: 'color', value: 'Red', stock: 35 },
          { type: 'color', value: 'Blue', stock: 35 },
          { type: 'size', value: 'S', stock: 30 },
          { type: 'size', value: 'M', stock: 50 },
          { type: 'size', value: 'L', stock: 50 },
          { type: 'size', value: 'XL', stock: 20 },
        ],
      },
    },
  });

  const product3 = await prisma.product.create({
    data: {
      id: 'product-3',
      name: 'Premium V-Neck Tee',
      description: 'Stylish v-neck design with a flattering fit for any occasion',
      price: 2799, // $27.99
      originalPrice: null,
      imageUrl: '/api/placeholder/400/400',
      category: 'premium',
      stock: 120,
      isActive: true,
      variants: {
        create: [
          { type: 'color', value: 'Charcoal', stock: 30 },
          { type: 'color', value: 'Burgundy', stock: 30 },
          { type: 'color', value: 'Forest Green', stock: 30 },
          { type: 'color', value: 'Navy', stock: 30 },
          { type: 'size', value: 'S', stock: 25 },
          { type: 'size', value: 'M', stock: 35 },
          { type: 'size', value: 'L', stock: 35 },
          { type: 'size', value: 'XL', stock: 25 },
        ],
      },
    },
  });

  const product4 = await prisma.product.create({
    data: {
      id: 'product-4',
      name: 'Pocket Tee Collection',
      description: 'Classic t-shirt with a functional chest pocket detail',
      price: 2699, // $26.99
      originalPrice: null,
      imageUrl: '/api/placeholder/400/400',
      category: 'casual',
      stock: 180,
      isActive: true,
      variants: {
        create: [
          { type: 'color', value: 'Olive', stock: 45 },
          { type: 'color', value: 'Rust', stock: 45 },
          { type: 'color', value: 'Sand', stock: 45 },
          { type: 'color', value: 'Black', stock: 45 },
          { type: 'size', value: 'S', stock: 40 },
          { type: 'size', value: 'M', stock: 50 },
          { type: 'size', value: 'L', stock: 50 },
          { type: 'size', value: 'XL', stock: 40 },
        ],
      },
    },
  });

  const product5 = await prisma.product.create({
    data: {
      id: 'product-5',
      name: 'Striped Long Sleeve Tee',
      description: 'Timeless striped pattern on a comfortable long sleeve design',
      price: 3499, // $34.99
      originalPrice: 3999, // $39.99
      imageUrl: '/api/placeholder/400/400',
      category: 'long-sleeve',
      stock: 100,
      isActive: true,
      variants: {
        create: [
          { type: 'color', value: 'Navy/White', stock: 30 },
          { type: 'color', value: 'Black/Gray', stock: 30 },
          { type: 'color', value: 'Red/White', stock: 20 },
          { type: 'color', value: 'Green/Cream', stock: 20 },
          { type: 'size', value: 'S', stock: 20 },
          { type: 'size', value: 'M', stock: 30 },
          { type: 'size', value: 'L', stock: 30 },
          { type: 'size', value: 'XL', stock: 20 },
        ],
      },
    },
  });

  const product6 = await prisma.product.create({
    data: {
      id: 'product-6',
      name: 'Athletic Performance Tee',
      description: 'Moisture-wicking fabric perfect for workouts and active lifestyles',
      price: 3299, // $32.99
      originalPrice: null,
      imageUrl: '/api/placeholder/400/400',
      category: 'athletic',
      stock: 140,
      isActive: true,
      variants: {
        create: [
          { type: 'color', value: 'Electric Blue', stock: 35 },
          { type: 'color', value: 'Neon Green', stock: 35 },
          { type: 'color', value: 'Charcoal', stock: 35 },
          { type: 'color', value: 'Orange', stock: 35 },
          { type: 'size', value: 'S', stock: 30 },
          { type: 'size', value: 'M', stock: 40 },
          { type: 'size', value: 'L', stock: 40 },
          { type: 'size', value: 'XL', stock: 30 },
        ],
      },
    },
  });

  console.log('Created products:', {
    product1: product1.name,
    product2: product2.name,
    product3: product3.name,
    product4: product4.name,
    product5: product5.name,
    product6: product6.name
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
