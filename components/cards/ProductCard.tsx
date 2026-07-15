import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { PriceTag } from "@/components/ui/PriceTag";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onQuickAdd?: (product: Product) => void;
}

export function ProductCard({ product, onQuickAdd }: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-[#FDFDFD]">
      <Link href={`/producto/${product.slug}`} className="block">
        <div className="relative">
          <ProductImage
            src={product.images[0] ?? "/placeholder.jpg"}
            alt={product.name}
            aspectRatio="aspect-[3/4]"
          />
          {product.isNew && (
            <span className="absolute top-2 left-2 rounded bg-brand-green px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
              New
            </span>
          )}
          {product.originalPrice && (
            <span className="absolute top-2 right-2 rounded bg-[#f92b89] px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
          {/* Hover overlay with add-to-cart */}
          {onQuickAdd && (
            <div className="absolute inset-0 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickAdd(product);
                }}
                className="absolute bottom-[15%] left-3 right-3 rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-900 transition-colors"
              >
                Añadir a la cesta
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1 px-3 py-2.5">
          <h3 className="font-heading text-base font-semibold text-text-primary leading-snug group-hover:text-brand-green transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <PriceTag price={product.price} className="text-base font-bold" />
            {product.originalPrice && (
              <span className="text-xs text-text-muted line-through">
                L. {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

    </div>
  );
}
