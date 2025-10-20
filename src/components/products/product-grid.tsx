"use client";

import { ProductCard } from "./product-card";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  imageUrl: string;
  category: string | null;
}

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export function ProductGrid({ products, title }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500">No products found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h2 className="mb-8 text-3xl font-bold text-gray-900">{title}</h2>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
