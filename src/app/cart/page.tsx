"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { api } from "@/trpc/react";

export default function CartPage() {
  const { data: session } = useSession();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const { data: cartItems, refetch } = api.cart.getItems.useQuery(undefined, {
    enabled: !!session,
  });

  const updateQuantity = api.cart.updateQuantity.useMutation({
    onSuccess: () => {
      void refetch();
      setIsUpdating(null);
    },
    onError: (error) => {
      alert(error.message);
      setIsUpdating(null);
    },
  });

  const removeItem = api.cart.removeItem.useMutation({
    onSuccess: () => {
      void refetch();
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  const clearCart = api.cart.clearCart.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-600 mb-8">
            Please sign in to view your shopping cart.
          </p>
          <Link
            href="/sign-in"
            className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setIsUpdating(itemId);
    updateQuantity.mutate({ itemId, quantity: newQuantity });
  };

  const handleRemoveItem = (itemId: string) => {
    if (confirm("Remove this item from your cart?")) {
      removeItem.mutate({ itemId });
    }
  };

  const handleClearCart = () => {
    if (confirm("Clear all items from your cart?")) {
      clearCart.mutate();
    }
  };

  const subtotal = cartItems?.reduce((sum, item) => sum + item.total, 0) ?? 0;
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
        {cartItems && cartItems.length > 0 && (
          <button
            onClick={handleClearCart}
            disabled={clearCart.isPending}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Clear Cart
          </button>
        )}
      </div>

      {!cartItems || cartItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven&apos;t added any items to your cart yet.
          </p>
          <Link
            href="/products"
            className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 font-medium"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-lg shadow-sm border"
              >
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-500 text-xs">Image</span>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="hover:text-gray-700"
                      >
                        {item.product.name}
                      </Link>
                    </h3>
                    <p className="text-gray-600">
                      Size: {item.variant.size} | Color: {item.variant.color}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || isUpdating === item.id}
                      className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">
                      {isUpdating === item.id ? "..." : item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={isUpdating === item.id}
                      className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  {/* Total Price */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${item.total.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removeItem.isPending}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {subtotal < 50 && (
                  <p className="text-sm text-gray-500">
                    Free shipping on orders over $50
                  </p>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-gray-900 text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 text-center block"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/products"
                className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-gray-50 text-center block mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}