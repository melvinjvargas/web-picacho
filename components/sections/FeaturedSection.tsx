import { ProductGrid } from "@/components/data-display/ProductGrid";
import type { Product } from "@/types/product";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onQuickAdd?: (product: Product) => void;
}

export function ProductSection({
  title,
  subtitle,
  products,
  onQuickAdd,
}: ProductSectionProps) {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-6 lg:py-16">
      <div className="mb-6 lg:mb-8">
        <h2 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>
        )}
      </div>
      <ProductGrid products={products} onQuickAdd={onQuickAdd} />
    </section>
  );
}
