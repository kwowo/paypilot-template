import { notFound } from "next/navigation";
import Image from "next/image";

import { api, HydrateClient } from "@/trpc/server";

// Dynamic pages that depend on database data
export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  try {
    const product = await api.product.getBySlug({ slug });
    
    if (!product) {
      notFound();
    }

    return (
      <HydrateClient>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Product Images */}
            <div className="aspect-square overflow-hidden rounded-lg">
              {product.images?.[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {product.name}
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  {product.category.name}
                </p>
              </div>

              <div className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </div>

              {product.description && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Description</h3>
                  <p className="mt-2 text-gray-600">{product.description}</p>
                </div>
              )}

              {/* Size and Color Selection */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Available Options</h3>
                    <div className="mt-2 grid grid-cols-2 gap-4">
                      {product.variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="rounded-md border border-gray-300 p-3 text-center"
                        >
                          <div className="font-medium">{variant.size}</div>
                          <div className="text-sm text-gray-600">{variant.color}</div>
                          <div className="text-sm text-gray-500">
                            {variant.stock > 0 ? `${variant.stock} in stock` : "Out of stock"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <div className="space-y-4">
                <button className="w-full rounded-md bg-black px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                  Add to Cart
                </button>
                <button className="w-full rounded-md border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50">
                  Add to Wishlist
                </button>
              </div>

              {/* Product Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">Product Details</h3>
                <ul className="mt-2 space-y-1 text-sm text-gray-600">
                  <li>100% Organic Cotton</li>
                  <li>Machine Washable</li>
                  <li>Pre-shrunk for perfect fit</li>
                  <li>Ethically sourced materials</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </HydrateClient>
    );
  } catch {
    notFound();
  }
}