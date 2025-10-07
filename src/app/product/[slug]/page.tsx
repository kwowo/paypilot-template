import { notFound } from "next/navigation";
import { api, HydrateClient } from "@/trpc/server";
import { AddToCartForm } from "./AddToCartForm";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  try {
    void api.product.getBySlug.prefetch({ slug });
  } catch {
    notFound();
  }

  return (
    <HydrateClient>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductDetails slug={slug} />
        </div>
      </div>
    </HydrateClient>
  );
}

function ProductDetails({ slug }: { slug: string }) {
  // Mock product data - will be replaced with real tRPC call
  const mockProducts = {
    "classic-black-tshirt": {
      id: "1",
      name: "Classic Black T-Shirt",
      slug: "classic-black-tshirt",
      description: "Premium cotton t-shirt in classic black. Perfect for everyday wear. Made from 100% organic cotton with a comfortable fit.",
      price: 29.99,
      images: ["/products/black-tshirt-1.jpg", "/products/black-tshirt-2.jpg"],
      category: { name: "Men", slug: "men" },
      variants: [
        { id: "1", size: "S", color: "Black", inventory: 10 },
        { id: "2", size: "M", color: "Black", inventory: 15 },
        { id: "3", size: "L", color: "Black", inventory: 12 },
        { id: "4", size: "XL", color: "Black", inventory: 8 },
      ],
    },
    "white-cotton-tee": {
      id: "2",
      name: "White Cotton Tee",
      slug: "white-cotton-tee",
      description: "Soft and comfortable white cotton t-shirt. A wardrobe essential that goes with everything.",
      price: 24.99,
      images: ["/products/white-tshirt-1.jpg", "/products/white-tshirt-2.jpg"],
      category: { name: "Women", slug: "women" },
      variants: [
        { id: "5", size: "XS", color: "White", inventory: 8 },
        { id: "6", size: "S", color: "White", inventory: 12 },
        { id: "7", size: "M", color: "White", inventory: 15 },
        { id: "8", size: "L", color: "White", inventory: 10 },
      ],
    },
    "kids-rainbow-tee": {
      id: "4",
      name: "Kids Rainbow Tee",
      slug: "kids-rainbow-tee",
      description: "Colorful rainbow design t-shirt perfect for kids. Made with soft, child-friendly materials.",
      price: 19.99,
      images: ["/products/kids-rainbow-1.jpg", "/products/kids-rainbow-2.jpg"],
      category: { name: "Kids", slug: "kids" },
      variants: [
        { id: "12", size: "XS", color: "Multi", inventory: 15 },
        { id: "13", size: "S", color: "Multi", inventory: 12 },
        { id: "14", size: "M", color: "Multi", inventory: 8 },
      ],
    },
  };

  const product = mockProducts[slug as keyof typeof mockProducts];

  if (!product) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500 text-lg">Main Product Image</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
              <span className="text-gray-400 text-xs">Thumb {i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>
          <p className="text-xl text-gray-700 font-semibold">
            ${product.price.toFixed(2)}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-gray-600">{product.description}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-2">Category</h3>
          <p className="text-gray-600">{product.category.name}</p>
        </div>

        {/* Add to Cart Form */}
        <AddToCartForm product={product} />

        {/* Product Features */}
        <div className="border-t pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Features</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• 100% Premium Cotton</li>
            <li>• Pre-shrunk for perfect fit</li>
            <li>• Machine washable</li>
            <li>• Comfortable and durable</li>
          </ul>
        </div>
      </div>
    </div>
  );
}