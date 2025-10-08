"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { api } from "@/trpc/react";

export default function OrderDetailPage() {
  const resolvedParams = useParams();
  const orderId = resolvedParams.id as string;
  
  const { data: session } = useSession();
  const { data: order, isLoading, error } = api.order.getById.useQuery(
    { orderId },
    { enabled: !!session && !!orderId }
  );

  if (!session) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sign In Required
          </h1>
          <p className="text-gray-600 mb-8">
            Please sign in to view order details.
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

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    notFound();
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <p className="text-gray-600">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Items */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Items
            </h2>
            
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-500 text-sm">T</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="hover:text-gray-700"
                      >
                        {item.product.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-gray-600">
                      Size: {item.variant.size} | Color: {item.variant.color}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Shipping Information
            </h2>
            
            <div className="space-y-2 text-gray-700">
              <p className="font-medium">{order.shippingName}</p>
              <p>{order.shippingEmail}</p>
              <div className="pt-2">
                <p>{order.shippingAddress1}</p>
                {order.shippingAddress2 && <p>{order.shippingAddress2}</p>}
                <p>
                  {order.shippingCity}, {order.shippingState} {order.shippingZip}
                </p>
                <p>{order.shippingCountry}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Status
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900">Order Placed</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  ["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status)
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">Processing</p>
                  <p className="text-sm text-gray-600">
                    {order.status === "PROCESSING" ? "Currently processing" : "Pending"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  ["SHIPPED", "DELIVERED"].includes(order.status)
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">Shipped</p>
                  <p className="text-sm text-gray-600">
                    {order.status === "SHIPPED" ? "In transit" : "Not yet shipped"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  order.status === "DELIVERED" ? "bg-green-500" : "bg-gray-300"
                }`}></div>
                <div>
                  <p className="font-medium text-gray-900">Delivered</p>
                  <p className="text-sm text-gray-600">
                    {order.status === "DELIVERED" ? "Order delivered" : "Not yet delivered"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/orders"
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 text-center block"
            >
              Back to Orders
            </Link>
            
            <Link
              href="/products"
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-gray-50 text-center block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}