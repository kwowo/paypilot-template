import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  try {
    const category = await api.category.getBySlug({ slug });
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <nav className="text-sm text-gray-500 mb-2">
            <Link href="/shop" className="hover:text-gray-700">Shop</Link>
            {" > "}
            <span>{category.name}</span>
          </nav>
          <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600">{category.description}</p>
          )}
        </div>

        {category.products && category.products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.products.map((product: any) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="block group"
              >
                <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <span className="text-xl font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category.</p>
            <Link
              href="/shop"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    );
  } catch (error) {
    notFound();
  }
}