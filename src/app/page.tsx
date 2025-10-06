import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { api, HydrateClient } from "@/trpc/server";
import { SignOutButton } from "@/app/_components/sign-out-button";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });
  
  const featuredProducts = await api.product.getFeatured({ limit: 8 });
  const categories = await api.category.getAll();

  return (
    <HydrateClient>
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4">Premium T-Shirts</h1>
              <p className="text-xl mb-8">Comfortable, Stylish, and Quality Guaranteed</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/shop"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Shop Now
                </Link>
                <Link
                  href="/about"
                  className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category: any) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={400}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group block"
                >
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
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
            <div className="text-center mt-8">
              <Link
                href="/shop"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* User Account Section */}
        <section className="py-8 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            {session?.user ? (
              <div className="flex flex-col items-center gap-4">
                <p className="text-lg">Welcome back, {session.user.name}!</p>
                <div className="flex gap-4">
                  <Link
                    href="/orders"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    My Orders
                  </Link>
                  <SignOutButton />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <p className="text-lg">Join our community for exclusive offers!</p>
                <Link
                  href="/sign-in"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
