"use client";

import { useState } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { PromoMarquee } from "@/components/ui/PromoMarquee";
import { ProductSection } from "@/components/sections/FeaturedSection";
import { CatalogSection } from "@/components/sections/CatalogSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { QuickAddModal } from "@/components/product-detail/QuickAddModal";
import type { Product } from "@/types/product";

interface HomeClientProps {
  products: Product[];
}

export function HomeClient({ products }: HomeClientProps) {
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);

  const newProducts = products.filter((p) => p.isNew);
  const bestSellers = products.filter((p) => !p.isNew).slice(0, 4);

  return (
    <>
      <HeroSection />
      <PromoMarquee />
      <ProductSection
        title="Novedades"
        subtitle="Los últimos diseños de la montaña"
        products={newProducts}
        onQuickAdd={setQuickAddProduct}
      />
      <ProductSection
        title="Más vendidos"
        subtitle="Los favoritos de la comunidad"
        products={bestSellers}
        onQuickAdd={setQuickAddProduct}
      />
      <CatalogSection
        products={products}
        onQuickAdd={setQuickAddProduct}
      />
      <AboutSection />

      {quickAddProduct && (
        <QuickAddModal
          product={quickAddProduct}
          onClose={() => setQuickAddProduct(null)}
        />
      )}
    </>
  );
}
