import { api, HydrateClient } from "@/trpc/server";
import { ProductGrid } from "@/components/products/product-grid";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  void api.product.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900">All Products</h1>
            <p className="mt-2 text-lg text-gray-600">
              Browse our complete collection of premium t-shirts
            </p>
          </div>
          <AllProducts />
        </div>
      </div>
    </HydrateClient>
  );
}

async function AllProducts() {
  const products = await api.product.getAll();
  return <ProductGrid products={products} />;
}
