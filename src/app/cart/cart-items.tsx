"use client";

import Link from "next/link";
import { api } from "@/trpc/react";

export function CartItems() {
  const { data: cartItems, isLoading, refetch } = api.cart.getItems.useQuery();
  const { data: cartSummary } = api.cart.getSummary.useQuery();
  
  const updateQuantity = api.cart.updateQuantity.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const removeItem = api.cart.removeItem.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const clearCart = api.cart.clearCart.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some awesome t-shirts to get started!</p>
        <Link
          href="/products"
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="space-y-4">
          {cartItems.map((item: any) => (
            <div key={item.id} className="flex items-center space-x-4 border-b border-gray-200 pb-4">
              {/* Product Image */}
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">
                <div className="h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-500">Image</span>
                </div>
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  <Link 
                    href={`/products/${item.product.category.slug}/${item.product.slug}`}
                    className="hover:text-gray-700"
                  >
                    {item.product.name}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500">{item.product.category.name}</p>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                  <span>Size: {item.size}</span>
                  <span>Color: {item.color}</span>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-lg font-medium text-gray-900">
                  ${((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  ${(item.product.salePrice || item.product.price).toFixed(2)} each
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity.mutate({ id: item.id, quantity: item.quantity - 1 })}
                  disabled={item.quantity <= 1 || updateQuantity.isPending}
                  className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity.mutate({ id: item.id, quantity: item.quantity + 1 })}
                  disabled={updateQuantity.isPending}
                  className="h-8 w-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  +
                </button>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeItem.mutate({ id: item.id })}
                disabled={removeItem.isPending}
                className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Clear Cart */}
        <div className="mt-6">
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear your cart?")) {
                clearCart.mutate();
              }
            }}
            disabled={clearCart.isPending}
            className="text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Clear entire cart
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          
          {cartSummary && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Items ({cartSummary.totalItems})</span>
                <span className="font-medium">${cartSummary.totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {cartSummary.totalPrice > 50 ? "Free" : "$9.99"}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">
                  ${(cartSummary.totalPrice * 0.08).toFixed(2)}
                </span>
              </div>
              
              <hr className="my-2" />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>
                  ${(cartSummary.totalPrice + (cartSummary.totalPrice > 50 ? 0 : 9.99) + cartSummary.totalPrice * 0.08).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div className="mt-6 space-y-4">
            <Link
              href="/checkout"
              className="block w-full bg-gray-900 text-white text-center py-3 px-4 rounded-md font-medium hover:bg-gray-800"
            >
              Proceed to Checkout
            </Link>
            
            <Link
              href="/products"
              className="block w-full border border-gray-300 text-gray-700 text-center py-3 px-4 rounded-md font-medium hover:bg-gray-50"
            >
              Continue Shopping
            </Link>
          </div>

          {cartSummary && cartSummary.totalPrice < 50 && (
            <div className="mt-4 text-sm text-center text-gray-600">
              Add ${(50 - cartSummary.totalPrice).toFixed(2)} more for free shipping!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}