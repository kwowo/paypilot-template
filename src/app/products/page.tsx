import { api, HydrateClient } from "@/trpc/server";

export default async function ProductsPage() {
  // Prefetch products and categories
  void api.product.getAll.prefetch({ limit: 20 });
  void api.category.getAll.prefetch();

  return (
    <HydrateClient>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            All Products
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Discover our complete collection of premium t-shirts
          </p>
        </div>

        {/* Product Grid */}
        <ProductGrid />
      </div>
    </HydrateClient>
  );
}

function ProductGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* Loading skeleton - will be replaced by actual products via client component */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="group relative">
          <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200">
            <div className="h-full w-full animate-pulse bg-gray-300" />
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-300" />
          </div>
        </div>
      ))}
    </div>
  );
}