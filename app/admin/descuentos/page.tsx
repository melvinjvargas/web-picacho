"use client";

import { ConfirmModal } from "@/components/admin/feedback/ConfirmModal";
import { DescuentosForm } from "./_components/DescuentosForm";
import { DescuentosTable } from "./_components/DescuentosTable";
import { useDescuentos } from "./_hooks/useDescuentos";

export default function DescuentosPage() { const h = useDescuentos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-[32px] font-bold text-text-primary">Descuentos</h1>
        <button
          type="button"
          onClick={() => h.setShowForm(!h.showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
          + Nuevo descuento
        </button>
      </div>

      <DescuentosForm
        showForm={h.showForm} setShowForm={h.setShowForm}
        newCode={h.newCode} setNewCode={h.setNewCode}
        discountType={h.discountType} setDiscountType={h.setDiscountType}
        newPercentage={h.newPercentage} setNewPercentage={h.setNewPercentage}
        newFixedAmount={h.newFixedAmount} setNewFixedAmount={h.setNewFixedAmount}
        newValidUntil={h.newValidUntil} setNewValidUntil={h.setNewValidUntil}
        addDiscount={h.addDiscount}
      />

      <DescuentosTable
        data={h.discounts}
        loading={h.loading}
        editingId={h.editingId}
        editCode={h.editCode}
        setEditCode={h.setEditCode}
        editValue={h.editValue}
        setEditValue={h.setEditValue}
        startEdit={h.startEdit}
        saveEdit={h.saveEdit}
        cancelEdit={h.cancelEdit}
        onToggle={h.toggleActive}
        onDelete={(id) => h.setDeleteId(id)}
        getDiscountType={h.getDiscountType}
        getDiscountValue={h.getDiscountValue}
      />

      <ConfirmModal
        open={h.deleteId !== null}
        onClose={() => h.setDeleteId(null)}
        onConfirm={h.confirmDelete}
        title="¿Eliminar descuento?"
        message="Esta acción no se puede deshacer."
      />
    </div>
  );
}
