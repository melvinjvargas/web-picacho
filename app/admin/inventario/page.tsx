"use client";

import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/admin/feedback/ConfirmModal";
import { InventarioTable } from "./_components/InventarioTable";
import { useInventario } from "./_hooks/useInventario";

export default function InventarioPage() {
  const router = useRouter();
  const {
    filtered,
    filter,
    setFilter,
    deleteTarget,
    setDeleteTarget,
    filterChips,
    toggleActive,
    handleDelete,
    confirmDelete,
  } = useInventario();

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-text-primary">Inventario</h1>

      <div className="flex gap-3">
        {filterChips.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className="inline-flex items-center rounded-full px-4 py-2 text-[13px] font-medium transition"
            style={{
              backgroundColor: filter === f.value ? "#111111" : "#F5F4F0",
              color: filter === f.value ? "#FFFFFF" : "#111111",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <InventarioTable
        products={filtered}
        onToggle={toggleActive}
        onDelete={handleDelete}
        onEdit={(id) => router.push(`/admin/productos/${id}/editar`)}
      />

      <ConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Eliminar producto"
        message="¿Estás seguro de que querés eliminar este producto? Esta acción no se puede deshacer."
      />
    </div>
  );
}
