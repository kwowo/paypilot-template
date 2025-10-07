import Link from "next/link";
import { api, HydrateClient } from "@/trpc/server";

export const dynamic = 'force-dynamic';

export default async function ShopPage() {
  void api.product.getAll.prefetch({});

  return (
    <HydrateClient>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">All T-Shirts</h1>
            <p className="text-gray-600">
              Browse our complete collection of premium t-shirts
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex space-x-4">
              <Link 
                href="/shop" 
                className="px-4 py-2 bg-gray-900 text-white rounded-lg"
              >
                All
              </Link>
              <Link 
                href="/shop/men" 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Men
              </Link>
              <Link 
                href="/shop/women" 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Women
              </Link>
              <Link 
                href="/shop/kids" 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Kids
              </Link>
            </div>
          </div>

          {/* Products Grid */}
          <ProductGrid />
        </div>
      </div>
    </HydrateClient>
  );
}

function ProductGrid() {
  // Mock products for now
  const products = [
    {
      id: "1",
      name: "Classic Black T-Shirt",
      slug: "classic-black-tshirt",
      price: 29.99,
      category: "Men",
    },
    {
      id: "2", 
      name: "White Cotton Tee",
      slug: "white-cotton-tee",
      price: 24.99,
      category: "Women",
    },
    {
      id: "3",
      name: "Vintage Band Tee",
      slug: "vintage-band-tee",
      price: 34.99,
      category: "Men",
    },
    {
      id: "4",
      name: "Kids Rainbow Tee",
      slug: "kids-rainbow-tee",
      price: 19.99,
      category: "Kids",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden group-hover:shadow-lg transition-shadow">
        <div className="aspect-square bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">Product Image</span>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <span className="text-sm text-gray-500">{product.category}</span>
          </div>
          <p className="text-gray-700 font-bold">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}