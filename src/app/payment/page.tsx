"use client";

import { api } from "@/trpc/react";
import Image from "next/image";
import { PayPalButton } from "@/app/checkout/_components/paypal-button";
import { type CartItemType, type ShippingInfo } from "@/types/cart";
import { type PayPalCaptureResponse } from "@/lib/paypal";

interface CheckoutData {
  cartItems: CartItemType[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingMethod: string;
}

export default function PaymentPage() {
  const { data: cartData, isLoading, error } = api.cart.get.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  });

  const checkoutData: CheckoutData | null = cartData ? {
    cartItems: cartData.cartItems ?? [],
    shippingInfo: cartData.shippingInfo ?? {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US"
    },
    subtotal: cartData.subtotal ?? 0,
    shippingCost: cartData.shippingCost ?? 599,
    total: cartData.total ?? 0,
    shippingMethod: cartData.shippingMethod ?? "standard",
  } : null;

  const validationError = error ? "Failed to fetch cart data" : null;

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const handleBackToCheckout = () => {
    window.location.href = "/checkout";
  };

  if (isLoading || !checkoutData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <span className="text-lg text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (validationError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-sm">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-gray-900">Cart Validation Error</h2>
            <p className="mt-2 text-sm text-gray-600">{validationError}</p>
            <button
              onClick={() => window.location.href = "/checkout"}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Return to Checkout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <p className="mt-2 text-gray-600">Complete your purchase with PayPal</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Order Items */}
              <div className="mb-4 space-y-3">
                {checkoutData.cartItems.map((item) => {
                  // Ensure imageUrl is valid for next/image
                  const imageUrl = item.imageUrl?.startsWith('/') || item.imageUrl?.startsWith('http')
                    ? item.imageUrl
                    : '/placeholder-product.jpg';

                  return (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Image
                        src={imageUrl}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Shipping Information */}
              <div className="border-t pt-4 mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping To:</h3>
                <div className="text-sm text-gray-600">
                  <p>{checkoutData.shippingInfo.firstName} {checkoutData.shippingInfo.lastName}</p>
                  <p>{checkoutData.shippingInfo.address}</p>
                  {checkoutData.shippingInfo.apartment && <p>{checkoutData.shippingInfo.apartment}</p>}
                  <p>{checkoutData.shippingInfo.city}, {checkoutData.shippingInfo.state} {checkoutData.shippingInfo.zipCode}</p>
                  <p>{checkoutData.shippingInfo.country}</p>
                </div>
              </div>

              {/* Order Totals */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(checkoutData.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Shipping ({checkoutData.shippingMethod === 'standard' ? 'Standard' : 'Express'})
                  </span>
                  <span className="text-gray-900">{formatPrice(checkoutData.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-lg font-medium border-t pt-2">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatPrice(checkoutData.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Complete Payment</h2>
              
              <div className="space-y-6">
                {/* PayPal Payment */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Pay with PayPal</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Secure payment through PayPal. You can pay with your PayPal account or credit card.
                  </p>
                  <div className="max-w-md">
                    <PayPalButton
                      amount={(checkoutData.total / 100).toFixed(2)}
                      currency="USD"
                      shippingInfo={checkoutData.shippingInfo}
                      shippingMethod={checkoutData.shippingMethod}
                      onSuccess={(details: PayPalCaptureResponse) => {
                        // Redirect to success page with payment details
                        const params = new URLSearchParams({
                          orderID: details.orderID,
                          payerName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
                          amount: details.purchase_units[0]?.payments.captures[0]?.amount.value ?? '0',
                          currency: details.purchase_units[0]?.payments.captures[0]?.amount.currency_code ?? 'USD',
                        });
                        window.location.href = `/payment-success?${params.toString()}`;
                      }}
                      onError={(error: string) => {
                        console.error("PayPal payment error:", error);
                        alert("Payment failed. Please try again.");
                      }}
                      onCancel={() => {
                        alert("Payment cancelled.");
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Back to Checkout Link */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleBackToCheckout}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  ← Back to checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
