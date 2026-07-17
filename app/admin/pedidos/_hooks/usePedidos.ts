"use client";

import { useEffect, useState, useMemo } from "react";
import { createBrowserSupabase } from "@/lib/supabase";
import { updateOrderStatus } from "@/lib/actions/orders";
import type { Database } from "@/lib/database";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

const VALID_STATUSES = ["pendiente", "en_proceso", "completado", "devolucion"] as const;

function readInitialFilter(): string {
  if (typeof window === "undefined") return "all";
  const statusParam = new URLSearchParams(window.location.search).get("status");
  return statusParam && VALID_STATUSES.includes(statusParam as (typeof VALID_STATUSES)[number])
    ? statusParam
    : "all";
}

export function usePedidos() {
  const [allOrders, setAllOrders] = useState<OrderRow[]>([]);
  const [filter, setFilter] = useState<string>(readInitialFilter);

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

  const filtered = useMemo(
    () => (filter === "all" ? allOrders : allOrders.filter((o) => o.status === filter)),
    [allOrders, filter],
  );

  const filterChips = useMemo(() => {
    const count = (s: string) => allOrders.filter((o) => o.status === s).length;
    return [
      { label: `Todos (${allOrders.length})`, value: "all" },
      { label: `Pendientes (${count("pendiente")})`, value: "pendiente" },
      { label: `En proceso (${count("en_proceso")})`, value: "en_proceso" },
      { label: `Completados (${count("completado")})`, value: "completado" },
      { label: `Devoluciones (${count("devolucion")})`, value: "devolucion" },
    ];
  }, [allOrders]);

  return { allOrders, filtered, filter, setFilter, filterChips, load, updateStatus };
}
