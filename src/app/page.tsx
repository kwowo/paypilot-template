import Link from "next/link";
import Image from "next/image";

import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  // Prefetch featured products
  void api.product.getAll.prefetch({ featured: true, limit: 8 });
  void api.category.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-900 to-black py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Premium Quality T-Shirts
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Discover our collection of comfortable, stylish, and sustainable t-shirts
                for every occasion. Made with the finest materials for lasting comfort.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/products"
                  className="rounded-md bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100"
                >
                  Shop Now
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-semibold leading-6 text-white hover:text-gray-300"
                >
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Shop by Category
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Find the perfect t-shirt for your style
              </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Link
                href="/category/mens"
                className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square hover:opacity-75"
              >
                <Image
                  src="/products/placeholder.svg"
                  alt="Men's T-Shirts"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <h3 className="text-2xl font-bold text-white">Men&apos;s</h3>
                </div>
              </Link>
              <Link
                href="/category/womens"
                className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square hover:opacity-75"
              >
                <Image
                  src="/products/placeholder.svg"
                  alt="Women's T-Shirts"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <h3 className="text-2xl font-bold text-white">Women&apos;s</h3>
                </div>
              </Link>
              <Link
                href="/category/unisex"
                className="group relative overflow-hidden rounded-lg bg-gray-100 aspect-square hover:opacity-75"
              >
                <Image
                  src="/products/placeholder.svg"
                  alt="Unisex T-Shirts"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <h3 className="text-2xl font-bold text-white">Unisex</h3>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Why Choose Our T-Shirts?
              </h2>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-black text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Premium Quality</h3>
                <p className="mt-2 text-gray-600">Made from the finest organic cotton for lasting comfort</p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-black text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Fast Shipping</h3>
                <p className="mt-2 text-gray-600">Free shipping on orders over $50</p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-black text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Sustainable</h3>
                <p className="mt-2 text-gray-600">Eco-friendly production with sustainable materials</p>
              </div>
              <div className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-black text-white mx-auto">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Easy Returns</h3>
                <p className="mt-2 text-gray-600">30-day hassle-free return policy</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-black py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white">
                Ready to find your perfect t-shirt?
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                Join thousands of satisfied customers who love our quality and comfort.
              </p>
              <div className="mt-8">
                <Link
                  href="/products"
                  className="rounded-md bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100"
                >
                  Browse All Products
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </HydrateClient>
  );
}
