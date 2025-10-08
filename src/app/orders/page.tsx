"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { api } from "@/trpc/react";

export default function OrdersPage() {
  const { data: session } = useSession();
  const { data: orders, isLoading } = api.order.getMyOrders.useQuery(undefined, {
    enabled: !!session,
  });

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-600 mb-8">
            Please sign in to view your order history.
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-purple-100 text-purple-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
        <Link
          href="/products"
          className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 font-medium"
        >
          Continue Shopping
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No orders yet
          </h2>
          <p className="text-gray-600 mb-8">
            When you place your first order, it will appear here.
          </p>
          <Link
            href="/products"
            className="bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 font-medium"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="flex items-center space-x-4 mb-4">
                {order.orderItems.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-gray-500 text-xs">T</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {item.variant.size} / {item.variant.color} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                {order.orderItems.length > 3 && (
                  <span className="text-sm text-gray-500">
                    +{order.orderItems.length - 3} more items
                  </span>
                )}
              </div>

              {/* Shipping Address */}
              <div className="text-sm text-gray-600 mb-4">
                <p className="font-medium">Shipping to:</p>
                <p>
                  {order.shippingName}, {order.shippingAddress1}
                  {order.shippingAddress2 && `, ${order.shippingAddress2}`}
                </p>
                <p>
                  {order.shippingCity}, {order.shippingState} {order.shippingZip}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Link
                  href={`/orders/${order.id}`}
                  className="text-gray-900 hover:text-gray-700 font-medium"
                >
                  View Details →
                </Link>
                <div className="text-sm text-gray-600">
                  {order.orderItems.length} {order.orderItems.length === 1 ? 'item' : 'items'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}