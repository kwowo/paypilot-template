"use client";

import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  imageUrl: string;
  category: string | null;
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  category,
}: ProductCardProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${id}`}>
      <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg">
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute left-2 top-2 z-10 rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white">
            -{discountPercent}%
          </div>
        )}

        {/* Image Placeholder */}
        <div className="flex aspect-square w-full items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <svg
              className="h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span className="text-sm font-medium">T-Shirt Image</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            {category && (
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {category.replace(/-/g, " ")}
              </span>
            )}
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {hasDiscount && originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
