"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

interface AddToCartButtonProps {
  product: any;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const addToCart = api.cart.addItem.useMutation({
    onSuccess: () => {
      alert("Added to cart!");
      setIsLoading(false);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
      setIsLoading(false);
    },
  });

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      alert("Please select a size and color");
      return;
    }

    setIsLoading(true);
    addToCart.mutate({
      productId: product.id,
      variantId: selectedVariant || undefined,
      quantity,
      sessionId: typeof window !== "undefined" ? localStorage.getItem("sessionId") || Date.now().toString() : Date.now().toString(),
    });
  };

  return (
    <div className="space-y-4">
      {product.variants && product.variants.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Select Size & Color:</label>
          <select
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Choose variant...</option>
            {product.variants.map((variant: any) => (
              <option key={variant.id} value={variant.id} disabled={variant.stock === 0}>
                {variant.size} - {variant.color} {variant.stock === 0 ? "(Out of Stock)" : `(${variant.stock} available)`}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">Quantity:</label>
        <input
          type="number"
          min="1"
          max="10"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="w-20 p-2 border rounded-md"
        />
      </div>

      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}