"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { CartItem } from "@/app/checkout/_components/cart-item";
import { OrderSummary } from "@/app/checkout/_components/order-summary";
import { type CartItemType, type ShippingInfo } from "@/types/cart";
import { useSession } from "@/lib/auth-client";

type ValidationErrors = {
  [K in keyof ShippingInfo]?: string;
};

const initialShippingInfo: ShippingInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  zipCode: "",
  country: "US",
};

export function CheckoutForm() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } = useSession();

  useEffect(() => {
    if (!isSessionLoading && !session) {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("csrf-token");
      }
      alert("Please sign in to continue with checkout");
      router.push("/sign-in");
    }
  }, [session, isSessionLoading, router]);

  useEffect(() => {
    if (session && !isSessionLoading) {
      const refetchCsrf = async () => {
        try {
          const response = await fetch("/api/trpc/csrf.get");
          const headerToken = response.headers.get("x-csrf-token");
          if (headerToken && typeof window !== "undefined") {
            sessionStorage.setItem("csrf-token", headerToken);
          }
        } catch (error) {
          console.error("Failed to refetch CSRF token:", error);
        }
      };
      void refetchCsrf();
    }
  }, [session, isSessionLoading]);
  
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(initialShippingInfo);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<keyof ShippingInfo, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    address: false,
    apartment: false,
    city: false,
    state: false,
    zipCode: false,
    country: false,
  });
  const [subtotal, setSubtotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(599);
  const [total, setTotal] = useState(0);
  const [priceWarnings, setPriceWarnings] = useState<string[]>([]);

  const { data: cartData, refetch: refetchCart } = api.cart.get.useQuery();

  useEffect(() => {
    if (cartData) {
      const items = cartData.cartItems ?? [];
      setCartItems(items);
      const warnings: string[] = [];
      items.forEach((item) => {
        if (item.cachedPrice && item.price !== item.cachedPrice) {
          const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;
          warnings.push(
            `${item.name} price changed from ${formatPrice(item.cachedPrice)} to ${formatPrice(item.price)}`
          );
        }
      });
      setPriceWarnings(warnings);
      const safeShippingInfo: ShippingInfo = {
        firstName: cartData.shippingInfo?.firstName ?? "",
        lastName: cartData.shippingInfo?.lastName ?? "",
        email: cartData.shippingInfo?.email ?? "",
        phone: cartData.shippingInfo?.phone ?? "",
        address: cartData.shippingInfo?.address ?? "",
        apartment: cartData.shippingInfo?.apartment ?? "",
        city: cartData.shippingInfo?.city ?? "",
        state: cartData.shippingInfo?.state ?? "",
        zipCode: cartData.shippingInfo?.zipCode ?? "",
        country: cartData.shippingInfo?.country ?? "US"
      };
      setShippingInfo(safeShippingInfo);
      setShippingMethod(cartData.shippingMethod ?? "standard");
      setSubtotal(cartData.subtotal ?? 0);
      setShippingCost(cartData.shippingCost ?? 599);
      setTotal(cartData.total ?? 0);
    }
  }, [cartData]);

  const updateCartMutation = api.cart.update.useMutation({
    onSuccess: () => {
      console.log("Cart updated successfully");
      void refetchCart();
    },
    onError: (error) => {
      console.error("Error updating quantity:", error);
      alert(`Failed to update cart: ${error.message}`);
    }
  });

  const removeCartMutation = api.cart.remove.useMutation({
    onSuccess: () => {
      void refetchCart();
    },
    onError: (error) => {
      console.error("Error removing item:", error);
    }
  });

  const updateQuantity = (id: string, newQuantity: number) => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;
    
    if (newQuantity === 0) {
      removeCartMutation.mutate({ productId: item.id, color: item.color, size: item.size });
    } else {
      updateCartMutation.mutate({ productId: item.id, color: item.color, size: item.size, quantity: newQuantity });
    }
  };

  const removeItem = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (!item) return;
    removeCartMutation.mutate({ productId: item.id, color: item.color, size: item.size });
  };

  // Validation functions
  const validateField = (field: keyof ShippingInfo, value: string): string => {
    switch (field) {
      case "firstName":
      case "lastName":
        return value.trim().length < 2 ? "Must be at least 2 characters" : "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? "Please enter a valid email address" : "";
      case "phone":
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return value && !phoneRegex.test(value.replace(/[\s\-\(\)]/g, "")) ? "Please enter a valid phone number" : "";
      case "address":
        return value.trim().length < 5 ? "Please enter a complete address" : "";
      case "city":
        return value.trim().length < 2 ? "Please enter a valid city" : "";
      case "state":
        return !value ? "Please select a state/province" : "";
      case "zipCode":
        const zipRegex = /^[0-9]{5}(-[0-9]{4})?$|^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
        return !zipRegex.test(value.replace(/\s/g, "")) ? "Please enter a valid ZIP/postal code" : "";
      case "country":
        return !value ? "Please select a country" : "";
      default:
        return "";
    }
  };

  const validateAllFields = (): boolean => {
    const errors: ValidationErrors = {};
    const requiredFields: (keyof ShippingInfo)[] = [
      "firstName", "lastName", "email", "address", "city", "state", "zipCode", "country"
    ];

    requiredFields.forEach(field => {
      const error = validateField(field, shippingInfo[field]);
      if (error) {
        errors[field] = error;
      }
    });

    // Validate phone if provided
    if (shippingInfo.phone) {
      const phoneError = validateField("phone", shippingInfo.phone);
      if (phoneError) {
        errors.phone = phoneError;
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const updateShippingInfo = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));

    // Validate field on change if it has been touched
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const updateShippingMutation = api.cart.updateShipping.useMutation({
    onSuccess: () => {
      void refetchCart();
    },
    onError: (error) => {
      console.error("Error updating shipping:", error);
    }
  });

  const handleShippingMethodChange = (method: string) => {
    setShippingMethod(method);
    updateShippingMutation.mutate({ shippingInfo, shippingMethod: method as "standard" | "express" });
  };

  const formatPrice = (priceInCents: number) => {
    return `$${(priceInCents / 100).toFixed(2)}`;
  };

  const handlePromoCode = () => {
    // In a real app, you would validate the promo code here
    console.log("Applying promo code:", promoCode);
  };

  const handleCheckout = () => {
    if (!validateAllFields()) {
      alert("Please correct the errors in the shipping information before proceeding.");
      return;
    }
    updateShippingMutation.mutate(
      { shippingInfo, shippingMethod: shippingMethod as "standard" | "express" },
      {
        onSuccess: () => {
          window.location.href = `/payment`;
        },
        onError: (error) => {
          console.error("Error during checkout:", error);
          alert("There was an error processing your checkout. Please try again.");
        }
      }
    );
  };

  const getFieldError = (field: keyof ShippingInfo) => {
    return touched[field] ? validationErrors[field] : undefined;
  };

  const getInputClassName = (field: keyof ShippingInfo) => {
    const baseClass = "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1";
    const hasError = touched[field] && validationErrors[field];
    
    if (hasError) {
      return `${baseClass} border-red-300 focus:border-red-500 focus:ring-red-500`;
    }
    return `${baseClass} border-gray-300 focus:border-blue-500 focus:ring-blue-500`;
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Shopping Cart and Shipping Section */}
      <div className="lg:col-span-2 space-y-6">
        {/* Shopping Cart */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-sm text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                formatPrice={formatPrice}
              />
            ))}
          </div>

          {cartItems.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          )}
        </div>

        {/* Shipping Information */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
            <p className="text-sm text-gray-600">Enter your delivery address and contact details</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Contact Information */}
            <div className="sm:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            </div>
            
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                value={shippingInfo.firstName}
                onChange={(e) => updateShippingInfo("firstName", e.target.value)}
                className={getInputClassName("firstName")}
                required
              />
              {getFieldError("firstName") && (
                <p className="mt-1 text-sm text-red-600">{getFieldError("firstName")}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                value={shippingInfo.lastName}
                onChange={(e) => updateShippingInfo("lastName", e.target.value)}
                className={getInputClassName("lastName")}
                required
              />
              {getFieldError("lastName") && (
                <p className="mt-1 text-sm text-red-600">{getFieldError("lastName")}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={shippingInfo.email}
                onChange={(e) => updateShippingInfo("email", e.target.value)}
                className={getInputClassName("email")}
                required
              />
              {getFieldError("email") && (
                <p className="mt-1 text-sm text-red-600">{getFieldError("email")}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={shippingInfo.phone}
                onChange={(e) => updateShippingInfo("phone", e.target.value)}
                className={getInputClassName("phone")}
                placeholder="(555) 123-4567"
              />
              {getFieldError("phone") && (
                <p className="mt-1 text-sm text-red-600">{getFieldError("phone")}</p>
              )}
            </div>

            {/* Shipping Address */}
            <div className="sm:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4 mt-6">Shipping Address</h3>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                id="address"
                value={shippingInfo.address}
                onChange={(e) => updateShippingInfo("address", e.target.value)}
                className={getInputClassName("address")}
                placeholder="123 Main Street"
                required
              />
              {getFieldError("address") && (
                <p className="mt-1 text-sm text-red-600">{getFieldError("address")}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
                Apartment, suite, etc. (optional)
              </label>
              <input
                type="text"
                id="apartment"
                value={shippingInfo.apartment}
                onChange={(e) => updateShippingInfo("apartment", e.target.value)}
                className={getInputClassName("apartment")}
                placeholder="Apt 4B, Suite 100, etc."
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                value={shippingInfo.city}
                onChange={(e) => updateShippingInfo("city", e.target.value)}
                className={getInputClassName("city")}
                placeholder="New York"
                required
              />
              {getFieldError("city") && (
                <p className="mt-1 text-sm text-red-600">{getFieldError("city")}</p>
              )}
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State / Province *
              </label>
              <select
                id="state"
                value={shippingInfo.state}
                onChange={(e) => updateShippingInfo("state", e.target.value)}
                className={getInputClassName("state")}
                required
              >
                <option value="">Select State</option>
                <option value="CA">California</option>
                <option value="NY">New York</option>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
                <option value="IL">Illinois</option>
                <option value="PA">Pennsylvania</option>
                <option value="OH">Ohio</option>
                <option value="GA">Georgia</option>
                <option value="NC">North Carolina</option>
                <option value="MI">Michigan</option>
                <option value="WA">Washington</option>
                <option value="AZ">Arizona</option>
                <option value="MA">Massachusetts</option>
                <option value="TN">Tennessee</option>
                <option value="IN">Indiana</option>
                <option value="MO">Missouri</option>
                <option value="MD">Maryland</option>
                <option value="WI">Wisconsin</option>
                <option value="CO">Colorado</option>
                <option value="MN">Minnesota</option>
              </select>
              {getFieldError("state") && (
                <p className="mt-1 text-sm text-red-600">{getFieldError("state")}</p>
              )}
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                ZIP / Postal Code *
              </label>
              <input
                type="text"
                id="zipCode"
                value={shippingInfo.zipCode}
                onChange={(e) => updateShippingInfo("zipCode", e.target.value)}
                className={getInputClassName("zipCode")}
                placeholder="12345 or 12345-6789"
                required
              />
              {getFieldError("zipCode") && (
                <p className="mt-1 text-sm text-red-600">{getFieldError("zipCode")}</p>
              )}
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                id="country"
                value={shippingInfo.country}
                onChange={(e) => updateShippingInfo("country", e.target.value)}
                className={getInputClassName("country")}
                required
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="IT">Italy</option>
                <option value="ES">Spain</option>
                <option value="NL">Netherlands</option>
                <option value="JP">Japan</option>
                <option value="BR">Brazil</option>
                <option value="MX">Mexico</option>
                <option value="IN">India</option>
                <option value="CN">China</option>
                <option value="KR">South Korea</option>
              </select>
              {getFieldError("country") && (
                <p className="mt-1 text-sm text-red-600">{getFieldError("country")}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="lg:col-span-1">
        <OrderSummary
          subtotal={subtotal}
          shippingCost={shippingCost}
          total={total}
          promoCode={promoCode}
          shippingMethod={shippingMethod}
          cartItemCount={cartItems.length}
          onPromoCodeChange={setPromoCode}
          onShippingMethodChange={handleShippingMethodChange}
          onApplyPromoCode={handlePromoCode}
          onCheckout={handleCheckout}
          formatPrice={formatPrice}
          priceWarnings={priceWarnings}
        />
      </div>
    </div>
  );
}