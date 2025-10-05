import Link from "next/link";
import { api } from "@/trpc/server";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    api.product.getAll({ limit: 12 }),
    api.category.getAll(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shop All T-Shirts</h1>
          <p className="text-gray-600">
            Discover our complete collection of premium t-shirts
          </p>
        </div>

        {/* Categories Filter */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shop by Category</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              All Products
            </Link>
            {categories.map((category: any) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.products.map((product: any) => (
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
                <div className="mt-2">
                  <span className="text-xs text-gray-500">
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {products.pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: products.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/shop?page=${page}`}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    page === products.pagination.page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}