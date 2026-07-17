"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import type { Database } from "@/lib/database";

type DiscountRow = Database["public"]["Tables"]["discounts"]["Row"];

export interface ProdSales {
  name: string;
  count: number;
}

const PERIODS = [
  { label: "Hoy", value: "today" },
  { label: "Esta semana", value: "week" },
  { label: "Este mes", value: "month" },
  { label: "Este año", value: "year" },
  { label: "Personalizado", value: "custom" },
] as const;

export function useInformes() {
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
  const maxCount = topProducts.length > 0 ? Math.max(...topProducts.map((p) => p.count)) : 1;

  return {
    period,
    setPeriod,
    totalRevenue,
    totalOrders,
    topProducts,
    discounts,
    avgTicket,
    maxCount,
    periods: PERIODS,
  };
}
