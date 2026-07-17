"use client";

import { useState } from "react";
import type { Product, ProductColor, SizeLabel } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { QuickAddFormFields } from "./_components/QuickAddFormFields";

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
          <span className="text-sm text-text-muted break-words">[{product.name}]</span>
        </div>

        {/* Info + options */}
        <QuickAddFormFields
          product={product}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          quantity={quantity}
          addError={addError}
          onSelectSize={setSelectedSize}
          onSelectColor={setSelectedColor}
          onSetQuantity={setQuantity}
          onAddToCart={handleAddToCart}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
