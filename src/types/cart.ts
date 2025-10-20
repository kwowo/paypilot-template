export interface CartItemType {
  id: string;
  name: string;
  color: string;
  size: string;
  price: number; // price in cents
  originalPrice: number | null; // original price in cents if on sale
  quantity: number;
  imageUrl: string;
  cachedPrice?: number;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number; // price in cents
  estimatedDays: string;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CartResponse {
  success: boolean;
  sessionId?: string;
  cartItems?: CartItemType[];
  shippingInfo?: ShippingInfo;
  shippingMethod?: string;
  subtotal?: number;
  shippingCost?: number;
  total?: number;
  error?: string;
}