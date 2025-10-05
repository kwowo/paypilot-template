import Link from "next/link";
import { auth } from "@/lib/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/orders");
  }

  const orders = await api.order.getMyOrders({ limit: 20 });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              TeeShop
            </Link>
            <nav className="flex space-x-8">
              <Link href="/products" className="text-gray-700 hover:text-gray-900">
                Products
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-gray-900">
                Cart
              </Link>
              <span className="text-sm text-gray-600">
                {session.user.name}
              </span>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
            <Link
              href="/products"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      ${order.total.toFixed(2)}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                      order.status === "SHIPPED" ? "bg-blue-100 text-blue-800" :
                      order.status === "PROCESSING" ? "bg-yellow-100 text-yellow-800" :
                      order.status === "CONFIRMED" ? "bg-purple-100 text-purple-800" :
                      order.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.slice(0, 3).map((item: any) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">
                          <div className="h-full bg-gray-100 flex items-center justify-center">
                            <span className="text-xs text-gray-500">IMG</span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {item.size} • {item.color} • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {order.items.length > 3 && (
                    <p className="text-sm text-gray-500 mt-2">
                      +{order.items.length - 3} more items
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <p>Ship to: {order.shippingName}</p>
                    <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                  </div>
                  
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-block bg-gray-100 text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}