import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import { AddToCartForm } from "@/app/products/[category]/[slug]/add-to-cart-form";

interface ProductPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  try {
    const product = await api.product.getBySlug({ slug });

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                TeeShop
              </Link>
              <nav className="flex space-x-8">
                <Link href="/cart" className="text-gray-700 hover:text-gray-900">
                  Cart
                </Link>
                <Link href="/sign-in" className="text-gray-700 hover:text-gray-900">
                  Sign In
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <Link href="/products" className="text-gray-500 hover:text-gray-700">
                  Products
                </Link>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li>
                <Link 
                  href={`/products/${product.category.slug}`} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  {product.category.name}
                </Link>
              </li>
              <li>
                <span className="text-gray-500">/</span>
              </li>
              <li className="text-gray-900">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
                {product.images.length > 0 ? (
                  <div className="h-96 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500">Product Image</span>
                  </div>
                ) : (
                  <div className="h-96 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500">No Image Available</span>
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((_image: any, index: number) => (
                    <div key={index} className="aspect-w-1 aspect-h-1 overflow-hidden rounded-md bg-gray-200">
                      <div className="h-20 bg-gray-100 flex items-center justify-center">
                        <span className="text-xs text-gray-500">{index + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="mb-6">
                {product.salePrice ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-red-600">
                      ${product.salePrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                      Save ${(product.price - product.salePrice).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              {/* Product Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Details</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>Category: {product.category.name}</li>
                  <li>Available sizes: {product.sizes.join(", ")}</li>
                  <li>Available colors: {product.colors.join(", ")}</li>
                  <li>In stock: {product.inventory > 0 ? "Yes" : "No"}</li>
                </ul>
              </div>

              {/* Add to Cart Form */}
              <AddToCartForm product={product} />

              {/* Stock Status */}
              <div className="mt-6">
                {product.inventory > 0 ? (
                  <p className="text-sm text-green-600">
                    ✓ In stock ({product.inventory} available)
                  </p>
                ) : (
                  <p className="text-sm text-red-600">
                    ✗ Out of stock
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* This would normally show related products */}
              <div className="text-center py-8 text-gray-500">
                Related products coming soon...
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