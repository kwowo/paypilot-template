import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/trpc/server";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  try {
    const category = await api.category.getBySlug({ slug });

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
            <p className="text-gray-600">{category.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              {category.products.length} {category.products.length === 1 ? 'product' : 'products'}
            </p>
          </div>

          {/* Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-gray-700 hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <Link href="/shop" className="text-gray-700 hover:text-blue-600">
                    Shop
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-gray-500">{category.name}</span>
                </div>
              </li>
            </ol>
          </nav>

          {/* Products Grid */}
          {category.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.products.map((product: any) => (
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
                      <span className="text-xs text-gray-500">
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
              <Link
                href="/shop"
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}