import type { Column } from "@/components/admin/data-display/AdminTable";
import { ORDER_STATUS, type OrderStatusKey } from "@/lib/status-colors";
import type { Database } from "@/lib/database";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type Item = { name?: string; size?: string; color?: string; quantity?: number };

export const STATUS_OPTIONS = Object.entries(ORDER_STATUS).map(([value, { label }]) => ({
  value,
  label,
}));

export function createPedidosColumns(
  update: (orderId: string, newStatus: string) => void,
): Column<OrderRow>[] {
  return [
    { key: "id", header: "Pedido", width: "120px",
      render: (row) => `#${String(row.id).padStart(4, "0")}` },
    { key: "customer_name", header: "Cliente", width: "180px",
      render: (row) => row.customer_name || "—" },
    { key: "items", header: "Productos", width: "240px",
      render: (row) => (
        <>
          {(row.items as Item[]).map((item, i) => (
            <div key={i} className={i > 0 ? "mt-1.5 border-t border-border/50 pt-1.5" : ""}>
              <p className="font-medium">{String(item.name || "—")}</p>
              <p className="text-xs text-text-secondary">
                {item.size ? `Talla: ${item.size}` : ""}
                {item.color ? ` · ${item.color}` : ""}
                {` · x${item.quantity ?? 1}`}
              </p>
            </div>
          ))}
        </>
      ) },
    { key: "total", header: "Total", width: "120px",
      render: (row) => `L. ${row.total.toFixed(2)}` },
    { key: "status", header: "Estado", width: "160px",
      render: (row) => {
        const s = ORDER_STATUS[row.status as OrderStatusKey];
        return (
          <select
            value={row.status}
            onChange={(e) => update(row.id, e.target.value)}
            className="cursor-pointer appearance-none rounded-full border-0 px-3 py-1 text-center text-xs font-medium outline-none"
            style={{ backgroundColor: s?.bg ?? "#F0F0F0", color: s?.text ?? "#6B6B6B", minWidth: 130, height: 30 }}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        );
      } },
    { key: "created_at", header: "Fecha", width: "120px",
      render: (row) => new Date(row.created_at).toLocaleDateString("es-HN") },
  ];
}
