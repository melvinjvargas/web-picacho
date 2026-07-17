"use server";

import { revalidateTag } from "next/cache";
import { createServerSupabase } from "@/lib/server-supabase";
import { CACHE_TAGS } from "@/lib/cache-tags";

export async function createCategory(name: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
  const { error } = await supabase.from("categories").insert({ name: name.trim(), slug });
  if (error) return { success: false, error: error.message };

  revalidateTag(CACHE_TAGS.adminCategories, {});
  return { success: true };
}

export async function updateCategory(id: string, name: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
  const { error } = await supabase
    .from("categories")
    .update({ name: name.trim(), slug })
    .eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidateTag(CACHE_TAGS.adminCategories, {});
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  // Guard: skip deletion if products exist in this category
  const { data: cat } = await supabase.from("categories").select("name").eq("id", id).single();
  if (cat?.name) {
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category", cat.name);
    if (count && count > 0) {
      return { success: false, error: `Categoría en uso por ${count} producto(s)` };
    }
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidateTag(CACHE_TAGS.adminCategories, {});
  return { success: true };
}
