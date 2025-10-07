"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
            <p className="text-gray-600 mb-8">Please sign in to proceed with checkout</p>
            <Link 
              href="/sign-in"
              className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to orders page
    router.push('/orders');
  };

  // Mock cart data for checkout summary
  const cartItems = [
    {
      id: "1",
      product: {
        name: "Classic Black T-Shirt",
        price: 29.99,
      },
      variant: {
        size: "M",
        color: "Black",
      },
      quantity: 2,
    },
    {
      id: "2",
      product: {
        name: "Kids Rainbow Tee",
        price: 19.99,
      },
      variant: {
        size: "S",
        color: "Multi",
      },
      quantity: 1,
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="john.doe@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="123 Main Street"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900">
                    <option>Select State</option>
                    <option>NY</option>
                    <option>CA</option>
                    <option>TX</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="10001"
                  />
                </div>
              </div>
            </form>
            
            <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-6">Payment Information</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="123"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      Size: {item.variant.size} | Color: {item.variant.color} | Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </button>
            
            <Link 
              href="/cart"
              className="block text-center text-gray-600 hover:text-gray-800 mt-4 text-sm"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}