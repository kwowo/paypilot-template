"use client";

import { useState, useEffect } from "react";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

interface OrderForm {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<OrderForm>({
    customerName: "",
    customerEmail: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
    shippingCountry: "US",
  });

  useEffect(() => {
    const storedSessionId = localStorage.getItem("sessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    }
  }, []);

  const { data: cartItems = [] } = api.cart.getItems.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  const createOrder = api.order.create.useMutation({
    onSuccess: (order) => {
      router.push(`/orders/${order.orderNumber}`);
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const orderItems = cartItems.map((item: any) => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
    }));

    createOrder.mutate({
      ...form,
      items: orderItems,
      sessionId,
    });
  };

  const total = cartItems.reduce((sum: number, item: any) => 
    sum + (item.product.price * item.quantity), 0
  );

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Checkout</h1>
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Form */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={form.customerEmail}
                onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                required
                value={form.shippingAddress}
                onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                className="w-full p-3 border rounded-md"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  required
                  value={form.shippingCity}
                  onChange={(e) => setForm({ ...form, shippingCity: e.target.value })}
                  className="w-full p-3 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  required
                  value={form.shippingState}
                  onChange={(e) => setForm({ ...form, shippingState: e.target.value })}
                  className="w-full p-3 border rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">ZIP Code</label>
                <input
                  type="text"
                  required
                  value={form.shippingZip}
                  onChange={(e) => setForm({ ...form, shippingZip: e.target.value })}
                  className="w-full p-3 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <select
                  value={form.shippingCountry}
                  onChange={(e) => setForm({ ...form, shippingCountry: e.target.value })}
                  className="w-full p-3 border rounded-md"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="space-y-4 mb-6">
              {cartItems.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    {item.variant && (
                      <p className="text-sm text-gray-500">
                        {item.variant.size} - {item.variant.color}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}