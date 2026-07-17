import Image from "next/image";
import type { Column } from "@/components/admin/data-display/AdminTable";
import type { Database } from "@/lib/database";

type P = Database["public"]["Tables"]["products"]["Row"];

function sku(p: P) { return `PIC-${p.id.substring(0, 3).toUpperCase()}-${p.sizes?.[0] || "STD"}-${String(p.colors?.[0]?.name || "STD").substring(0, 4)}`; }
function cname(p: P) { const c = p.colors?.[0]; return !c ? "Único" : String(c.name) || "Único"; }

export function createInventarioColumns(
  onToggle: (id: string, current: boolean) => void,
  onDelete: (id: string) => void,
  onEdit: (id: string) => void,
): Column<P>[] {
  return [
    { key: "name", header: "Producto", width: "200px",
      render: (row) => {
        const src = row.images?.[0] || "";
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-bg-secondary">
              {src ? <Image src={src} alt="" width={32} height={32} className="h-full w-full object-cover" /> : null}
            </div>
            <span>{row.name}</span>
          </div>
        );
      } },
    { key: "category", header: "Categoría", width: "120px" },
    { key: "sku", header: "SKU", width: "140px", render: (row) => <span className="text-text-secondary">{sku(row)}</span> },
    { key: "sizes", header: "Talla", width: "60px", render: (row) => row.sizes?.[0] || "STD" },
    { key: "colors", header: "Color", width: "80px", render: (row) => cname(row) },
    { key: "is_active", header: "Estado", width: "100px",
      render: (row) => (
        <div className="flex justify-center">
          <button type="button" onClick={() => onToggle(row.id, row.is_active)}
            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200"
            style={{ backgroundColor: row.is_active ? "#2D4A32" : "#E8E8E8" }}>
            <span className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200"
              style={{ margin: 2, transform: row.is_active ? "translateX(20px)" : "translateX(0)" }} />
          </button>
        </div>
      ) },
    { key: "actions", header: "Acciones", width: "120px",
      render: (row) => (
        <div className="flex items-center justify-center gap-3">
          <button type="button" onClick={() => onEdit(row.id)} title="Editar"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F0E9] text-brand-green transition hover:opacity-80">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
          </button>
          <button type="button" onClick={() => onDelete(row.id)} title="Eliminar"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5F4F0] text-accent-orange transition hover:opacity-80">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
          </button>
        </div>
      ) },
  ];
}
