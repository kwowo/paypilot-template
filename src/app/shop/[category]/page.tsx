import Link from "next/link";
import { notFound } from "next/navigation";
import { api, HydrateClient } from "@/trpc/server";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;

  // Validate category
  const validCategories = ["men", "women", "kids"];
  if (!validCategories.includes(category)) {
    notFound();
  }

  void api.product.getAll.prefetch({ category });

  return (
    <HydrateClient>
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 capitalize">
              {category}&apos;s T-Shirts
            </h1>
            <p className="text-gray-600">
              Discover our {category}&apos;s collection
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex space-x-4">
              <Link 
                href="/shop" 
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                All
              </Link>
              <Link 
                href="/shop/men" 
                className={`px-4 py-2 rounded-lg ${
                  category === "men" 
                    ? "bg-gray-900 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Men
              </Link>
              <Link 
                href="/shop/women" 
                className={`px-4 py-2 rounded-lg ${
                  category === "women" 
                    ? "bg-gray-900 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Women
              </Link>
              <Link 
                href="/shop/kids" 
                className={`px-4 py-2 rounded-lg ${
                  category === "kids" 
                    ? "bg-gray-900 text-white" 
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Kids
              </Link>
            </div>
          </div>

          {/* Products Grid */}
          <CategoryProducts category={category} />
        </div>
      </div>
    </HydrateClient>
  );
}

function CategoryProducts({ category }: { category: string }) {
  // Mock filtered products
  const allProducts = [
    {
      id: "1",
      name: "Classic Black T-Shirt",
      slug: "classic-black-tshirt",
      price: 29.99,
      category: "men",
    },
    {
      id: "2", 
      name: "White Cotton Tee",
      slug: "white-cotton-tee",
      price: 24.99,
      category: "women",
    },
    {
      id: "3",
      name: "Vintage Band Tee",
      slug: "vintage-band-tee",
      price: 34.99,
      category: "men",
    },
    {
      id: "4",
      name: "Kids Rainbow Tee",
      slug: "kids-rainbow-tee",
      price: 19.99,
      category: "kids",
    },
    {
      id: "5",
      name: "Gray Casual Tee",
      slug: "gray-casual-tee",
      price: 27.99,
      category: "men",
    },
    {
      id: "6",
      name: "Pink Floral Tee",
      slug: "pink-floral-tee",
      price: 26.99,
      category: "women",
    },
  ];

  const products = allProducts.filter(p => p.category === category);

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found in this category.</p>
      </div>
    );
  }

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
          <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
          <p className="text-gray-700 font-bold">${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}