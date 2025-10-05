"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

interface AddToCartFormProps {
  product: {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    sizes: string[];
    colors: string[];
    inventory: number;
  };
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addToCart = api.cart.addItem.useMutation({
    onSuccess: () => {
      alert("Added to cart!");
      setIsSubmitting(false);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSize || !selectedColor) {
      alert("Please select both size and color");
      return;
    }

    if (product.inventory < quantity) {
      alert("Not enough inventory");
      return;
    }

    setIsSubmitting(true);
    addToCart.mutate({
      productId: product.id,
      size: selectedSize as any,
      color: selectedColor,
      quantity,
    });
  };

  if (product.inventory === 0) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        <p className="text-center text-gray-600">This product is currently out of stock</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Size Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              className={`py-2 px-4 text-sm font-medium rounded-md border ${
                selectedSize === size
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Color
        </label>
        <div className="grid grid-cols-2 gap-2">
          {product.colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`py-2 px-4 text-sm font-medium rounded-md border ${
                selectedColor === color
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Quantity
        </label>
        <select
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="block w-20 rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900"
        >
          {Array.from({ length: Math.min(10, product.inventory) }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* Add to Cart Button */}
      <button
        type="submit"
        disabled={isSubmitting || !selectedSize || !selectedColor}
        className="w-full bg-gray-900 text-white py-3 px-8 rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Adding..." : "Add to Cart"}
      </button>
    </form>
  );
}