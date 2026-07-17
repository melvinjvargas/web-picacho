"use client";

import { ConfirmModal } from "@/components/admin/feedback/ConfirmModal";
import { CategoriasForm } from "./_components/CategoriasForm";
import { CategoriasTable } from "./_components/CategoriasTable";
import { useCategorias } from "./_hooks/useCategorias";

export default function CategoriasPage() { const h = useCategorias(); const deleteCount = h.deleteId ? (h.productCounts[h.deleteId] ?? 0) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-[32px] font-bold text-text-primary">Categorías</h1>
        <button type="button" onClick={() => h.setShowForm(!h.showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          + Nueva categoría
        </button>
      </div>
      <CategoriasForm showForm={h.showForm} setShowForm={h.setShowForm} newName={h.newName} setNewName={h.setNewName} addCategory={h.addCategory} />
      <CategoriasTable data={h.categories} loading={h.loading} editingId={h.editingId} editName={h.editName} setEditName={h.setEditName} startEdit={h.startEdit} saveEdit={h.saveEdit} cancelEdit={h.cancelEdit} onDelete={(id) => h.setDeleteId(id)} productCounts={h.productCounts} />
      {deleteCount > 0 ? (
        <ConfirmModal open={h.deleteId !== null} onClose={() => h.setDeleteId(null)} onConfirm={() => h.setDeleteId(null)} title="No se puede eliminar" message={`Esta categoría tiene ${deleteCount} producto(s) asociado(s). Reasignalos a otra categoría antes de eliminar.`} confirmText="Entendido" />
      ) : (
        <ConfirmModal open={h.deleteId !== null} onClose={() => h.setDeleteId(null)} onConfirm={h.confirmDelete} title="¿Eliminar categoría?" message="Esta acción no se puede deshacer." />
      )}
    </div>
  );
}
