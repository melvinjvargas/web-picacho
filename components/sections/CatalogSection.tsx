import { ProductGrid } from "@/components/data-display/ProductGrid";
import type { Product } from "@/types/product";

interface CatalogSectionProps {
  products: Product[];
  onQuickAdd?: (product: Product) => void;
}

export function CatalogSection({ products, onQuickAdd }: CatalogSectionProps) {
  return (
    <section
      id="catalogo"
      className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-6 lg:py-16"
    >
      <h2 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl mb-6 lg:mb-8">
        Explora nuestras camisetas
      </h2>

      <ProductGrid products={products} onQuickAdd={onQuickAdd} />
    </section>
  );
}
