"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    // Generate or get session ID for guest users
    let storedSessionId = localStorage.getItem("sessionId");
    if (!storedSessionId) {
      storedSessionId = Date.now().toString();
      localStorage.setItem("sessionId", storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  const { data: cartItems = [], refetch } = api.cart.getItems.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const updateQuantity = api.cart.updateQuantity.useMutation({
    onSuccess: () => refetch(),
  });

  const removeItem = api.cart.removeItem.useMutation({
    onSuccess: () => refetch(),
  });

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateQuantity.mutate({
      itemId,
      quantity: newQuantity,
      sessionId,
    });
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem.mutate({ itemId });
  };

  const total = cartItems.reduce((sum: number, item: any) => 
    sum + (item.product.price * item.quantity), 0
  );

  if (!sessionId) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item: any) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                {item.product.image ? (
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500 text-xs">No image</span>
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-gray-600">${item.product.price.toFixed(2)}</p>
                  {item.variant && (
                    <p className="text-sm text-gray-500">
                      {item.variant.size} - {item.variant.color}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center border rounded"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="w-full block text-center bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}