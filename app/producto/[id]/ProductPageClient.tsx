"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { useProductSelection } from "@/hooks/useProductSelection";
import { useDiscount } from "@/hooks/useDiscount";
import { useCart } from "@/context/CartContext";
import { ProductGallery } from "@/components/product-detail/ProductGallery";
import { ProductInfo } from "@/components/product-detail/ProductInfo";
import { OptionsCard } from "@/components/product-detail/OptionsCard";
import { SizeSelector } from "@/components/product-detail/SizeSelector";
import { ColorSelector } from "@/components/product-detail/ColorSelector";
import { DiscountApplier } from "@/components/product-detail/DiscountApplier";
import { SizeGuideAccordion } from "@/components/product-detail/SizeGuideAccordion";
import { ProductAccordions } from "@/components/product-detail/ProductAccordions";
import { YouMayAlsoLike } from "@/components/sections/YouMayAlsoLike";
import type { ProductStaticContent } from "@/lib/content";

interface ProductPageClientProps {
  product: Product;
  staticContent: ProductStaticContent;
}

export function ProductPageClient({ product, staticContent }: ProductPageClientProps) {
  const { selectedSize, setSelectedSize, selectedColor, setSelectedColor } =
    useProductSelection();
  const discount = useDiscount(product.price);
  const [quantity, setQuantity] = useState(1);
  const { addItem, openDrawer } = useCart();
  const [addError, setAddError] = useState("");

  function handleAddToCart() {
    if (!selectedSize) {
      setAddError("Seleccioná una talla.");
      return;
    }
    if (!selectedColor) {
      setAddError("Seleccioná un color.");
      return;
    }
    setAddError("");
    addItem({
      product,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    openDrawer();
  }

  return (
    <div className="bg-bg-primary">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 sm:py-12 lg:px-6 lg:py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          {/* Gallery */}
          <div className="lg:w-7/12">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />
          </div>

          {/* Info + Options */}
          <div className="flex flex-col gap-6 lg:w-5/12">
            <ProductInfo
              product={product}
              discountAmount={discount.isApplied ? discount.discountAmount : undefined}
            />

            {/* Separator */}
            <div className="border-t border-border" />

            {/* Options Card */}
            <OptionsCard>
              <SizeSelector
                sizes={product.sizes}
                selected={selectedSize}
                onSelect={setSelectedSize}
              />
              <SizeGuideAccordion />
              <ColorSelector
                colors={product.colors}
                selected={selectedColor}
                onSelect={setSelectedColor}
              />
              <DiscountApplier
                onApply={discount.applyDiscount}
                message={discount.message}
                isApplied={discount.isApplied}
              />
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-text-secondary">Cantidad:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded border border-border hover:border-text-primary transition-colors"
                  >
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                  <span className="w-5 text-center text-sm font-medium">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded border border-border hover:border-text-primary transition-colors"
                  >
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 rounded-md bg-black py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition-colors"
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                </svg>
                Añadir a la cesta
              </button>
              {addError && (
                <p className="text-xs text-danger text-center">{addError}</p>
              )}
            </OptionsCard>

            {/* Separator */}
            <div className="border-t border-border" />

            {/* Accordions */}
            <ProductAccordions
              description={staticContent.description}
              caracteristicas={staticContent.caracteristicas}
              cuidados={staticContent.cuidados}
            />
          </div>
        </div>
      </div>

      <YouMayAlsoLike />
    </div>
  );
}
