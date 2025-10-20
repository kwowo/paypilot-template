import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Successful | PayPal Checkout",
  description: "Your payment has been processed successfully",
};

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    orderID?: string;
    payerName?: string;
    amount?: string;
    currency?: string;
  }>;
}

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const { orderID, payerName, amount, currency } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg 
              className="h-8 w-8 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>

          {/* Payment Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
            
            {orderID && (
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-500">Order ID:</span>
                <p className="text-sm text-gray-900 font-mono">{orderID}</p>
              </div>
            )}
            
            {payerName && (
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-500">Payer:</span>
                <p className="text-sm text-gray-900">{payerName}</p>
              </div>
            )}
            
            {amount && (
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-500">Amount:</span>
                <p className="text-sm text-gray-900">
                  {currency ?? 'USD'} ${amount}
                </p>
              </div>
            )}
            
            <div className="mb-3">
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <p className="text-sm text-green-600 font-medium">Completed</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/checkout"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Continue Shopping
            </Link>
            
            <Link
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Back to Home
            </Link>
          </div>

          {/* Additional Information */}
          <div className="mt-8 text-xs text-gray-500">
            <p>
              You will receive a confirmation email shortly. 
              If you have any questions, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}