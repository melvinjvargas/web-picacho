import { PriceTag } from "@/components/ui/PriceTag";
import type { Product } from "@/types/product";

interface ProductInfoProps {
  product: Product;
  discountAmount?: number;
}

export function ProductInfo({ product, discountAmount }: ProductInfoProps) {
  const finalPrice = discountAmount
    ? product.price - discountAmount
    : undefined;

  return (
    <div className="flex flex-col gap-3">
      {/* Breadcrumb */}
      <p className="text-xs text-text-secondary break-words line-clamp-2">
        Inicio &gt; {product.category.charAt(0).toUpperCase() + product.category.slice(1)} &gt; {product.name}
      </p>

      {/* Category badge */}
      <span className="text-xs font-semibold tracking-[0.15em] uppercase text-brand-green">
        {product.category}
      </span>

      {/* Name */}
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-text-primary break-words">
        {product.name}
      </h1>

      {/* Design description */}
      <p className="text-sm text-text-secondary leading-relaxed">
        {product.design_description}
      </p>

      {/* Price */}
      <PriceTag
        price={product.price}
        discountedPrice={finalPrice}
        className="text-2xl"
      />

    </div>
  );
}
