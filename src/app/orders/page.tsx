"use client";

import { api } from "@/trpc/react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";

export default function OrdersPage() {
  const { data: session } = useSession();
  
  const { data: orders = [], isLoading } = api.order.getUserOrders.useQuery(
    undefined,
    { enabled: !!session?.user }
  );

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Order History</h1>
          <p className="text-gray-500 mb-4">Please sign in to view your order history</p>
          <Link
            href="/sign-in"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Order History</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet</p>
          <Link
            href="/shop"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">Order {order.orderNumber}</h3>
                  <p className="text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">${order.total.toFixed(2)}</p>
                  <Link
                    href={`/orders/${order.orderNumber}`}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {order.items.slice(0, 3).map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-xs">IMG</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.productName}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="text-center text-gray-500 text-sm">
                    +{order.items.length - 3} more items
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}