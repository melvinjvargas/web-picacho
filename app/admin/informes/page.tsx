"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import type { Database } from "@/lib/database";

type DiscountRow = Database["public"]["Tables"]["discounts"]["Row"];

interface ProdSales {
  name: string;
  count: number;
}

export default function InformesPage() {
  const [period, setPeriod] = useState("today");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [topProducts, setTopProducts] = useState<ProdSales[]>([]);
  const [discounts, setDiscounts] = useState<DiscountRow[]>([]);

  const load = useCallback(async () => {
    const supabase = createBrowserSupabase();

    const today = new Date();

    let startDate: string | null = null;
    const thisYear = today.getFullYear();
    const thisMonth = today.getMonth();

    switch (period) {
      case "today": {
        const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        startDate = last24h;
        break;
      }
      case "week": {
        const d = new Date(today);
        d.setDate(d.getDate() - d.getDay());
        startDate = d.toISOString().split("T")[0];
        break;
      }
      case "month": {
        startDate = `${thisYear}-${String(thisMonth + 1).padStart(2, "0")}-01`;
        break;
      }
      case "year": {
        startDate = `${thisYear}-01-01`;
        break;
      }
      case "custom":
        startDate = null;
        break;
    }

    const query = supabase.from("orders").select("*").in("status", ["completado", "en_proceso"]);
    if (startDate) {
      query.gte("created_at", startDate);
    }

    const { data: orders } = await query;

    const completedOrders = orders || [];
    const rev = completedOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    setTotalRevenue(rev);
    setTotalOrders(completedOrders.length);

    // Count products from items
    const productMap = new Map<string, number>();
    for (const order of completedOrders) {
      const items = (order.items || []) as Record<string, unknown>[];
      for (const item of items) {
        const name = (item.name as string) || (item.product_name as string) || "Desconocido";
        productMap.set(name, (productMap.get(name) || 0) + 1);
      }
    }

    const sorted = Array.from(productMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    setTopProducts(sorted);

    const { data: discData } = await supabase
      .from("discounts")
      .select("*")
      .order("id");

    setDiscounts(discData || []);
  }, [period]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const periods = [
    { label: "Hoy", value: "today" },
    { label: "Esta semana", value: "week" },
    { label: "Este mes", value: "month" },
    { label: "Este año", value: "year" },
    { label: "Personalizado", value: "custom" },
  ];

  const maxCount = topProducts.length > 0 ? Math.max(...topProducts.map((p) => p.count)) : 1;

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-semibold text-text-primary">
        Informes
      </h1>

      <div className="flex gap-2">
        {periods.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => setPeriod(p.value)}
            className="inline-flex items-center rounded-full px-4 py-2 text-[13px] font-medium transition"
            style={{
              backgroundColor: period === p.value ? "#111111" : "#F5F4F0",
              color: period === p.value ? "#FFFFFF" : "#111111",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-[13px] text-text-secondary">Ventas totales</p>
              <p className="text-[32px] font-bold leading-tight text-text-primary">
                L. {totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#E8F0E9] text-brand-green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-[13px] text-text-secondary">Pedidos</p>
              <p className="text-[32px] font-bold leading-tight text-text-primary">
                {totalOrders}
              </p>
            </div>
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#E8F0E9] text-brand-green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-[13px] text-text-secondary">Ticket promedio</p>
              <p className="text-[32px] font-bold leading-tight text-text-primary">
                L. {avgTicket.toFixed(2)}
              </p>
            </div>
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#E8F0E9] text-brand-green">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          Productos más vendidos
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F4F0]">
                <th className="h-10 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 200 }}>
                  Producto
                </th>
                <th className="h-10 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 240 }}>
                  Progreso
                </th>
                <th className="h-10 px-4 text-right text-[13px] font-semibold text-text-primary" style={{ width: 100 }}>
                  Ventas
                </th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((prod) => (
                <tr key={prod.name} className="h-12 border-t border-border">
                  <td className="px-4 text-sm text-text-primary" style={{ width: 200 }}>
                    {prod.name}
                  </td>
                  <td className="px-4" style={{ width: 240 }}>
                    <div className="h-2 w-full rounded-sm bg-[#F5F4F0]">
                      <div
                        className="h-full rounded-sm bg-brand-green transition-all"
                        style={{ width: `${(prod.count / maxCount) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 text-right text-sm font-medium text-text-primary" style={{ width: 100 }}>
                    {prod.count} ventas
                  </td>
                </tr>
              ))}
              {topProducts.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-text-secondary">
                    Sin datos de ventas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          Descuentos utilizados
        </h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F5F4F0]">
                <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 200 }}>
                  Código
                </th>
                <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 120 }}>
                  Usos
                </th>
                <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 120 }}>
                  Ahorro total
                </th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d) => (
                <tr key={d.id} className="h-12 border-t border-border transition hover:bg-bg-secondary/50">
                  <td className="px-4 text-sm font-medium text-text-primary" style={{ width: 200 }}>
                    {d.code}
                  </td>
                  <td className="px-4 text-sm text-text-primary" style={{ width: 120 }}>
                    {d.usage_count ?? 0}
                  </td>
                  <td className="px-4 text-sm text-text-primary" style={{ width: 120 }}>
                    —
                  </td>
                </tr>
              ))}
              {discounts.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-text-secondary">
                    Sin datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
