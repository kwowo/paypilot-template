import Link from "next/link";
import Image from "next/image";

import { auth } from "@/lib/auth";
import { api, HydrateClient } from "@/trpc/server";
import { SignOutButton } from "@/app/_components/sign-out-button";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  // Prefetch data
  void api.category.getAll.prefetch();
  void api.product.getFeatured.prefetch({ limit: 8 });

  return (
    <HydrateClient>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold text-gray-900">
                  TeeShop
                </Link>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                <Link href="/products" className="text-gray-700 hover:text-gray-900">
                  All Products
                </Link>
                <Link href="/products/mens-tshirts" className="text-gray-700 hover:text-gray-900">
                  Men's
                </Link>
                <Link href="/products/womens-tshirts" className="text-gray-700 hover:text-gray-900">
                  Women's
                </Link>
                <Link href="/products/unisex-tshirts" className="text-gray-700 hover:text-gray-900">
                  Unisex
                </Link>
                <Link href="/products/kids-tshirts" className="text-gray-700 hover:text-gray-900">
                  Kids
                </Link>
              </nav>

              <div className="flex items-center space-x-4">
                <Link href="/cart" className="text-gray-700 hover:text-gray-900">
                  Cart
                </Link>
                {session ? (
                  <div className="flex items-center space-x-4">
                    <Link href="/orders" className="text-gray-700 hover:text-gray-900">
                      Orders
                    </Link>
                    <span className="text-sm text-gray-600">
                      {session.user?.name}
                    </span>
                    <SignOutButton />
                  </div>
                ) : (
                  <Link
                    href="/sign-in"
                    className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Premium T-Shirts for Everyone
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                Discover our collection of high-quality, comfortable t-shirts. From classic designs to bold graphics, 
                we have something for every style and occasion.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/products"
                  className="rounded-md bg-gray-900 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-gray-800"
                >
                  Shop Now
                </Link>
                <Link href="/products/featured" className="text-lg font-semibold leading-6 text-gray-900">
                  Featured Products <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Shop by Category</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/products/mens-tshirts" className="group">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <div className="h-48 bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-800 font-medium">Men's T-Shirts</span>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 group-hover:text-gray-700">
                Men's Collection
              </h3>
              <p className="text-gray-500">Classic and modern styles</p>
            </Link>

            <Link href="/products/womens-tshirts" className="group">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <div className="h-48 bg-pink-100 flex items-center justify-center">
                  <span className="text-pink-800 font-medium">Women's T-Shirts</span>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 group-hover:text-gray-700">
                Women's Collection
              </h3>
              <p className="text-gray-500">Stylish and comfortable</p>
            </Link>

            <Link href="/products/unisex-tshirts" className="group">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <div className="h-48 bg-green-100 flex items-center justify-center">
                  <span className="text-green-800 font-medium">Unisex T-Shirts</span>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 group-hover:text-gray-700">
                Unisex Collection
              </h3>
              <p className="text-gray-500">For everyone</p>
            </Link>

            <Link href="/products/kids-tshirts" className="group">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                <div className="h-48 bg-yellow-100 flex items-center justify-center">
                  <span className="text-yellow-800 font-medium">Kids T-Shirts</span>
                </div>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 group-hover:text-gray-700">
                Kids Collection
              </h3>
              <p className="text-gray-500">Fun designs for kids</p>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white">TeeShop</h3>
              <p className="mt-2 text-gray-400">
                Premium quality t-shirts for everyone
              </p>
              <div className="mt-6 flex justify-center space-x-6">
                <Link href="/products" className="text-gray-400 hover:text-white">
                  Products
                </Link>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About
                </Link>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </HydrateClient>
  );
}
