"use client";

import Link from "next/link";
import { api } from "@/trpc/react";

export function FeaturedProducts() {
  const { data } = api.product.getAll.useQuery({ featured: true, limit: 8 });

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                <span className="text-gray-500 text-sm">T-Shirt Image</span>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-700">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.category.name}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}