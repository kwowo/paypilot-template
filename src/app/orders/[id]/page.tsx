import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { api } from "@/trpc/server";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/orders");
  }

  try {
    const order = await api.order.getById({ id });

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
                <Link href="/orders" className="text-gray-700 hover:text-gray-900">
                  Back to Orders
                </Link>
                <span className="text-sm text-gray-600">
                  {session.user.name}
                </span>
              </nav>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Order Header */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Order #{order.id.slice(-8)}
                </h1>
                <p className="text-gray-600 mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                  {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              
              <span className={`inline-block px-3 py-2 text-sm font-medium rounded-full ${
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Items Ordered</h2>
              
              <div className="space-y-4">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center space-x-4 border-b border-gray-200 pb-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">
                      <div className="h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-500">IMG</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link 
                          href={`/products/${item.product.category.slug}/${item.product.slug}`}
                          className="hover:text-gray-700"
                        >
                          {item.product.name}
                        </Link>
                      </h3>
                      <p className="text-sm text-gray-500">{item.product.category.name}</p>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary & Shipping */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${order.subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      ${order.shipping.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${order.tax.toFixed(2)}</span>
                  </div>
                  
                  <hr className="my-2" />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">{order.shippingName}</p>
                  <p>{order.shippingAddress}</p>
                  <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                  <p>{order.shippingCountry}</p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {order.shippingEmail}
                  </p>
                  {order.paymentMethod && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Payment:</span> {order.paymentMethod}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Actions */}
              <div className="space-y-3">
                {order.status === "DELIVERED" && (
                  <button className="w-full bg-gray-900 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-800">
                    Reorder Items
                  </button>
                )}
                
                {(order.status === "PENDING" || order.status === "CONFIRMED") && (
                  <button className="w-full border border-red-300 text-red-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-red-50">
                    Cancel Order
                  </button>
                )}
                
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-50">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}