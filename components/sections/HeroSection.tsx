"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { bestSellers } from "@/data/products";

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const slides = bestSellers.slice(0, 3);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];
  if (!slide) return null;

  return (
    <section className="bg-bg-secondary overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 lg:py-0">
        <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:min-h-130 gap-6 lg:gap-8">
          {/* Left: info */}
          <div className="flex flex-col gap-4 lg:w-5/12 lg:py-16">
            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-brand-green">
              {slide.isNew ? "Novedad" : "Más vendido"}
            </span>
            <h1 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl lg:text-5xl">
              {slide.name}
            </h1>
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-text-primary">
                {formatPrice(slide.price)}
              </span>
              {slide.originalPrice && (
                <span className="text-lg text-text-muted line-through">
                  {formatPrice(slide.originalPrice)}
                </span>
              )}
            </div>
            <Link
              href={`/producto/${slide.slug}`}
              className="inline-flex items-center justify-center rounded-md bg-text-primary px-6 py-3 text-sm font-medium text-white hover:bg-text-primary/90 transition-colors w-fit"
            >
              Ver producto
            </Link>
          </div>

          {/* Right: image */}
          <div className="lg:w-7/12">
            <Link href={`/producto/${slide.slug}`}>
              <div className="aspect-square lg:aspect-4/3 bg-bg-secondary rounded-none overflow-hidden flex items-center justify-center">
                <span className="text-sm text-text-muted">
                  [{slide.name}]
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 pb-6 lg:pb-8">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-6 bg-text-primary" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
