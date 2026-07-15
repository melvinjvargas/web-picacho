import type { Product } from "@/types/product";
import { ProductCard } from "@/components/cards/ProductCard";

interface ProductGridProps {
  products: Product[];
  onQuickAdd?: (product: Product) => void;
}

export function ProductGrid({ products, onQuickAdd }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickAdd={onQuickAdd}
        />
      ))}
    </div>
  );
}
