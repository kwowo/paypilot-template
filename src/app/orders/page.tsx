"use client";

// No local state needed
import { api } from "@/trpc/react";
import Link from "next/link";

export default function OrdersPage() {
  const { data, isLoading, error } = api.orders.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-gray-600">Loading order history...</span>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-red-600">Failed to load order history.</span>
      </div>
    );
  }

  if (!data.orders.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-gray-600">No orders found.</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Order History</h1>
        <div className="space-y-6">
          {data.orders.map((order) => (
            <div key={order.id} className="rounded-lg bg-white p-6 shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <span className="font-semibold text-gray-900">Order #{order.orderNumber}</span>
                  <span className="ml-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${order.status === "cancelled" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                  {order.status}
                </span>
              </div>
              <div className="mb-4 text-sm text-gray-700">
                <div>Payment Status: <span className="font-medium">{order.paymentStatus}</span></div>
                <div>Shipping Method: <span className="font-medium">{order.shippingMethod}</span></div>
                <div>Total: <span className="font-medium">${(order.total / 100).toFixed(2)}</span></div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Items:</h3>
                <ul className="list-disc pl-5">
                  {order.items.map((item) => (
                    <li key={item.id} className="mb-1">
                      {item.productName} ({item.color}, {item.size}) x{item.quantity} - ${((item.price * item.quantity) / 100).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-xs text-gray-500">
                Shipping to: {order.shippingInfo.firstName} {order.shippingInfo.lastName}, {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.state}, {order.shippingInfo.zipCode}, {order.shippingInfo.country}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
