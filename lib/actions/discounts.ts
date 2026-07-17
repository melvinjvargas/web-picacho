"use server";

import { revalidateTag } from "next/cache";
import { createServerSupabase } from "@/lib/server-supabase";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { Database } from "@/lib/database";

type DiscountInsert = Database["public"]["Tables"]["discounts"]["Insert"];
type DiscountUpdate = Database["public"]["Tables"]["discounts"]["Update"];

export async function createDiscount(
  code: string,
  percentage?: string,
  fixedAmount?: string,
  validUntil?: string,
) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  const insert: DiscountInsert = {
    code: code.trim().toUpperCase(),
    is_active: true,
    usage_count: 0,
    percentage: 0,
  };

  if (percentage) insert.percentage = Number(percentage);
  else if (fixedAmount) {
    insert.fixed_amount = Number(fixedAmount);
  }
  if (validUntil) insert.valid_until = validUntil;

  const { error } = await supabase.from("discounts").insert(insert);
  if (error) return { success: false, error: error.message };

  revalidateTag(CACHE_TAGS.adminDiscounts, {});
  return { success: true };
}

export async function updateDiscount(
  id: string,
  code: string,
  value: string,
  type: "percentage" | "fixed",
) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  const updates: DiscountUpdate = { code: code.trim().toUpperCase() };
  if (type === "percentage") {
    updates.percentage = Number(value) || 0;
    updates.fixed_amount = null;
  } else {
    updates.fixed_amount = Number(value) || 0;
  }

  const { error } = await supabase.from("discounts").update(updates).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidateTag(CACHE_TAGS.adminDiscounts, {});
  return { success: true };
}

export async function deleteDiscount(id: string) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  const { error } = await supabase.from("discounts").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidateTag(CACHE_TAGS.adminDiscounts, {});
  return { success: true };
}

export async function toggleDiscountActive(id: string, currentActive: boolean) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "No autorizado" };

  const { error } = await supabase
    .from("discounts")
    .update({ is_active: !currentActive })
    .eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidateTag(CACHE_TAGS.adminDiscounts, {});
  return { success: true };
}
