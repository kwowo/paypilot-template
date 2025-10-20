import { notFound } from "next/navigation";
import { api, HydrateClient } from "@/trpc/server";
import { ProductGrid } from "@/components/products/product-grid";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  void api.product.getByCategory.prefetch({ category: slug });

  return (
    <HydrateClient>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold capitalize text-gray-900">
              {slug.replace(/-/g, " ")} T-Shirts
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Browse our {slug.replace(/-/g, " ")} collection
            </p>
          </div>
          <CategoryProducts category={slug} />
        </div>
      </div>
    </HydrateClient>
  );
}

async function CategoryProducts({ category }: { category: string }) {
  try {
    const products = await api.product.getByCategory({ category });
    return <ProductGrid products={products} />;
  } catch {
    notFound();
  }
}
