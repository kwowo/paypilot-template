import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id: orderNumber } = await params;
  
  try {
    const order = await api.order.getByOrderNumber({ orderNumber });
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Order Confirmation</h1>
            <p className="text-gray-600">Thank you for your order!</p>
          </div>

          {/* Order Details */}
          <div className="bg-white border rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Order Information</h3>
                <p><strong>Order Number:</strong> {order.orderNumber}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Customer Information</h3>
                <p><strong>Name:</strong> {order.customerName}</p>
                <p><strong>Email:</strong> {order.customerEmail}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <p>{order.shippingAddress}</p>
              <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
              <p>{order.shippingCountry}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-semibold mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex items-center space-x-4 pb-4 border-b last:border-b-0">
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.productName}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-xs">No image</span>
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <h4 className="font-medium">{item.productName}</h4>
                    {item.variantSize && item.variantColor && (
                      <p className="text-sm text-gray-500">
                        {item.variantSize} - {item.variantColor}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">${item.price.toFixed(2)} each</p>
                    <p className="text-sm text-gray-600">
                      Subtotal: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-xl font-bold">Total: ${order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/shop"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}