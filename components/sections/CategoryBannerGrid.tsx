import Link from "next/link";
import type { Category } from "@/types/category";

const CATEGORY_BANNERS: (Category & { color: string })[] = [
  {
    slug: "camping",
    name: "Camping",
    imageQuery: "camping tent night stars",
    color: "#2D4A32",
  },
  {
    slug: "senderismo",
    name: "Senderismo",
    imageQuery: "hiking mountain trail",
    color: "#1B2A36",
  },
  {
    slug: "escalada",
    name: "Escalada",
    imageQuery: "rock climbing wall",
    color: "#C4622A",
  },
  {
    slug: "trail",
    name: "Trail",
    imageQuery: "trail running forest",
    color: "#4A6741",
  },
  {
    slug: "naturaleza",
    name: "Naturaleza",
    imageQuery: "nature landscape honduras",
    color: "#3D5A3C",
  },
  {
    slug: "fauna",
    name: "Fauna",
    imageQuery: "wildlife honduras animals",
    color: "#5C4033",
  },
];

export function CategoryBannerGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
        {CATEGORY_BANNERS.map((cat) => (
          <Link
            key={cat.slug}
            href={`/#catalogo`}
            className="group relative aspect-3/2 overflow-hidden rounded-lg flex items-end"
            style={{ backgroundColor: cat.color }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
            <div className="relative p-4 sm:p-6">
              <h3 className="font-heading text-lg font-bold text-white sm:text-xl">
                {cat.name}
              </h3>
              <span className="mt-1 inline-block text-xs text-white/80 group-hover:underline">
                Ver productos →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
