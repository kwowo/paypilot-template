import { type CartItemType } from "@/types/cart";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  formatPrice: (priceInCents: number) => string;
}

export function CartItem({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  formatPrice 
}: CartItemProps) {
  const handleQuantityChange = (increment: boolean) => {
    const newQuantity = increment ? item.quantity + 1 : item.quantity - 1;
    if (newQuantity >= 0) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center space-x-4 rounded-lg border border-gray-200 p-4">
      {/* Product Image */}
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        <div className="flex h-full w-full items-center justify-center bg-gray-200">
          {/* Placeholder for product image */}
          <div className="text-gray-400">
            <svg 
              className="h-8 w-8" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-600">
          {item.color} • {item.size}
        </p>
        
        {/* Price */}
        <div className="mt-1 flex items-center space-x-2">
          <span className="text-lg font-semibold text-gray-900">
            {formatPrice(item.price)}
          </span>
          {item.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(item.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(false)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
          aria-label="Decrease quantity"
        >
          <span className="text-lg">−</span>
        </button>
        
        <span className="w-8 text-center text-lg font-medium">{item.quantity}</span>
        
        <button
          onClick={() => handleQuantityChange(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 hover:bg-gray-50"
          aria-label="Increase quantity"
        >
          <span className="text-lg">+</span>
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="ml-4 text-gray-400 hover:text-gray-500"
        aria-label="Remove item"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
          />
        </svg>
      </button>
    </div>
  );
}