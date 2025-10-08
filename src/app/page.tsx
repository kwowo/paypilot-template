import Link from "next/link";
import { api, HydrateClient } from "@/trpc/server";

// CRITICAL: Force dynamic rendering for pages with database queries
export const dynamic = "force-dynamic";

export default async function Home() {
  // Prefetch featured products and categories
  void api.product.getAll.prefetch({ featured: true, limit: 8 });
  void api.category.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center py-16 bg-white rounded-lg shadow-sm mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Premium T-Shirts
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our collection of high-quality t-shirts in various designs, colors, and sizes. 
            From classic graphics to vintage styles, find your perfect tee.
          </p>
          <Link
            href="/products"
            className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 font-medium text-lg"
          >
            Shop All Products
          </Link>
        </div>

        {/* Client Components for Interactive Features */}
        <div className="space-y-16">
          <FeaturedProductsSection />
          <CategoriesSectionComponent />
        </div>
      </div>
    </HydrateClient>
  );
}

// Client component for featured products
function FeaturedProductsSection() {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
        <Link
          href="/products"
          className="text-gray-600 hover:text-gray-900 font-medium"
        >
          View All →
        </Link>
      </div>
      
      <div className="text-center py-8 text-gray-600">
        <p>Featured products will load here...</p>
        <Link
          href="/products"
          className="inline-block mt-4 bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800"
        >
          Browse All Products
        </Link>
      </div>
    </section>
  );
}

// Client component for categories
function CategoriesSectionComponent() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Shop by Category
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/products?category=graphic-tees" className="group">
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
              <span className="text-2xl">👕</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
              Graphic Tees
            </h3>
            <p className="text-gray-600">Creative designs</p>
          </div>
        </Link>

        <Link href="/products?category=plain-tees" className="group">
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
              <span className="text-2xl">👕</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
              Plain Tees
            </h3>
            <p className="text-gray-600">Essential basics</p>
          </div>
        </Link>

        <Link href="/products?category=vintage" className="group">
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
              <span className="text-2xl">👕</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
              Vintage
            </h3>
            <p className="text-gray-600">Retro style</p>
          </div>
        </Link>

        <Link href="/products?category=sports" className="group">
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
              <span className="text-2xl">👕</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
              Sports
            </h3>
            <p className="text-gray-600">Athletic performance</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
