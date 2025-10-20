"use client";

import { memo, useEffect, useRef, useState } from "react";
import { type PayPalCaptureResponse } from "@/lib/paypal";
import { type ShippingInfo } from "@/types/cart";
import { api } from "@/trpc/react";

interface PayPalButtonProps {
  amount: string;
  currency?: string;
  disabled?: boolean;
  sessionToken?: string;
  shippingInfo: ShippingInfo;
  shippingMethod: string;
  onSuccess?: (details: PayPalCaptureResponse) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

interface PayPalButtons {
  render: (selector: string) => Promise<void>;
  close: () => void;
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: PayPalButtonConfig) => PayPalButtons;
    };
  }
}

interface PayPalButtonConfig {
  style?: {
    shape?: string;
    color?: string;
    layout?: string;
    label?: string;
    height?: number;
  };
  onClick?: () => void;
  createOrder: () => Promise<string>;
  onApprove: (data: { orderID: string }) => Promise<void>;
  onCancel?: () => void;
  onError?: (err: Error) => void;
}

// Simplified PayPal button implementation based on reference code
function PayPalButton({
  amount,
  currency = "USD",
  disabled = false,
  sessionToken,
  shippingInfo,
  shippingMethod,
  onSuccess,
  onError,
  onCancel,
}: PayPalButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const buttonsInstanceRef = useRef<PayPalButtons | null>(null);
  const shippingInfoRef = useRef(shippingInfo);
  const shippingMethodRef = useRef(shippingMethod);
  const idempotencyKeyRef = useRef<string | null>(null);
  
  useEffect(() => {
    shippingInfoRef.current = shippingInfo;
    shippingMethodRef.current = shippingMethod;
  }, [shippingInfo, shippingMethod]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      idempotencyKeyRef.current ??= `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }
  }, []);
  
  const createOrderMutation = api.paypal.createOrder.useMutation();
  const captureOrderMutation = api.paypal.captureOrder.useMutation();

  // Load PayPal SDK script (simplified approach from reference)
  useEffect(() => {
    // Check if PayPal is already loaded
    if (window.paypal) {
      setIsScriptLoaded(true);
      setIsLoading(false);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="paypal.com/sdk/js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        setIsScriptLoaded(true);
        setIsLoading(false);
      });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}&intent=capture&disable-funding=credit,card`;
    script.async = true;
    
    script.onload = () => {
      setIsScriptLoaded(true);
      setIsLoading(false);
    };
    
    script.onerror = () => {
      setIsLoading(false);
      onError?.("Failed to load PayPal SDK");
    };

    document.head.appendChild(script);
  }, [currency, onError]);

// Render PayPal buttons (simplified from reference)
  useEffect(() => {
    if (!isScriptLoaded || !window.paypal || !containerRef.current || disabled) {
      return;
    }

    // Use a small delay to ensure DOM is stable
    const renderTimeout = setTimeout(() => {
      // Double-check that the container still exists
      if (!containerRef.current || !window.paypal) {
        return;
      }

      // Clean up existing buttons
      if (buttonsInstanceRef.current) {
        try {
          buttonsInstanceRef.current.close();
        } catch {
          // Ignore cleanup errors
        }
        buttonsInstanceRef.current = null;
      }

      // Clear container safely
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }

      // Create unique ID for this container to avoid conflicts
      const containerId = `paypal-container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      if (containerRef.current) {
        containerRef.current.id = containerId;
      }

      const paypalButtons = window.paypal.Buttons({
        style: {
          shape: 'rect',
          color: 'gold',
          layout: 'vertical',
          label: 'paypal',
          height: 45
        },
        
        onClick: () => {
          console.log('PayPal button clicked');
        },

        createOrder: async () => {
          try {
            console.log('Creating PayPal order...');
            const method = shippingMethodRef.current === "express" ? "express" : "standard";
            const result = await createOrderMutation.mutateAsync({
              shippingInfo: shippingInfoRef.current,
              shippingMethod: method,
              idempotencyKey: idempotencyKeyRef.current ?? undefined,
            });
            console.log('PayPal order created:', result);
            console.log('Returning orderID:', result.orderID);
            console.log('OrderID type:', typeof result.orderID);
            if (!result || typeof result.orderID !== "string") {
              console.error('Invalid order result:', result);
              throw new Error("Failed to create PayPal order - invalid response");
            }
            return result.orderID;
          } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to create PayPal order";
            console.error('Error creating order:', error);
            console.error('Error details:', {
              message,
              error,
              shippingInfo,
              shippingMethod
            });
            alert(`Failed to create order: ${message}`);
            onError?.(message);
            throw error;
          }
        },

        onApprove: async (data: { orderID: string }) => {
          try {
            console.log('onApprove called with:', data);
            const orderDetails = await captureOrderMutation.mutateAsync({ orderID: data.orderID });
            console.log('Order captured:', orderDetails);
            if (!orderDetails || typeof orderDetails.orderID !== "string" || orderDetails.status !== "COMPLETED") {
              throw new Error("Failed to complete payment");
            }
            console.log('Payment successful:', orderDetails);
            onSuccess?.(orderDetails);
            if (buttonsInstanceRef.current) {
              buttonsInstanceRef.current.close();
            }
            return;
          } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to complete payment";
            console.error('Error capturing order:', error);
            alert(`Failed to capture payment: ${message}`);
            onError?.(message);
          }
        },

        onCancel: () => {
          console.log('Payment cancelled by user');
          alert('Payment was cancelled');
          onCancel?.();
        },

        onError: (err: Error) => {
          console.error('PayPal onError called:', err);
          console.error('Error message:', err.message);
          console.error('Error stack:', err.stack);
          alert(`PayPal error: ${err.message}`);
          onError?.("PayPal payment failed");
        }
      });

      // Render the buttons with error handling
      paypalButtons.render(`#${containerId}`)
        .then(() => {
          buttonsInstanceRef.current = paypalButtons;
        })
        .catch((error) => {
          console.error('Failed to render PayPal buttons:', error);
          onError?.("Failed to render PayPal buttons");
        });
    }, 100); // Small delay to ensure DOM stability

    // Cleanup timeout on component unmount or re-render
    return () => {
      clearTimeout(renderTimeout);
    };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScriptLoaded, amount, currency, disabled, sessionToken, onSuccess, onError, onCancel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (buttonsInstanceRef.current) {
        try {
          buttonsInstanceRef.current.close();
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-sm text-gray-600">Loading PayPal...</span>
        </div>
      </div>
    );
  }

  if (disabled) {
    return (
      <div className="relative w-full">
        <div ref={containerRef} className="w-full min-h-[45px] opacity-50 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-lg">
          <span className="text-sm text-gray-500 font-medium">Complete shipping information to enable PayPal</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full min-h-[45px]" />
    </div>
  );
}

// Memoized PayPal button that only re-renders when amount changes significantly
const MemoizedPayPalButton = memo(PayPalButton, (prevProps, nextProps) => {
  // Only re-render if amount changes by more than $0.01, currency changes, or disabled state changes
  const prevAmount = parseFloat(prevProps.amount);
  const nextAmount = parseFloat(nextProps.amount);
  const amountChanged = Math.abs(prevAmount - nextAmount) >= 0.01;
  
  return !amountChanged && 
         prevProps.currency === nextProps.currency && 
         prevProps.disabled === nextProps.disabled;
});

export { MemoizedPayPalButton as PayPalButton };