import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { api, HydrateClient } from "@/trpc/server";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  try {
    const category = await api.category.getBySlug({ slug });
    
    if (!category) {
      notFound();
    }

    return (
      <HydrateClient>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-2 text-lg text-gray-600">{category.description}</p>
            )}
          </div>

          {/* Products Grid */}
          {category.products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {category.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group"
                >
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="mt-2 text-gray-600">
                We&apos;re working on adding more products to this category.
              </p>
              <Link
                href="/products"
                className="mt-4 inline-block rounded-md bg-black px-6 py-2 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </HydrateClient>
    );
  } catch {
    notFound();
  }
}