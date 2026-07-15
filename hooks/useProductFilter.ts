"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/types/product";

export function useProductFilter(products: Product[]) {
  const [activeCategory, setActiveCategory] = useState("todas");

  const filteredProducts = useMemo(
    () =>
      activeCategory === "todas"
        ? products
        : products.filter((p) => p.category === activeCategory),
    [activeCategory, products],
  );

  return { activeCategory, setActiveCategory, filteredProducts };
}
