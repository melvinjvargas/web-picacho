"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { useProductSelection } from "@/hooks/useProductSelection";
import { useDiscount } from "@/hooks/useDiscount";
import { useCart } from "@/context/CartContext";
import { ProductDetailLayout } from "./_components/ProductDetailLayout";
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
    <ProductDetailLayout
      product={product}
      staticContent={staticContent}
      selectedSize={selectedSize}
      selectedColor={selectedColor}
      quantity={quantity}
      addError={addError}
      discountAmount={discount.discountAmount}
      discountMessage={discount.message}
      discountIsApplied={discount.isApplied}
      onSelectSize={setSelectedSize}
      onSelectColor={setSelectedColor}
      onSetQuantity={setQuantity}
      onApplyDiscount={discount.applyDiscount}
      onAddToCart={handleAddToCart}
    />
  );
}
