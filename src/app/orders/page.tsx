"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function OrdersPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order History</h1>
            <p className="text-gray-600 mb-8">Please sign in to view your orders</p>
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>
        
        <OrdersList />
      </div>
    </div>
  );
}

function OrdersList() {
  // Mock orders data - will be replaced with real tRPC call
  const orders = [
    {
      id: "1",
      orderNumber: "ORD-001",
      date: "2024-01-15",
      status: "Delivered",
      total: 79.97,
      items: [
        {
          product: { name: "Classic Black T-Shirt", slug: "classic-black-tshirt" },
          variant: { size: "M", color: "Black" },
          quantity: 2,
          price: 29.99,
        },
        {
          product: { name: "Kids Rainbow Tee", slug: "kids-rainbow-tee" },
          variant: { size: "S", color: "Multi" },
          quantity: 1,
          price: 19.99,
        },
      ],
    },
    {
      id: "2",
      orderNumber: "ORD-002",
      date: "2024-01-10",
      status: "Shipped",
      total: 24.99,
      items: [
        {
          product: { name: "White Cotton Tee", slug: "white-cotton-tee" },
          variant: { size: "L", color: "White" },
          quantity: 1,
          price: 24.99,
        },
      ],
    },
  ];

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-8">You haven&apos;t placed any orders yet</p>
        <Link 
          href="/shop"
          className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

interface OrderType {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: Array<{
    product: { name: string; slug: string };
    variant: { size: string; color: string };
    quantity: number;
    price: number;
  }>;
}

function OrderCard({ order }: { order: OrderType }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      {/* Order Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Order {order.orderNumber}
          </h3>
          <p className="text-sm text-gray-600">
            Placed on {new Date(order.date).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          <p className="text-lg font-semibold text-gray-900 mt-2">
            ${order.total.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-3">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-t">
            <div>
              <Link 
                href={`/product/${item.product.slug}`}
                className="font-medium text-gray-900 hover:text-gray-700"
              >
                {item.product.name}
              </Link>
              <p className="text-sm text-gray-600">
                Size: {item.variant.size} | Color: {item.variant.color} | Qty: {item.quantity}
              </p>
            </div>
            <span className="font-medium text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Order Actions */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex space-x-4">
          <Link 
            href={`/orders/${order.id}`}
            className="text-gray-900 hover:text-gray-700 text-sm font-medium"
          >
            View Details
          </Link>
          {order.status.toLowerCase() === "delivered" && (
            <button className="text-gray-900 hover:text-gray-700 text-sm font-medium">
              Reorder
            </button>
          )}
        </div>
      </div>
    </div>
  );
}