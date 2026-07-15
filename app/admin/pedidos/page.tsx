"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import { updateOrderStatus } from "@/lib/actions/orders";
import { cn } from "@/lib/utils";
import type { Database } from "@/lib/database";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

const STATUS_OPTIONS = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en_proceso", label: "En proceso" },
  { value: "completado", label: "Completado" },
  { value: "devolucion", label: "Devolución" },
] as const;

const statusStyles: Record<string, string> = {
  pendiente: "bg-[#FEE2E2] text-[#DC2626]",
  en_proceso: "bg-[#FEF3C7] text-[#D97706]",
  completado: "bg-[#E8F0E9] text-[#2D4A32]",
  devolucion: "bg-[#E3F2FD] text-[#1976D2]",
};

export default function PedidosPage() {
  const [allOrders, setAllOrders] = useState<OrderRow[]>([]);
  const [filter, setFilter] = useState(() => {
    if (typeof window === "undefined") return "all";
    const params = new URLSearchParams(window.location.search);
    const statusParam = params.get("status");
    return statusParam &&
      ["pendiente", "en_proceso", "completado", "devolucion"].includes(statusParam)
      ? statusParam
      : "all";
  });

  async function load() {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    setAllOrders(data || []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function updateStatus(orderId: string, newStatus: string) {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setAllOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    }
  }

  const filtered =
    filter === "all"
      ? allOrders
      : allOrders.filter((o) => o.status === filter);

  const pendingCount = allOrders.filter((o) => o.status === "pendiente").length;
  const processCount = allOrders.filter((o) => o.status === "en_proceso").length;
  const completedCount = allOrders.filter((o) => o.status === "completado").length;
  const devolucionCount = allOrders.filter((o) => o.status === "devolucion").length;

  const filterChips = [
    { label: `Todos (${allOrders.length})`, value: "all" },
    { label: `Pendientes (${pendingCount})`, value: "pendiente" },
    { label: `En proceso (${processCount})`, value: "en_proceso" },
    { label: `Completados (${completedCount})`, value: "completado" },
    { label: `Devoluciones (${devolucionCount})`, value: "devolucion" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-text-primary">
        Pedidos
      </h1>

      <div className="flex gap-2">
        {filterChips.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className="inline-flex items-center rounded-full px-4 py-2 text-[13px] font-medium transition"
            style={{
              backgroundColor: filter === f.value ? "#111111" : "#F0F0F0",
              color: filter === f.value ? "#FFFFFF" : "#111111",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-[#FAFAFA]">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F0F0F0]">
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 120 }}>
                Pedido
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 180 }}>
                Cliente
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 240 }}>
                Productos
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 120 }}>
                Total
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 160 }}>
                Estado
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 120 }}>
                Fecha
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr
                key={order.id}
                className="h-14 border-t border-border transition hover:bg-[#F0F0F0]/50"
              >
                <td className="px-4 text-sm text-text-primary" style={{ width: 120 }}>
                  #{String(order.id).padStart(4, "0")}
                </td>
                <td className="px-4 text-sm text-text-primary" style={{ width: 180 }}>
                  {order.customer_name || "—"}
                </td>
                <td className="px-4" style={{ width: 240 }}>
                  {order.items.map((item, i) => (
                    <div key={i} className={i > 0 ? "mt-1.5 pt-1.5 border-t border-border/50" : ""}>
                      <p className="text-sm font-medium text-text-primary">
                        {String(item.name || "—")}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {item.size ? `Talla: ${String(item.size)}` : ""}
                        {item.color ? ` · ${String(item.color)}` : ""}
                        {` · x${item.quantity ?? 1}`}
                      </p>
                    </div>
                  ))}
                </td>
                <td className="px-4 text-sm text-text-primary" style={{ width: 120 }}>
                  L. {Number(order.total).toFixed(2)}
                </td>
                <td className="px-4" style={{ width: 160 }}>
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={cn(
                      "cursor-pointer rounded-full border-0 px-3 py-1 text-xs font-medium outline-none appearance-none text-center",
                      statusStyles[order.status] || "bg-[#F0F0F0] text-text-secondary",
                    )}
                    style={{ minWidth: 130, height: 30 }}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 text-sm text-text-primary" style={{ width: 120 }}>
                  {new Date(order.created_at).toLocaleDateString("es-HN")}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm text-text-secondary">
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
