"use client";

import { useState } from "react";
import { api } from "@/trpc/react";

const PRODUCTS = {
  "product-1": {
    name: "Classic Chronograph Watch",
    colors: ["Black", "Silver", "Gold"],
    sizes: ["Standard", "Large"],
  },
  "product-2": {
    name: "Sport Diver Watch",
    colors: ["Blue", "Black", "Red"],
    sizes: ["Standard", "Large"],
  },
  "product-3": {
    name: "Smart Watch",
    colors: ["Silver", "Black", "Gold"],
    sizes: ["38mm", "42mm", "44mm"],
  },
  "product-4": {
    name: "Phone Case",
    colors: ["Clear", "Black", "Blue", "Red"],
    sizes: ["iPhone 14", "iPhone 15", "Samsung S24"],
  },
};

export default function TestCartPage() {
  const [productId, setProductId] = useState("product-1");
  const [color, setColor] = useState("Black");
  const [size, setSize] = useState("Standard");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  
  const selectedProduct = PRODUCTS[productId as keyof typeof PRODUCTS];

  const addToCart = api.cart.add.useMutation({
    onSuccess: (data) => {
      setMessage(`✓ Success: ${data.message}`);
      console.log("Added to cart:", data);
    },
    onError: (error) => {
      setMessage(`✗ Error: ${error.message}`);
      console.error("Error adding to cart:", error);
    },
  });

  const { data: cartData, refetch } = api.cart.get.useQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const csrfToken = sessionStorage.getItem("csrf-token");
    console.log("=== SUBMITTING CART ADD ===");
    console.log("CSRF Token in sessionStorage:", csrfToken ? csrfToken.substring(0, 20) + "..." : "NOT FOUND");
    console.log("Product ID:", productId);
    console.log("Color:", color);
    console.log("Size:", size);
    console.log("Quantity:", quantity);
    
    setMessage("Adding to cart...");
    addToCart.mutate({
      productId,
      color,
      size,
      quantity,
    });
  };

  const handleRefresh = () => {
    void refetch();
    setMessage("Cart refreshed");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Test Cart API</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Item to Cart</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
                  Product *
                </label>
                <select
                  id="productId"
                  value={productId}
                  onChange={(e) => {
                    const newProductId = e.target.value;
                    setProductId(newProductId);
                    const newProduct = PRODUCTS[newProductId as keyof typeof PRODUCTS];
                    setColor(newProduct.colors[0] ?? "");
                    setSize(newProduct.sizes[0] ?? "");
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="product-1">Classic Chronograph Watch</option>
                  <option value="product-2">Sport Diver Watch</option>
                  <option value="product-3">Smart Watch</option>
                  <option value="product-4">Phone Case</option>
                </select>
              </div>

              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                  Color *
                </label>
                <select
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
                >
                  {selectedProduct?.colors.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                  Size *
                </label>
                <select
                  id="size"
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
                >
                  {selectedProduct?.sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={addToCart.isPending}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {addToCart.isPending ? "Adding..." : "Add to Cart"}
              </button>
            </form>

            {message && (
              <div className={`mt-4 p-3 rounded-md text-sm ${
                message.startsWith("✓") 
                  ? "bg-green-50 text-green-800 border border-green-200" 
                  : message.startsWith("✗")
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-blue-50 text-blue-800 border border-blue-200"
              }`}>
                {message}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Current Cart</h2>
              <button
                onClick={handleRefresh}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Refresh
              </button>
            </div>

            {cartData ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  {cartData.cartItems.length} item(s) in cart
                </div>

                {cartData.cartItems.length > 0 ? (
                  <div className="space-y-3">
                    {cartData.cartItems.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-3">
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Color: {item.color} | Size: {item.size}
                        </div>
                        <div className="text-sm text-gray-600">
                          Qty: {item.quantity} × ${(item.price / 100).toFixed(2)}
                        </div>
                        <div className="text-sm font-medium text-gray-900 mt-1">
                          Total: ${((item.price * item.quantity) / 100).toFixed(2)}
                        </div>
                      </div>
                    ))}

                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">${(cartData.subtotal / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-900">${(cartData.shippingCost / 100).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">${(cartData.total / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Cart is empty
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Loading cart...
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">How to use:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Make sure you&apos;re signed in</li>
            <li>Select a product from the dropdown</li>
            <li>Select color, size, and quantity (options auto-update based on product)</li>
            <li>Click &quot;Add to Cart&quot;</li>
            <li>View the cart on the right side update automatically</li>
          </ol>
          <div className="mt-3 pt-3 border-t border-blue-300">
            <p className="text-xs text-blue-700"><strong>Available Products:</strong></p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• product-1: Classic Chronograph Watch (Black/Silver/Gold, Standard/Large)</li>
              <li>• product-2: Sport Diver Watch (Blue/Black/Red, Standard/Large)</li>
              <li>• product-3: Smart Watch (Silver/Black/Gold, 38mm/42mm/44mm)</li>
              <li>• product-4: Phone Case (Clear/Black/Blue/Red, iPhone 14/15, Samsung S24)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
