import type { Column } from "@/components/admin/data-display/AdminTable";
import type { Database } from "@/lib/database";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

interface CategoriasColumnsProps {
  editingId: string | null;
  editName: string;
  setEditName: (v: string) => void;
  startEdit: (cat: CategoryRow) => void;
  saveEdit: (id: string) => void;
  cancelEdit: () => void;
  onDelete: (id: string) => void;
  productCounts: Record<string, number>;
}

export function createCategoriasColumns({
  editingId, editName, setEditName, startEdit, saveEdit, cancelEdit, onDelete, productCounts,
}: CategoriasColumnsProps): Column<CategoryRow>[] {
  return [
    {
      key: "name", header: "Nombre", width: "300px",
      render: (row) =>
        editingId === row.id ? (
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full rounded border border-border px-2 py-1 text-sm outline-none focus:border-brand-green"
            onKeyDown={(e) => { if (e.key === "Enter") saveEdit(row.id); if (e.key === "Escape") cancelEdit(); }}
            autoFocus
          />
        ) : (
          row.name
        ),
    },
    {
      key: "product_count", header: "Productos", width: "200px",
      render: (row) => productCounts[row.id] ?? 0,
    },
    {
      key: "created_at", header: "Creado", width: "200px",
      render: (row) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString("es-HN") : "—",
    },
    {
      key: "actions", header: "Acciones", width: "120px",
      render: (row) => (
        <div className="flex items-center justify-center gap-3">
          {editingId === row.id ? (
            <>
              <button type="button" onClick={() => saveEdit(row.id)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green text-white transition hover:opacity-80" title="Guardar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              </button>
              <button type="button" onClick={cancelEdit}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text-secondary transition hover:text-text-primary" title="Cancelar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => startEdit(row)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F0E9] text-brand-green transition hover:opacity-80" title="Editar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              </button>
              <button type="button" onClick={() => onDelete(row.id)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F0F0F0] text-accent-orange transition hover:opacity-80" title="Eliminar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
              </button>
            </>
          )}
        </div>
      ),
    },
  ];
}
