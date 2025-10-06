import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/app/_components/add-to-cart-button";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  try {
    const product = await api.product.getBySlug({ slug });
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            {product.image ? (
              <div className="space-y-4">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full rounded-lg"
                />
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.filter((img: any) => img && img.trim() !== '').map((image: string, index: number) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full aspect-square object-cover rounded cursor-pointer hover:opacity-75"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <nav className="text-sm text-gray-500 mb-2">
                <Link href="/shop" className="hover:text-gray-700">Shop</Link>
                {" > "}
                <Link href={`/category/${product.category.slug}`} className="hover:text-gray-700">
                  {product.category.name}
                </Link>
                {" > "}
                <span>{product.name}</span>
              </nav>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-bold text-blue-600">${product.price.toFixed(2)}</p>
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Available Sizes & Colors</h3>
                  <div className="space-y-2">
                    {/* Group variants by size */}
                    {Object.entries(
                      product.variants.reduce((acc: any, variant: any) => {
                        if (!acc[variant.size]) acc[variant.size] = [];
                        acc[variant.size].push(variant);
                        return acc;
                      }, {})
                    ).map(([size, variants]: [string, any]) => (
                      <div key={size} className="flex items-center space-x-2">
                        <span className="font-medium w-8">{size}:</span>
                        <div className="flex space-x-2">
                          {(variants as any[]).map((variant: any) => (
                            <div
                              key={variant.id}
                              className="px-3 py-1 border rounded text-sm"
                              title={`${variant.color} - ${variant.stock} in stock`}
                            >
                              {variant.color} ({variant.stock})
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <AddToCartButton product={product} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}