"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";

export function CheckoutForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    shippingName: "",
    shippingEmail: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
    shippingCountry: "US",
    paymentMethod: "card",
  });

  const { data: cartSummary, isLoading: cartLoading } = api.cart.getSummary.useQuery();
  
  const createOrder = api.order.create.useMutation({
    onSuccess: (order) => {
      router.push(`/orders/${order.id}`);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cartSummary || cartSummary.totalItems === 0) {
      alert("Your cart is empty");
      return;
    }

    createOrder.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (cartLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!cartSummary || cartSummary.totalItems === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
        <a 
          href="/products"
          className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  const shipping = cartSummary.totalPrice > 50 ? 0 : 9.99;
  const tax = cartSummary.totalPrice * 0.08;
  const total = cartSummary.totalPrice + shipping + tax;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Checkout Form */}
      <div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="shippingName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="shippingName"
                  name="shippingName"
                  required
                  value={formData.shippingName}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900"
                />
              </div>
              
              <div>
                <label htmlFor="shippingEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="shippingEmail"
                  name="shippingEmail"
                  required
                  value={formData.shippingEmail}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                id="shippingAddress"
                name="shippingAddress"
                required
                value={formData.shippingAddress}
                onChange={handleChange}
                className="w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="shippingCity" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="shippingCity"
                  name="shippingCity"
                  required
                  value={formData.shippingCity}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900"
                />
              </div>
              
              <div>
                <label htmlFor="shippingState" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  id="shippingState"
                  name="shippingState"
                  required
                  value={formData.shippingState}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900"
                />
              </div>
              
              <div>
                <label htmlFor="shippingZip" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="shippingZip"
                  name="shippingZip"
                  required
                  value={formData.shippingZip}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Method</h2>
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === "card"}
                  onChange={handleChange}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Credit Card</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === "paypal"}
                  onChange={handleChange}
                  className="h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">PayPal</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={createOrder.isPending}
            className="w-full bg-gray-900 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
          >
            {createOrder.isPending ? "Processing..." : `Place Order - $${total.toFixed(2)}`}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div>
        <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({cartSummary.totalItems} items)</span>
              <span className="font-medium">${cartSummary.totalPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            
            <hr className="my-3" />
            
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {shipping === 0 && (
            <div className="mt-4 text-sm text-green-600 text-center">
              ✓ Free shipping applied!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}