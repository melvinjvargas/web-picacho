"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/actions/categories";
import type { Database } from "@/lib/database";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export function useCategorias() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    const supabase = createBrowserSupabase();
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from("categories").select("*").order("id"),
      supabase.from("products").select("id, category"),
    ]);

    const catData = cats || [];
    const prodData = (prods || []) as { category: string }[];

    const counts: Record<string, number> = {};
    for (const cat of catData) {
      counts[cat.id] = prodData.filter((p) => p.category === cat.name).length;
    }

    setCategories(catData);
    setProductCounts(counts);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function addCategory() {
    if (!newName.trim()) return;
    const result = await createCategory(newName.trim());
    if (result.success) {
      setNewName("");
      setShowForm(false);
      load();
    }
  }

  function startEdit(cat: CategoryRow) {
    setEditingId(cat.id);
    setEditName(cat.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return;
    const result = await updateCategory(id, editName.trim());
    if (result.success) {
      cancelEdit();
      load();
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const count = productCounts[deleteId] ?? 0;
    // Guard: client-side check before calling server action
    if (count > 0) {
      setDeleteId(null);
      return;
    }
    const result = await deleteCategory(deleteId);
    if (result.success) load();
    setDeleteId(null);
  }

  return {
    categories,
    productCounts,
    loading,
    showForm,
    setShowForm,
    newName,
    setNewName,
    editingId,
    editName,
    setEditName,
    deleteId,
    setDeleteId,
    addCategory,
    startEdit,
    cancelEdit,
    saveEdit,
    confirmDelete,
  };
}
