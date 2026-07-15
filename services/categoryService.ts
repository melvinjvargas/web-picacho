import { categories as allCategories } from "@/data/categories";
import type { Category } from "@/types/category";

export function getAllCategories(): Category[] {
  return allCategories;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return allCategories.find((c) => c.slug === slug);
}
