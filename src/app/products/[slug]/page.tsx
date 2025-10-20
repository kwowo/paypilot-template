import { notFound } from "next/navigation";
import { api } from "@/trpc/server";
import { ProductDetailClient } from "./product-detail-client";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  try {
    const product = await api.product.getBySlug({ slug });
    return <ProductDetailClient product={product} />;
  } catch {
    notFound();
  }
}
