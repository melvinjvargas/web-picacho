"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import { deleteProduct as deleteProductAction, toggleProductActive } from "@/lib/actions/products";
import type { Database } from "@/lib/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export function useInventario() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [filter, setFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  async function load() {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data || []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function toggleActive(id: string, current: boolean) {
    const result = await toggleProductActive(id, current);
    if (result.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p)),
      );
    }
  }

  async function handleDelete(id: string) {
    setDeleteTarget(id);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const result = await deleteProductAction(deleteTarget);
    if (result.success) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget));
    }
    setDeleteTarget(null);
  }

  const filtered =
    filter === "all"
      ? products
      : products.filter((p) => (filter === "active" ? p.is_active : !p.is_active));

  const filterChips = [
    { label: "Todos", value: "all" },
    { label: "Activos", value: "active" },
    { label: "Inactivos", value: "inactive" },
  ];

  return {
    products,
    filtered,
    filter,
    setFilter,
    deleteTarget,
    setDeleteTarget,
    filterChips,
    load,
    toggleActive,
    handleDelete,
    confirmDelete,
  };
}
