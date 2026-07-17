"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabase } from "@/lib/server-supabase";
import { CACHE_TAGS } from "@/lib/cache-tags";

export interface ProductFormData {
  name: string;
  category: string;
  price: number;
  original_price?: number | null;
  is_new?: boolean;
  is_active?: boolean;
  design_description?: string;
  images: string[];
  sizes: string[];
  colors: string[]; // hex strings, converted to JSONB internally
}

export async function createProduct(data: ProductFormData) {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("No autorizado");

  const slug = data.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .substring(0, 200);

  const { error } = await supabase.from("products").insert({
    name: data.name,
    slug,
    category: data.category,
    price: data.price,
    original_price: data.original_price || null,
    is_new: data.is_new || false,
    is_active: data.is_active ?? true,
    images: data.images,
    sizes: data.sizes,
    colors: data.colors.map((h) => ({ hex: h, name: h })),
    design_description: data.design_description || "",
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidateTag(CACHE_TAGS.products, {});
  revalidateTag(CACHE_TAGS.adminDashboard, {});
  return { success: true };
}

export async function updateProduct(id: string, data: ProductFormData) {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("No autorizado");

  const { error } = await supabase
    .from("products")
    .update({
      name: data.name,
      category: data.category,
      price: data.price,
      original_price: data.original_price || null,
      is_new: data.is_new || false,
      is_active: data.is_active ?? true,
      images: data.images,
      sizes: data.sizes,
      colors: data.colors.map((h) => ({ hex: h, name: h })),
      design_description: data.design_description || "",
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  const slug = data.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .substring(0, 200);
  revalidatePath("/admin/productos");
  revalidatePath(`/producto/${slug}`);
  revalidatePath("/");
  revalidateTag(CACHE_TAGS.products, {});
  revalidateTag(CACHE_TAGS.product(slug), {});
  revalidateTag(CACHE_TAGS.adminDashboard, {});
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("No autorizado");

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidateTag(CACHE_TAGS.products, {});
  revalidateTag(CACHE_TAGS.adminDashboard, {});
  return { success: true };
}

export async function toggleProductActive(id: string, currentActive: boolean) {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("No autorizado");

  const { error } = await supabase
    .from("products")
    .update({ is_active: !currentActive })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/productos");
  revalidatePath("/");
  revalidateTag(CACHE_TAGS.products, {});
  revalidateTag(CACHE_TAGS.adminDashboard, {});
  return { success: true };
}
