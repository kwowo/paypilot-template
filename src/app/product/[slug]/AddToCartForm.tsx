"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  inventory: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  variants: ProductVariant[];
}

interface AddToCartFormProps {
  product: Product;
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const { data: session } = useSession();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const availableSizes = [...new Set(product.variants.map(v => v.size))];
  const selectedVariant = product.variants.find(v => v.size === selectedSize);

  const handleAddToCart = async () => {
    if (!session) {
      alert("Please sign in to add items to your cart");
      return;
    }

    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    if (!selectedVariant) {
      alert("Selected variant not available");
      return;
    }

    setIsAdding(true);

    try {
      // Mock implementation - will implement with real tRPC when database is ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`Added ${quantity} x ${product.name} (Size: ${selectedSize}) to cart!`);
    } catch {
      alert("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Size Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
        <div className="grid grid-cols-4 gap-2">
          {availableSizes.map((size) => {
            const variant = product.variants.find(v => v.size === size);
            const isOutOfStock = !variant || variant.inventory === 0;
            
            return (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                disabled={isOutOfStock}
                className={`py-2 px-3 border rounded-md text-sm font-medium ${
                  selectedSize === size
                    ? "border-gray-900 bg-gray-900 text-white"
                    : isOutOfStock
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-gray-300 text-gray-900 hover:border-gray-400"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity Selection */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
        <select
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          {Array.from({ length: Math.min(10, selectedVariant?.inventory ?? 1) }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Stock Status */}
      {selectedVariant && (
        <div className="text-sm text-gray-600">
          {selectedVariant.inventory > 0 ? (
            <span className="text-green-600">
              ✓ In stock ({selectedVariant.inventory} available)
            </span>
          ) : (
            <span className="text-red-600">✗ Out of stock</span>
          )}
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedSize || isAdding || (selectedVariant?.inventory ?? 0) === 0}
        className={`w-full py-3 px-4 rounded-md text-sm font-medium ${
          !selectedSize || isAdding || (selectedVariant?.inventory ?? 0) === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-gray-900 text-white hover:bg-gray-800"
        }`}
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>

      {!session && (
        <p className="text-sm text-gray-500 text-center">
          <a href="/sign-in" className="text-blue-600 hover:underline">
            Sign in
          </a>{" "}
          to add items to your cart
        </p>
      )}
    </div>
  );
}