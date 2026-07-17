"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabase } from "@/lib/server-supabase";
import { CACHE_TAGS } from "@/lib/cache-tags";

type OrderItemInput = {
  product_id: string;
  name: string;
  size: string | null;
  color: string | null;
  quantity: number;
  price: number;
};

export async function createOrder(
  customerName: string,
  customerPhone: string,
  items: OrderItemInput[],
  total: number,
) {
  const supabase = await createServerSupabase();
  // Orders are created by customers (unauthenticated), so NO auth check
  const { error } = await supabase.from("orders").insert({
    customer_name: customerName,
    customer_phone: customerPhone,
    items,
    total,
    status: "pendiente",
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/pedidos");
  revalidateTag(CACHE_TAGS.adminDashboard, {});
  revalidateTag(CACHE_TAGS.adminPedidos, {});
  return { success: true };
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const supabase = await createServerSupabase();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) throw new Error("No autorizado");

  const validStatuses = ["pendiente", "en_proceso", "completado", "devolucion"];
  if (!validStatuses.includes(newStatus)) {
    return { success: false, error: "Estado inválido" };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/pedidos");
  revalidateTag(CACHE_TAGS.adminDashboard, {});
  revalidateTag(CACHE_TAGS.adminPedidos, {});
  return { success: true };
}
