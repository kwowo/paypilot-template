"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import Link from "next/link";

interface CartItemProps {
  item: any;
}

export function CartItemComponent({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const utils = api.useUtils();

  const updateQuantity = api.cart.updateQuantity.useMutation({
    onSuccess: () => {
      void utils.cart.getItems.invalidate();
      void utils.cart.getTotal.invalidate();
    },
  });

  const removeItem = api.cart.removeItem.useMutation({
    onSuccess: () => {
      void utils.cart.getItems.invalidate();
      void utils.cart.getTotal.invalidate();
    },
  });

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity !== quantity && newQuantity > 0) {
      setQuantity(newQuantity);
      updateQuantity.mutate({
        itemId: item.id,
        quantity: newQuantity,
      });
    }
  };

  const handleRemove = () => {
    if (confirm("Are you sure you want to remove this item from your cart?")) {
      removeItem.mutate({ itemId: item.id });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-2xl">👕</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div className="flex-grow">
              <Link
                href={`/product/${item.product.slug}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
              >
                {item.product.name}
              </Link>
              <p className="text-sm text-gray-600">{item.product.category.name}</p>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Size:</span> {item.size}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Color:</span> {item.color}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end mt-4 sm:mt-0">
              <div className="text-lg font-bold text-gray-900 mb-2">
                ${item.product.price}
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm text-gray-600">Qty:</label>
                <select
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                  disabled={updateQuantity.isPending}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remove Button */}
              <button
                onClick={handleRemove}
                disabled={removeItem.isPending}
                className="text-sm text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
              >
                {removeItem.isPending ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>

          {/* Item Total */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Item total:</span>
              <span className="text-lg font-bold text-gray-900">
                ${(item.product.price * quantity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}