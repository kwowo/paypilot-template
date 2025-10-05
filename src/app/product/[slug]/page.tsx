import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import { AddToCartForm } from "@/app/_components/add-to-cart-form";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  try {
    const product = await api.product.getBySlug({ slug });

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-8xl">👕</span>
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="grid grid-cols-3 gap-2">
                  {product.images.slice(0, 3).map((image: string, index: number) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                      <span className="text-2xl">👕</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <p className="text-sm text-gray-500 mt-1">{product.category.name}</p>
                </div>

                <div className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                {/* Product Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">Available Sizes:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.sizes.map((size: string) => (
                        <span key={size} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900">Available Colors:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {product.colors.map((color: string) => (
                        <span key={color} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Form */}
                <AddToCartForm product={product} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}