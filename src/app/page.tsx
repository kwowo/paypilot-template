import Link from "next/link";
import { api, HydrateClient } from "@/trpc/server";
import { ProductGrid } from "@/components/products/product-grid";

export const dynamic = "force-dynamic";

export default async function Home() {
  void api.product.getAll.prefetch({ featured: true, limit: 8 });
  void api.product.getCategories.prefetch();

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl">
                Premium T-Shirts
              </h1>
              <p className="mb-8 text-xl text-blue-100">
                Discover our collection of high-quality, stylish t-shirts for every occasion
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  href="/products"
                  className="rounded-lg bg-white px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-gray-100"
                >
                  Shop All Products
                </Link>
                <Link
                  href="/category/graphic"
                  className="rounded-lg border-2 border-white px-8 py-3 font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Browse Categories
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600">
                Check out our most popular t-shirts
              </p>
            </div>
            <FeaturedProducts />
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                Shop by Category
              </h2>
              <p className="text-lg text-gray-600">
                Find the perfect style for you
              </p>
            </div>
            <CategoryList />
          </div>
        </section>
      </div>
    </HydrateClient>
  );
}

async function FeaturedProducts() {
  const products = await api.product.getAll({ limit: 8 });
  return <ProductGrid products={products} />;
}

async function CategoryList() {
  const categories = await api.product.getCategories();

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-6 text-center transition-all hover:border-blue-500 hover:shadow-md"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
              <svg
                className="h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 group-hover:text-blue-600">
              {category.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
