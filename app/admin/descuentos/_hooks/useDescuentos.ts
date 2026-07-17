"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  toggleDiscountActive,
} from "@/lib/actions/discounts";
import type { Database } from "@/lib/database";

type DiscountRow = Database["public"]["Tables"]["discounts"]["Row"];

function getDiscountType(d: DiscountRow) {
  return (d.percentage ?? 0) > 0 ? "percentage" as const : "fixed" as const;
}

function getDiscountValue(d: DiscountRow) {
  return (d.percentage ?? 0) > 0 ? `${d.percentage}%` : `L.${d.fixed_amount ?? 0}`;
}

export function useDescuentos() {
  const [discounts, setDiscounts] = useState<DiscountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newPercentage, setNewPercentage] = useState("");
  const [newFixedAmount, setNewFixedAmount] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [newValidUntil, setNewValidUntil] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCode, setEditCode] = useState("");
  const [editValue, setEditValue] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    const supabase = createBrowserSupabase();
    const { data } = await supabase.from("discounts").select("*").order("id");
    setDiscounts(data || []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function addDiscount() {
    if (!newCode.trim()) return;
    const result = await createDiscount(
      newCode.trim(),
      discountType === "percentage" ? newPercentage : undefined,
      discountType === "fixed" ? newFixedAmount : undefined,
      newValidUntil || undefined,
    );
    if (result.success) {
      setNewCode("");
      setNewPercentage("");
      setNewFixedAmount("");
      setNewValidUntil("");
      setShowForm(false);
      load();
    }
  }

  async function toggleActive(id: string, currentActive: boolean) {
    const result = await toggleDiscountActive(id, currentActive);
    if (result.success) {
      setDiscounts((prev) =>
        prev.map((d) => (d.id === id ? { ...d, is_active: !currentActive } : d)),
      );
    }
  }

  function startEdit(d: DiscountRow) {
    setEditingId(d.id);
    setEditCode(d.code);
    setEditValue(
      getDiscountType(d) === "percentage"
        ? String(d.percentage ?? 0)
        : String(d.fixed_amount ?? 0),
    );
  }

  function cancelEdit() {
    setEditingId(null);
    setEditCode("");
    setEditValue("");
  }

  async function saveEdit(id: string) {
    if (!editCode.trim()) return;
    const discount = discounts.find((d) => d.id === id);
    if (!discount) return;
    const result = await updateDiscount(
      id,
      editCode.trim(),
      editValue,
      getDiscountType(discount),
    );
    if (result.success) {
      cancelEdit();
      load();
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    const result = await deleteDiscount(deleteId);
    if (result.success) load();
    setDeleteId(null);
  }

  return {
    discounts,
    loading,
    showForm,
    setShowForm,
    newCode,
    setNewCode,
    newPercentage,
    setNewPercentage,
    newFixedAmount,
    setNewFixedAmount,
    discountType,
    setDiscountType,
    newValidUntil,
    setNewValidUntil,
    editingId,
    editCode,
    setEditCode,
    editValue,
    setEditValue,
    deleteId,
    setDeleteId,
    addDiscount,
    toggleActive,
    startEdit,
    cancelEdit,
    saveEdit,
    confirmDelete,
    getDiscountType,
    getDiscountValue,
  };
}
