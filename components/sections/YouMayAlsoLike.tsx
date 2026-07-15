"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/cards/ProductCard";
import { getAllProducts } from "@/services/productService";
import type { Product } from "@/types/product";

export function YouMayAlsoLike() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    getAllProducts().then((p) => setItems(p.slice(0, 8)));
  }, []);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = dir === "left" ? -320 : 320;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  }

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14 lg:px-6 lg:py-16">
      <h2 className="font-heading text-2xl font-bold text-text-primary sm:text-3xl">
        También te gustará...
      </h2>

      <div className="relative mt-6">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border bg-white p-2 shadow-sm transition hover:border-text-primary sm:flex sm:items-center sm:justify-center"
          aria-label="Desplazar izquierda"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-1 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {items.map((product) => (
            <div
              key={product.id}
              className="w-[164px] shrink-0 sm:w-[330px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border bg-white p-2 shadow-sm transition hover:border-text-primary sm:flex sm:items-center sm:justify-center"
          aria-label="Desplazar derecha"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
