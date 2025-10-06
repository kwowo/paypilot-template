import { api } from "@/trpc/server";
import Link from "next/link";
import Image from "next/image";

export default async function ShopPage() {
  const products = await api.product.getAll({ limit: 20 });
  const categories = await api.category.getAll();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Shop T-Shirts</h1>
        <p className="text-gray-600">Discover our collection of premium t-shirts</p>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category: any) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                {category.image && (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={200}
                    height={150}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                )}
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.products.map((product: any) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="block group"
            >
              <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.category.name}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}