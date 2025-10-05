import Link from "next/link";
import { api } from "@/trpc/server";

export default async function ProductsPage() {
  const products = await api.product.getAll({ limit: 50 });
  const categories = await api.category.getAll();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              TeeShop
            </Link>
            <nav className="flex space-x-8">
              <Link href="/cart" className="text-gray-700 hover:text-gray-900">
                Cart
              </Link>
              <Link href="/sign-in" className="text-gray-700 hover:text-gray-900">
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
            <nav className="space-y-2">
              <Link
                href="/products"
                className="block px-3 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md"
              >
                All Products
              </Link>
              {categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/products/${category.slug}`}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
              <p className="mt-2 text-gray-600">
                Browse our complete collection of premium t-shirts
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/products/${product.category.slug}/${product.slug}`}
                  className="group"
                >
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                    {product.images.length > 0 ? (
                      <div className="h-64 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-500">Product Image</span>
                      </div>
                    ) : (
                      <div className="h-64 bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-700">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{product.category.name}</p>
                    <div className="mt-2 flex items-center">
                      {product.salePrice ? (
                        <>
                          <span className="text-lg font-semibold text-red-600">
                            ${product.salePrice.toFixed(2)}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-semibold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        Available in {product.colors.length} colors
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}