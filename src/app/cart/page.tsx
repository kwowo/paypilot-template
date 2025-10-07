"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";

export default function CartPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
            <p className="text-gray-600 mb-8">Please sign in to view your cart</p>
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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <CartContent />
      </div>
    </div>
  );
}

function CartContent() {
  const router = useRouter();
  
  // Mock cart data - will be replaced with real tRPC call when database is ready
  const [cartItems, setCartItems] = useState([
    {
      id: "1",
      product: {
        id: "1",
        name: "Classic Black T-Shirt",
        slug: "classic-black-tshirt",
        price: 29.99,
        images: ["/products/black-tshirt-1.jpg"],
      },
      variant: {
        id: "2",
        size: "M",
        color: "Black",
      },
      quantity: 2,
    },
    {
      id: "2",
      product: {
        id: "4",
        name: "Kids Rainbow Tee",
        slug: "kids-rainbow-tee",
        price: 19.99,
        images: ["/products/kids-rainbow-1.jpg"],
      },
      variant: {
        id: "13",
        size: "S",
        color: "Multi",
      },
      quantity: 1,
    },
  ]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    router.push('/checkout');
  };

  const total = cartItems.reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-8">Your cart is empty</p>
        <Link 
          href="/shop"
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {cartItems.map((item) => (
          <CartItem 
            key={item.id} 
            item={item} 
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={handleCheckout}
          className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

interface CartItemType {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
  };
  variant: {
    id: string;
    size: string;
    color: string;
  };
  quantity: number;
}

function CartItem({ 
  item, 
  onUpdateQuantity, 
  onRemove 
}: { 
  item: CartItemType;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
}) {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center space-x-4">
        {/* Product Image */}
        <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
          <span className="text-gray-500 text-xs">Image</span>
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <Link 
            href={`/product/${item.product.slug}`}
            className="font-semibold text-gray-900 hover:text-gray-700"
          >
            {item.product.name}
          </Link>
          <p className="text-sm text-gray-600">
            Size: {item.variant.size} | Color: {item.variant.color}
          </p>
          <p className="text-sm font-medium text-gray-900">
            ${item.product.price.toFixed(2)}
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-50"
          >
            -
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button 
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="w-8 h-8 border rounded-md flex items-center justify-center hover:bg-gray-50"
          >
            +
          </button>
        </div>

        {/* Remove Button */}
        <button 
          onClick={() => onRemove(item.id)}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Remove
        </button>
      </div>
    </div>
  );
}