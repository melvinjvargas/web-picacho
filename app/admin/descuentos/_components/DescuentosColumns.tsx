import type { Column } from "@/components/admin/data-display/AdminTable";
import type { Database } from "@/lib/database";

type DiscountRow = Database["public"]["Tables"]["discounts"]["Row"];

interface DescuentosColumnsProps {
  editingId: string | null;
  editCode: string;
  setEditCode: (v: string) => void;
  editValue: string;
  setEditValue: (v: string) => void;
  startEdit: (d: DiscountRow) => void;
  saveEdit: (id: string) => void;
  cancelEdit: () => void;
  onToggle: (id: string, currentActive: boolean) => void;
  onDelete: (id: string) => void;
  getDiscountType: (d: DiscountRow) => "percentage" | "fixed";
  getDiscountValue: (d: DiscountRow) => string;
}

export function createDescuentosColumns({
  editingId, editCode, setEditCode, editValue, setEditValue,
  startEdit, saveEdit, cancelEdit, onToggle, onDelete,
  getDiscountType, getDiscountValue,
}: DescuentosColumnsProps): Column<DiscountRow>[] {
  return [
    {
      key: "code", header: "Código", width: "160px",
      render: (row) =>
        editingId === row.id ? (
          <input
            value={editCode}
            onChange={(e) => setEditCode(e.target.value)}
            className="w-full rounded border border-border px-2 py-1 text-sm font-semibold outline-none focus:border-brand-green"
            onKeyDown={(e) => { if (e.key === "Enter") saveEdit(row.id); if (e.key === "Escape") cancelEdit(); }}
            autoFocus
          />
        ) : (
          <span className="font-semibold">{row.code}</span>
        ),
    },
    {
      key: "type", header: "Tipo", width: "140px",
      render: (row) => getDiscountType(row) === "percentage" ? "Porcentaje" : "Fijo",
    },
    {
      key: "value", header: "Valor", width: "120px",
      render: (row) =>
        editingId === row.id ? (
          <div className="flex items-center gap-1">
            <input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              type="number"
              className="w-16 rounded border border-border px-2 py-1 text-sm outline-none focus:border-brand-green"
            />
            <span className="text-xs text-text-secondary">
              {getDiscountType(row) === "percentage" ? "%" : "L."}
            </span>
          </div>
        ) : (
          getDiscountValue(row)
        ),
    },
    {
      key: "usage_count", header: "Usos", width: "100px",
      render: (row) => `${row.usage_count ?? 0} usos`,
    },
    {
      key: "valid_until", header: "Válido hasta", width: "120px",
      render: (row) =>
        row.valid_until ? new Date(row.valid_until).toLocaleDateString("es-HN") : "—",
    },
    {
      key: "is_active", header: "Estado", width: "120px",
      render: (row) => (
        <button
          type="button"
          onClick={() => onToggle(row.id, row.is_active)}
          className={`relative h-6 w-11 rounded-xl transition ${row.is_active ? "bg-brand-green" : "bg-[#CCCCCC]"}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${row.is_active ? "left-[22px]" : "left-0.5"}`}
          />
        </button>
      ),
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
