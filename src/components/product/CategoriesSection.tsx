"use client";

import Link from "next/link";
import { api } from "@/trpc/react";

export function CategoriesSection() {
  const { data: categories } = api.category.getAll.useQuery();

  return (
    <section>
      <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
        Shop by Category
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories?.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 text-center">
              {/* Category Icon Placeholder */}
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                <span className="text-2xl">👕</span>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
                {category.name}
              </h3>
              <p className="text-gray-600">
                {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}