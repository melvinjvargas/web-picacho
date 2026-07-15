"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
}

export function ProductImage({
  src,
  alt,
  aspectRatio = "aspect-[4/5]",
  className,
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[#FAFAFA]",
        aspectRatio,
        className,
      )}
    >
      {/* Placeholder */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-text-muted">Cargando...</span>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        onLoad={() => setLoaded(true)}
        className={cn(
          "object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
