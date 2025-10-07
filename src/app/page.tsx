import Link from "next/link";
import { api, HydrateClient } from "@/trpc/server";

export const dynamic = 'force-dynamic';

export default async function Home() {
  void api.product.getFeatured.prefetch({});

  return (
    <HydrateClient>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gray-900 text-white">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Premium T-Shirts for Everyone
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300">
                Discover our collection of high-quality, comfortable t-shirts
              </p>
              <Link 
                href="/shop" 
                className="bg-white text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Featured Products
            </h2>
            <FeaturedProducts />
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link 
                href="/shop/men" 
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">Men</span>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xl font-semibold">Shop Men&apos;s</span>
                </div>
              </Link>
              
              <Link 
                href="/shop/women" 
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">Women</span>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xl font-semibold">Shop Women&apos;s</span>
                </div>
              </Link>
              
              <Link 
                href="/shop/kids" 
                className="group relative overflow-hidden rounded-lg"
              >
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">Kids</span>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xl font-semibold">Shop Kids&apos;</span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </HydrateClient>
  );
}

function FeaturedProducts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Mock featured products - will be replaced with real data */}
      <ProductCard 
        id="1"
        name="Classic Black T-Shirt"
        price={29.99}
        image="/products/black-tshirt-1.jpg"
        slug="classic-black-tshirt"
      />
      <ProductCard 
        id="2"
        name="White Cotton Tee"
        price={24.99}
        image="/products/white-tshirt-1.jpg"
        slug="white-cotton-tee"
      />
      <ProductCard 
        id="4"
        name="Kids Rainbow Tee"
        price={19.99}
        image="/products/kids-rainbow-1.jpg"
        slug="kids-rainbow-tee"
      />
      <ProductCard 
        id="1"
        name="Classic Black T-Shirt"
        price={29.99}
        image="/products/black-tshirt-1.jpg"
        slug="classic-black-tshirt"
      />
    </div>
  );
}

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

function ProductCard({ name, price, slug }: ProductCardProps) {
  return (
    <Link href={`/product/${slug}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden group-hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Product Image</span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
          <p className="text-gray-700 font-bold">${price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}
