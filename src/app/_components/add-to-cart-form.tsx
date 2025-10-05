"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { api } from "@/trpc/react";
import Link from "next/link";

interface AddToCartFormProps {
  product: any;
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const { data: session } = useSession();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [quantity, setQuantity] = useState(1);

  const utils = api.useUtils();
  const addToCart = api.cart.addItem.useMutation({
    onSuccess: () => {
      // Invalidate cart queries to refresh cart count
      void utils.cart.getItems.invalidate();
      void utils.cart.getTotal.invalidate();
      alert("Added to cart!");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const handleAddToCart = () => {
    if (!session?.user) {
      alert("Please sign in to add items to cart");
      return;
    }

    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }

    addToCart.mutate({
      productId: product.id,
      quantity,
      size: selectedSize as any,
      color: selectedColor as any,
    });
  };

  if (product.stock === 0) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <p className="text-gray-600 text-center">This product is currently out of stock.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
      {/* Size Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Size *
        </label>
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Size</option>
          {product.sizes.map((size: string) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Color *
        </label>
        <select
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Color</option>
          {product.colors.map((color: string) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Quantity
        </label>
        <select
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Array.from({ length: Math.min(10, product.stock) }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Add to Cart Button */}
      {session?.user ? (
        <button
          onClick={handleAddToCart}
          disabled={addToCart.isPending || !selectedSize || !selectedColor}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {addToCart.isPending ? "Adding..." : "Add to Cart"}
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-center text-gray-600">Please sign in to add items to cart</p>
          <Link
            href="/sign-in"
            className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 text-center transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
}