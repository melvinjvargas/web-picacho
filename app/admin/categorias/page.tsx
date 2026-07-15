"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import { ConfirmModal } from "@/components/admin/feedback/ConfirmModal";
import type { Database } from "@/lib/database";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

export default function CategoriasPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  // Delete confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

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

  async function addCategory() {
    if (!newName.trim()) return;
    const slug = newName.trim().toLowerCase().replace(/\s+/g, "-");
    const supabase = createBrowserSupabase();
    await supabase.from("categories").insert({ name: newName.trim(), slug });
    setNewName("");
    setShowForm(false);
    load();
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
    const slug = editName.trim().toLowerCase().replace(/\s+/g, "-");
    const supabase = createBrowserSupabase();
    await supabase
      .from("categories")
      .update({ name: editName.trim(), slug })
      .eq("id", id);
    cancelEdit();
    load();
  }

  async function confirmDelete() {
    if (deleteId === null) return;
    const supabase = createBrowserSupabase();
    await supabase.from("categories").delete().eq("id", deleteId);
    setDeleteId(null);
    load();
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-semibold text-text-primary">
            Categorías
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
          Categorías
        </h1>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          + Nueva categoría
        </button>
      </div>

      {showForm && (
        <div className="flex items-end gap-3 rounded-lg border border-border bg-[#FAFAFA] p-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-text-secondary">Nombre</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nombre de la categoría"
              className="w-64 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-brand-green"
              onKeyDown={(e) => {
                if (e.key === "Enter") addCategory();
              }}
            />
          </div>
          <button
            type="button"
            onClick={addCategory}
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
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 300 }}>
                Nombre
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 200 }}>
                Productos
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 200 }}>
                Creado
              </th>
              <th className="h-12 px-4 text-center text-[13px] font-semibold text-text-primary" style={{ width: 120 }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="h-12 border-t border-border transition hover:bg-[#F0F0F0]/50"
              >
                <td className="px-4 text-sm text-text-primary" style={{ width: 300 }}>
                  {editingId === cat.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded border border-border px-2 py-1 text-sm outline-none focus:border-brand-green"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit(cat.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                    />
                  ) : (
                    cat.name
                  )}
                </td>
                <td className="px-4 text-sm text-text-primary" style={{ width: 200 }}>
                  {productCounts[cat.id] ?? 0}
                </td>
                <td className="px-4 text-sm text-text-primary" style={{ width: 200 }}>
                  {cat.created_at
                    ? new Date(cat.created_at).toLocaleDateString("es-HN")
                    : "—"}
                </td>
                <td className="px-4" style={{ width: 120 }}>
                  <div className="flex items-center justify-center gap-3">
                    {editingId === cat.id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => saveEdit(cat.id)}
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
                          onClick={() => startEdit(cat)}
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
                          onClick={() => setDeleteId(cat.id)}
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
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-text-secondary">
                  Sin categorías.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {deleteId !== null && (productCounts[deleteId] ?? 0) > 0 ? (
        <ConfirmModal
          open={true}
          onClose={() => setDeleteId(null)}
          onConfirm={() => setDeleteId(null)}
          title="No se puede eliminar"
          message={`Esta categoría tiene ${productCounts[deleteId]} producto(s) asociado(s). Reasignalos a otra categoría antes de eliminar.`}
          confirmText="Entendido"
        />
      ) : (
        <ConfirmModal
          open={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          title="¿Eliminar categoría?"
          message="Esta acción no se puede deshacer."
        />
      )}
    </div>
  );
}
