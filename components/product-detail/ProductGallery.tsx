"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/components/ui/ProductImage";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const displayImages = images.slice(0, 5);

  if (displayImages.length === 0) {
    return (
      <ProductImage
        src="/placeholder.jpg"
        alt={productName}
        aspectRatio="aspect-square"
      />
    );
  }

  return (
    <div className="grid grid-cols-[auto_1fr] gap-2 sm:gap-3">
      {/* Thumbnails column */}
      {displayImages.length > 1 && (
        <div className="flex w-10 min-h-0 flex-col gap-2 overflow-y-auto sm:w-16">
          {displayImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`relative aspect-square shrink-0 overflow-hidden rounded-lg border transition-colors ${
                i === activeIndex
                  ? "border-accent-orange"
                  : "border-border hover:border-accent-orange"
              }`}
            >
              <Image
                src={img}
                alt={`${productName} miniatura ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="mx-auto w-full max-w-2xl">
        <ProductImage
          src={displayImages[activeIndex] ?? "/placeholder.jpg"}
          alt={`${productName} - imagen ${activeIndex + 1}`}
          aspectRatio="aspect-square"
          className="rounded-xl"
        />
      </div>
    </div>
  );
}
