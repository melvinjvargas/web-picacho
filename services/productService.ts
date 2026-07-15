import { products as staticProducts } from "@/data/products";
import type { Product, ProductColor, SizeLabel } from "@/types/product";

function parseDbRow(row: Record<string, unknown>): Product {
  const sizes = (Array.isArray(row.sizes) ? (row.sizes as string[]) : []) as SizeLabel[];
  const images = Array.isArray(row.images) ? (row.images as string[]) : [];
  const colorsRaw = Array.isArray(row.colors) ? row.colors : [];

  let colors: ProductColor[] = [];
  try {
    colors = colorsRaw.map((c) => {
      if (typeof c === "string") {
        const parsed = JSON.parse(c);
        return { hex: parsed.hex || "#111111", name: parsed.name || parsed.hex || "Color" };
      }
      if (typeof c === "object" && c !== null) {
        const obj = c as Record<string, unknown>;
        return { hex: String(obj.hex || "#111111"), name: String(obj.name || obj.hex || "Color") };
      }
      return { hex: "#111111", name: "Color" };
    });
  } catch {
    colors = [];
  }

  return {
    id: String(row.id || ""),
    name: String(row.name || ""),
    slug: String(row.slug || ""),
    category: String(row.category || ""),
    price: Number(row.price || 0),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    isNew: Boolean(row.is_new),
    design_description: String(row.design_description || ""),
    images,
    sizes,
    colors,
  };
}

async function fetchFromSupabase(): Promise<Product[]> {
  try {
    const { createBrowserSupabase } = await import("@/lib/supabase");
    const supabase = createBrowserSupabase();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data.map(parseDbRow);
  } catch {
    return [];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const db = await fetchFromSupabase();
  return db.length > 0 ? db : staticProducts;
}
