import { getProductBySlugServer } from "@/lib/data/products-server";
import { getProductStaticContent } from "@/lib/content";
import { notFound } from "next/navigation";
import { ProductPageClient } from "./ProductPageClient";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductBySlugServer(id);

  if (!product) notFound();

  const staticContent = getProductStaticContent();

  return <ProductPageClient product={product} staticContent={staticContent} />;
}
