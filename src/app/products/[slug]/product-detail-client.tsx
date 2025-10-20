"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { api } from "@/trpc/react";

interface ProductVariant {
  id: string;
  type: string;
  value: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  imageUrl: string;
  category: string | null;
  stock: number;
  variants: ProductVariant[];
}

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  const addToCart = api.cart.add.useMutation({
    onSuccess: () => {
      alert("Added to cart successfully!");
      router.push("/checkout");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const colors = product.variants
    .filter((v) => v.type === "color")
    .map((v) => v.value);
  const sizes = product.variants
    .filter((v) => v.type === "size")
    .map((v) => v.value);

  const handleAddToCart = () => {
    if (!session) {
      alert("Please sign in to add items to your cart");
      router.push("/sign-in");
      return;
    }

    if (!selectedColor || !selectedSize) {
      alert("Please select both color and size");
      return;
    }

    addToCart.mutate({
      productId: product.id,
      color: selectedColor,
      size: selectedSize,
      quantity,
    });
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <div className="relative">
            {hasDiscount && (
              <div className="absolute left-4 top-4 z-10 rounded-md bg-red-500 px-3 py-1 text-sm font-bold text-white">
                -{discountPercent}% OFF
              </div>
            )}
            <div className="flex aspect-square w-full items-center justify-center rounded-lg bg-gray-200">
              <div className="flex flex-col items-center gap-4 text-gray-400">
                <svg
                  className="h-32 w-32"
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
                <span className="text-xl font-medium">T-Shirt Image</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            {product.category && (
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-800">
                {product.category.replace(/-/g, " ")}
              </span>
            )}
            <h1 className="mt-4 text-4xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="mt-4 text-lg text-gray-600">{product.description}</p>

            {/* Price */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Color Selection */}
            {colors.length > 0 && (
              <div className="mt-8">
                <label className="mb-3 block text-sm font-semibold text-gray-900">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`rounded-md border-2 px-4 py-2 text-sm font-medium transition-all ${
                        selectedColor === color
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {sizes.length > 0 && (
              <div className="mt-6">
                <label className="mb-3 block text-sm font-semibold text-gray-900">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`rounded-md border-2 px-4 py-2 text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <label className="mb-3 block text-sm font-semibold text-gray-900">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              className="mt-8 w-full rounded-lg bg-blue-600 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {addToCart.isPending ? "Adding..." : "Add to Cart"}
            </button>

            {/* Stock Info */}
            <div className="mt-4 text-sm text-gray-600">
              {product.stock > 0 ? (
                <span className="text-green-600">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
