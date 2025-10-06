import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create categories
  const menCategory = await prisma.category.upsert({
    where: { slug: 'men' },
    update: {},
    create: {
      name: "Men's T-Shirts",
      slug: 'men',
      description: 'Comfortable and stylish t-shirts for men',
      image: '/categories/men.jpg',
    },
  })

  const womenCategory = await prisma.category.upsert({
    where: { slug: 'women' },
    update: {},
    create: {
      name: "Women's T-Shirts",
      slug: 'women',
      description: 'Trendy and comfortable t-shirts for women',
      image: '/categories/women.jpg',
    },
  })

  const unisexCategory = await prisma.category.upsert({
    where: { slug: 'unisex' },
    update: {},
    create: {
      name: 'Unisex T-Shirts',
      slug: 'unisex',
      description: 'Versatile t-shirts perfect for everyone',
      image: '/categories/unisex.jpg',
    },
  })

  // Create products
  const products = [
    {
      name: 'Classic White Tee',
      slug: 'classic-white-tee',
      description: 'A timeless white t-shirt made from 100% cotton. Perfect for any occasion.',
      price: 24.99,
      image: '/products/classic-white-tee.jpg',
      images: ['/products/classic-white-tee.jpg', '/products/classic-white-tee-2.jpg'],
      categoryId: unisexCategory.id,
    },
    {
      name: 'Black Basic Tee',
      slug: 'black-basic-tee',
      description: 'Essential black t-shirt with a comfortable fit. Made from premium cotton blend.',
      price: 26.99,
      image: '/products/black-basic-tee.jpg',
      images: ['/products/black-basic-tee.jpg', '/products/black-basic-tee-2.jpg'],
      categoryId: unisexCategory.id,
    },
    {
      name: 'Vintage Blue Tee',
      slug: 'vintage-blue-tee',
      description: 'Retro-style blue t-shirt with a vintage wash. Soft and breathable fabric.',
      price: 29.99,
      image: '/products/vintage-blue-tee.jpg',
      images: ['/products/vintage-blue-tee.jpg', '/products/vintage-blue-tee-2.jpg'],
      categoryId: menCategory.id,
    },
    {
      name: 'Pink Casual Tee',
      slug: 'pink-casual-tee',
      description: 'Lovely pink t-shirt perfect for casual outings. Comfortable and stylish.',
      price: 27.99,
      image: '/products/pink-casual-tee.jpg',
      images: ['/products/pink-casual-tee.jpg', '/products/pink-casual-tee-2.jpg'],
      categoryId: womenCategory.id,
    },
    {
      name: 'Graphic Print Tee',
      slug: 'graphic-print-tee',
      description: 'Eye-catching graphic design on a comfortable cotton t-shirt.',
      price: 32.99,
      image: '/products/graphic-print-tee.jpg',
      images: ['/products/graphic-print-tee.jpg', '/products/graphic-print-tee-2.jpg'],
      categoryId: unisexCategory.id,
    },
    {
      name: 'Navy Pocket Tee',
      slug: 'navy-pocket-tee',
      description: 'Classic navy t-shirt with a front pocket. Perfect for everyday wear.',
      price: 25.99,
      image: '/products/navy-pocket-tee.jpg',
      images: ['/products/navy-pocket-tee.jpg', '/products/navy-pocket-tee-2.jpg'],
      categoryId: menCategory.id,
    },
    {
      name: 'Floral Print Tee',
      slug: 'floral-print-tee',
      description: 'Beautiful floral pattern on a soft and comfortable t-shirt.',
      price: 31.99,
      image: '/products/floral-print-tee.jpg',
      images: ['/products/floral-print-tee.jpg', '/products/floral-print-tee-2.jpg'],
      categoryId: womenCategory.id,
    },
    {
      name: 'Striped Long Sleeve',
      slug: 'striped-long-sleeve',
      description: 'Classic striped pattern on a comfortable long-sleeve t-shirt.',
      price: 34.99,
      image: '/products/striped-long-sleeve.jpg',
      images: ['/products/striped-long-sleeve.jpg', '/products/striped-long-sleeve-2.jpg'],
      categoryId: unisexCategory.id,
    },
  ]

  const createdProducts = []
  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    })
    createdProducts.push(product)
  }

  // Create product variants (sizes and colors)
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  const colors = ['White', 'Black', 'Navy', 'Gray', 'Red', 'Blue', 'Green', 'Pink']

  for (const product of createdProducts) {
    // Create variants for each product
    const productColors = colors.slice(0, Math.floor(Math.random() * 4) + 2) // 2-5 colors per product
    
    for (const size of sizes) {
      for (const color of productColors) {
        await prisma.productVariant.upsert({
          where: { 
            productId_size_color: {
              productId: product.id,
              size,
              color,
            }
          },
          update: {},
          create: {
            size,
            color,
            stock: Math.floor(Math.random() * 50) + 10, // 10-59 items in stock
            sku: `${product.slug.toUpperCase()}-${size}-${color.toUpperCase()}`,
            productId: product.id,
          },
        })
      }
    }
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })