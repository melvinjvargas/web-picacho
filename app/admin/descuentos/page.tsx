"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import { ConfirmModal } from "@/components/admin/feedback/ConfirmModal";
import type { Database } from "@/lib/database";

type DiscountRow = Database["public"]["Tables"]["discounts"]["Row"];

export default function DescuentosPage() {
  const [discounts, setDiscounts] = useState<DiscountRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newPercentage, setNewPercentage] = useState("");
  const [newFixedAmount, setNewFixedAmount] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [newValidUntil, setNewValidUntil] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCode, setEditCode] = useState("");
  const [editValue, setEditValue] = useState("");

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const supabase = createBrowserSupabase();
    const { data } = await supabase.from("discounts").select("*").order("id");
    setDiscounts(data || []);
    setLoading(false);
  }

  async function addDiscount() {
    if (!newCode.trim()) return;
    const supabase = createBrowserSupabase();
    const insert: Database["public"]["Tables"]["discounts"]["Insert"] = {
      code: newCode.trim().toUpperCase(),
      is_active: true,
      usage_count: 0,
    };

    if (discountType === "percentage" && newPercentage) {
      insert.percentage = Number(newPercentage);
    } else if (discountType === "fixed" && newFixedAmount) {
      insert.percentage = 0;
      insert.fixed_amount = Number(newFixedAmount);
    }

    if (newValidUntil) {
      insert.valid_until = newValidUntil;
    }

    await supabase.from("discounts").insert(insert);
    setNewCode("");
    setNewPercentage("");
    setNewFixedAmount("");
    setNewValidUntil("");
    setShowForm(false);
    load();
  }

  async function toggleActive(id: string) {
    const discount = discounts.find((d) => d.id === id);
    if (!discount) return;
    const supabase = createBrowserSupabase();
    await supabase
      .from("discounts")
      .update({ is_active: !discount.is_active })
      .eq("id", id);

    setDiscounts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, is_active: !d.is_active } : d)),
    );
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

    const supabase = createBrowserSupabase();
    const updates: Database["public"]["Tables"]["discounts"]["Update"] = {
      code: editCode.trim().toUpperCase(),
    };

    if (getDiscountType(discount) === "percentage") {
      updates.percentage = Number(editValue) || 0;
    } else {
      updates.fixed_amount = Number(editValue) || 0;
    }

    await supabase.from("discounts").update(updates).eq("id", id);
    cancelEdit();
    load();
  }

  async function confirmDelete() {
    if (deleteId === null) return;
    const supabase = createBrowserSupabase();
    await supabase.from("discounts").delete().eq("id", deleteId);
    setDeleteId(null);
    load();
  }

  function getDiscountType(d: DiscountRow) {
    if ((d.percentage ?? 0) > 0) return "percentage";
    return "fixed";
  }

  function getDiscountValue(d: DiscountRow) {
    if ((d.percentage ?? 0) > 0) return `${d.percentage}%`;
    return `L.${d.fixed_amount ?? 0}`;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-semibold text-text-primary">
            Descuentos
          </h1>
        </div>
        <p className="text-sm text-text-secondary">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-[32px] font-bold text-text-primary">
          Descuentos
        </h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          + Nuevo descuento
        </button>
      </div>

      {showForm && (
        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-[#FAFAFA] p-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary">Código</label>
            <input
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="PICACHO10"
              className="w-40 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-green"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary">Tipo</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as "percentage" | "fixed")}
              className="w-32 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-green"
            >
              <option value="percentage">Porcentaje</option>
              <option value="fixed">Fijo</option>
            </select>
          </div>
          {discountType === "percentage" ? (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-text-secondary">%</label>
              <input
                value={newPercentage}
                onChange={(e) => setNewPercentage(e.target.value)}
                placeholder="10"
                type="number"
                className="w-20 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-green"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-text-secondary">Monto (L.)</label>
              <input
                value={newFixedAmount}
                onChange={(e) => setNewFixedAmount(e.target.value)}
                placeholder="50"
                type="number"
                className="w-24 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-green"
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary">Válido hasta</label>
            <input
              value={newValidUntil}
              onChange={(e) => setNewValidUntil(e.target.value)}
              type="date"
              className="w-36 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-green"
            />
          </div>
          <button
            type="button"
            onClick={addDiscount}
            className="rounded-lg bg-brand-green px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="rounded-lg border border-border bg-[#FAFAFA] px-4 py-2 text-sm text-text-secondary transition hover:text-text-primary"
          >
            Cancelar
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border bg-[#FAFAFA]">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F0F0F0]">
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 160 }}>
                Código
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 140 }}>
                Tipo
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 120 }}>
                Valor
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 100 }}>
                Usos
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 120 }}>
                Válido hasta
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 120 }}>
                Estado
              </th>
              <th className="h-12 px-4 text-center text-[13px] font-semibold text-text-primary" style={{ width: 120 }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr
                key={d.id}
                className="h-12 border-t border-border transition hover:bg-[#F0F0F0]/50"
              >
                <td className="px-4 text-sm font-semibold text-text-primary" style={{ width: 160 }}>
                  {editingId === d.id ? (
                    <input
                      value={editCode}
                      onChange={(e) => setEditCode(e.target.value)}
                      className="w-full rounded border border-border px-2 py-1 text-sm font-semibold outline-none focus:border-brand-green"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(d.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                    />
                  ) : (
                    d.code
                  )}
                </td>
                <td className="px-4 text-sm text-text-primary" style={{ width: 140 }}>
                  {getDiscountType(d) === "percentage" ? "Porcentaje" : "Fijo"}
                </td>
                <td className="px-4 text-sm text-text-primary" style={{ width: 120 }}>
                  {editingId === d.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        type="number"
                        className="w-16 rounded border border-border px-2 py-1 text-sm outline-none focus:border-brand-green"
                      />
                      <span className="text-xs text-text-secondary">
                        {getDiscountType(d) === "percentage" ? "%" : "L."}
                      </span>
                    </div>
                  ) : (
                    getDiscountValue(d)
                  )}
                </td>
                <td className="px-4 text-sm text-text-primary" style={{ width: 100 }}>
                  {d.usage_count ?? 0} usos
                </td>
                <td className="px-4 text-sm text-text-primary" style={{ width: 120 }}>
                  {d.valid_until ? new Date(d.valid_until).toLocaleDateString("es-HN") : "—"}
                </td>
                <td className="px-4" style={{ width: 120 }}>
                  <button
                    type="button"
                    onClick={() => toggleActive(d.id)}
                    className={`relative h-6 w-11 rounded-xl transition ${
                      d.is_active ? "bg-brand-green" : "bg-[#CCCCCC]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                        d.is_active ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </td>
                <td className="px-4" style={{ width: 120 }}>
                  <div className="flex items-center justify-center gap-3">
                    {editingId === d.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => saveEdit(d.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green text-white transition hover:opacity-80"
                          title="Guardar"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition hover:text-text-primary"
                          title="Cancelar"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startEdit(d)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F0E9] text-brand-green transition hover:opacity-80"
                          title="Editar"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(d.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0F0F0] text-accent-orange transition hover:opacity-80"
                          title="Eliminar"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {discounts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-text-secondary">
                  Sin descuentos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="¿Eliminar descuento?"
        message="Esta acción no se puede deshacer."
      />
    </div>
  );
}
