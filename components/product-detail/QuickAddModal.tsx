"use client";

import { useState } from "react";
import Link from "next/link";
import type { Product, ProductColor, SizeLabel } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface QuickAddModalProps {
  product: Product;
  onClose: () => void;
}

export function QuickAddModal({ product, onClose }: QuickAddModalProps) {
  const [selectedSize, setSelectedSize] = useState<SizeLabel | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors[0] ?? { hex: "#111", name: "Único" },
  );
  const [quantity, setQuantity] = useState(1);
  const { addItem, openDrawer } = useCart();
  const [addError, setAddError] = useState("");

  function handleAddToCart() {
    if (!selectedSize) {
      setAddError("Seleccioná una talla.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-2xl rounded-xl bg-white shadow-2xl flex flex-col sm:flex-row overflow-hidden max-h-[90vh]">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 hover:bg-white transition-colors"
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="sm:w-1/2 aspect-square bg-bg-secondary flex items-center justify-center">
          <span className="text-sm text-text-muted">[{product.name}]</span>
        </div>

        {/* Info + options */}
        <div className="flex flex-col gap-4 p-5 sm:w-1/2 overflow-y-auto">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
              {product.category}
            </p>
            <h2 className="font-heading text-xl font-bold text-text-primary mt-1">
              {product.name}
            </h2>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-text-muted line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Color */}
          <div>
            <p className="text-xs font-medium uppercase text-text-secondary mb-2">
              Color: <span className="text-text-primary normal-case">{selectedColor.name}</span>
            </p>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${
                    selectedColor.hex === color.hex
                      ? "border-text-primary scale-110"
                      : "border-border hover:border-text-secondary"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <p className="text-xs font-medium uppercase text-text-secondary mb-2">
              Talla
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`flex h-9 w-9 items-center justify-center rounded text-xs font-medium transition-colors ${
                    selectedSize === size
                      ? "bg-text-primary text-white"
                      : "border border-border text-text-primary hover:border-text-primary"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-8 w-8 items-center justify-center rounded border border-border hover:border-text-primary transition-colors"
            >
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 12h14" />
              </svg>
            </button>
            <span className="w-6 text-center text-sm font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-8 w-8 items-center justify-center rounded border border-border hover:border-text-primary transition-colors"
            >
              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>

          {/* Add to cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 rounded-md bg-black py-3 text-sm font-semibold text-white hover:bg-neutral-900 transition-colors mt-1"
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            Añadir a la cesta
          </button>
          {addError && (
            <p className="text-xs text-danger text-center">{addError}</p>
          )}

          {/* Link to full detail */}
          <Link
            href={`/producto/${product.slug}`}
            onClick={() => onClose()}
            className="text-center text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            Ver ficha completa →
          </Link>
        </div>
      </div>
    </div>
  );
}
