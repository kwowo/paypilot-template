"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { api } from "@/trpc/react";

export default function ProductDetailPage() {
  const resolvedParams = useParams();
  const slug = resolvedParams.slug as string;
  
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  const { data: session } = useSession();
  const { data: product, isLoading, error } = api.product.getBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  const addToCart = api.cart.addItem.useMutation({
    onSuccess: () => {
      alert("Added to cart!");
    },
    onError: (error) => {
      alert(error.message);
    },
  });

  // Handle loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error || !product) {
    notFound();
  }

  const availableSizes = Array.from(new Set(product.variants.map(v => v.size)));
  const availableColors = Array.from(new Set(product.variants.map(v => v.color)));
  
  // Get available colors for selected size
  const colorsForSize = selectedSize 
    ? Array.from(new Set(product.variants.filter(v => v.size === selectedSize).map(v => v.color)))
    : availableColors;
    
  // Get available sizes for selected color  
  const sizesForColor = selectedColor
    ? Array.from(new Set(product.variants.filter(v => v.color === selectedColor).map(v => v.size)))
    : availableSizes;

  // Find the selected variant
  const selectedVariant = product.variants.find(
    v => v.size === selectedSize && v.color === selectedColor
  );

  const handleAddToCart = () => {
    if (!session) {
      alert("Please sign in to add items to your cart");
      return;
    }

    if (!selectedSize || !selectedColor) {
      alert("Please select both size and color");
      return;
    }

    if (!selectedVariant) {
      alert("Selected variant not available");
      return;
    }

    addToCart.mutate({
      productId: product.id,
      variantId: selectedVariant.id,
      quantity,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 text-lg">T-Shirt Image</span>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-700">
              {product.description}
            </p>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
            <div className="grid grid-cols-6 gap-2">
              {availableSizes.map((size) => {
                const isDisabled = selectedColor && !sizesForColor.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={!!isDisabled}
                    className={`
                      p-3 border rounded-md font-medium text-center
                      ${selectedSize === size
                        ? "border-gray-900 bg-gray-900 text-white"
                        : isDisabled
                        ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 hover:border-gray-500"
                      }
                    `}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Color</h3>
            <div className="flex flex-wrap gap-2">
              {availableColors.map((color) => {
                const isDisabled = selectedSize && !colorsForSize.includes(color);
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    disabled={!!isDisabled}
                    className={`
                      px-4 py-2 border rounded-md font-medium
                      ${selectedColor === color
                        ? "border-gray-900 bg-gray-900 text-white"
                        : isDisabled
                        ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "border-gray-300 hover:border-gray-500"
                      }
                    `}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Info */}
          {selectedVariant && (
            <div className="text-sm text-gray-600">
              {selectedVariant.stock > 0 ? (
                <span className="text-green-600">
                  ✓ In stock ({selectedVariant.stock} available)
                </span>
              ) : (
                <span className="text-red-600">Out of stock</span>
              )}
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={
              !selectedSize || 
              !selectedColor || 
              !selectedVariant || 
              selectedVariant.stock === 0 ||
              addToCart.isPending
            }
            className="w-full bg-gray-900 text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {addToCart.isPending ? "Adding..." : "Add to Cart"}
          </button>

          {/* Product Details */}
          <div className="border-t pt-6 space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900">Category</h4>
              <p className="text-gray-600">{product.category.name}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Available Variants</h4>
              <p className="text-gray-600">
                {product.variants.length} size/color combinations
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}