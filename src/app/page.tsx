import Link from "next/link";
import Image from "next/image";

import { auth } from "@/lib/auth";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  const [featuredProducts, categories] = await Promise.all([
    api.product.getFeatured(),
    api.category.getAll(),
  ]);

  return (
    <HydrateClient>
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Premium T-Shirts for Everyone
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Discover our collection of high-quality, comfortable t-shirts in a variety of styles and colors.
              Perfect for every occasion.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/shop"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </Link>
              {!session && (
                <Link
                  href="/sign-in"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    <span className="text-6xl">👕</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mt-2">{category.description}</p>
                    <div className="mt-4 text-sm text-gray-500">
                      {category._count?.products || 0} products
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    <span className="text-4xl">👕</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.category.name}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Your Perfect T-Shirt?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Browse our full collection and discover your new favorite.
            </p>
            <Link
              href="/shop"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Products
            </Link>
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
