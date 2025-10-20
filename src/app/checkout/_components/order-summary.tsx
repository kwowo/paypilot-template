interface OrderSummaryProps {
  subtotal: number;
  shippingCost: number;
  total: number;
  promoCode: string;
  shippingMethod: string;
  cartItemCount: number;
  onPromoCodeChange: (code: string) => void;
  onShippingMethodChange: (method: string) => void;
  onApplyPromoCode: () => void;
  onCheckout: () => void;
  formatPrice: (priceInCents: number) => string;
  priceWarnings?: string[];
}

export function OrderSummary({
  subtotal,
  shippingCost,
  total,
  promoCode,
  shippingMethod,
  cartItemCount,
  onPromoCodeChange,
  onShippingMethodChange,
  onApplyPromoCode,
  onCheckout,
  formatPrice,
  priceWarnings = [],
}: OrderSummaryProps) {
  
  const isCartEmpty = cartItemCount === 0;
  const hasItemsToCheckout = subtotal > 0;

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
      <p className="text-sm text-gray-600 mb-6">
        Review your order details and shipping information
      </p>

      {/* Shipping Method */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Shipping Method</h3>
        <div className="space-y-2">
          <label className="flex items-center justify-between rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
            <div className="flex items-center">
              <input
                type="radio"
                name="shipping"
                value="standard"
                checked={shippingMethod === "standard"}
                onChange={(e) => onShippingMethodChange(e.target.value)}
                className="mr-3"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">Standard Shipping</div>
                <div className="text-xs text-gray-500">3-5 days</div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {formatPrice(599)}
            </div>
          </label>
          
          <label className="flex items-center justify-between rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50">
            <div className="flex items-center">
              <input
                type="radio"
                name="shipping"
                value="express"
                checked={shippingMethod === "express"}
                onChange={(e) => onShippingMethodChange(e.target.value)}
                className="mr-3"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">Express Shipping</div>
                <div className="text-xs text-gray-500">1-2 days</div>
              </div>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {formatPrice(1299)}
            </div>
          </label>
        </div>
      </div>

      {/* Promo Code */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Promo Code</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={onApplyPromoCode}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Apply
          </button>
        </div>
      </div>

      {priceWarnings.length > 0 && (
        <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start">
            <svg className="mr-2 h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800 mb-1">Price Update Notice</p>
              {priceWarnings.map((warning, index) => (
                <p key={index} className="text-sm text-yellow-700">{warning}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Order Totals */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium text-gray-900">{formatPrice(shippingCost)}</span>
        </div>
        
        <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-semibold">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">{formatPrice(total)}</span>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 space-y-3 border-t border-gray-200 pt-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="mr-2 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Free returns within 30 days
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <svg className="mr-2 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure payment
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <svg className="mr-2 h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Fast delivery
        </div>
      </div>

      {/* Checkout Buttons */}
      {isCartEmpty ? (
        <div className="mb-4 rounded-lg border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-center">
            <svg className="mr-2 h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-orange-800">Cart is empty</p>
              <p className="text-sm text-orange-700">Add items to your cart before proceeding to checkout.</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Checkout Button */}
          <button
            onClick={onCheckout}
            disabled={!hasItemsToCheckout}
            className="w-full rounded-lg bg-gray-900 py-3 px-4 text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Proceed to Checkout
            </div>
          </button>
        </>
      )}
    </div>
  );
}