"use client";

import { useState } from "react";
import type { ProductColor, SizeLabel } from "@/types/product";

export function useProductSelection() {
  const [selectedSize, setSelectedSize] = useState<SizeLabel | null>(null);
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);

  return {
    selectedSize,
    setSelectedSize,
    selectedColor,
    setSelectedColor,
  };
}
