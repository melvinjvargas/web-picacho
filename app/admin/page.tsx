import Link from "next/link";
import { createServerSupabase } from "@/lib/server-supabase";
import { getDashboardMetrics } from "@/lib/data/dashboard-server";
import { MetricCard } from "@/components/admin/data-display/MetricCard";
import { RecentOrders } from "@/components/admin/data-display/RecentOrders";
import { DashboardGreeting } from "./DashboardGreeting";

export default async function AdminDashboard() {
  const supabase = await createServerSupabase();
  const metrics = await getDashboardMetrics();

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <DashboardGreeting />

      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          title="Pedidos hoy"
          value={metrics.ordersToday}
          icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
        <MetricCard
          title="Ventas de la semana"
          value={`L. ${metrics.weekRevenue.toFixed(2)}`}
          icon="M23 6l-9.5 9.5-5-5L1 18M17 6h6v6"
        />
        <MetricCard
          title="Ventas del mes"
          value={`L. ${metrics.monthRevenue.toFixed(2)}`}
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <MetricCard
          title="Productos activos"
          value={metrics.activeProducts}
          icon="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
        <MetricCard
          title="Productos inactivos"
          value={metrics.inactiveProducts}
          variant="alert"
          icon="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </div>

      <div className="flex gap-3">
        <Link
          href="/admin/productos"
          className="inline-flex items-center gap-2 rounded-md bg-brand-green px-4 py-2.5 text-[13px] font-medium text-white transition hover:opacity-90"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Nuevo producto
        </Link>
        <Link
          href="/admin/inventario"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-4 py-2.5 text-[13px] font-medium text-text-primary transition hover:border-brand-green"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          Ver inventario
        </Link>
        <Link
          href="/admin/informes"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-white px-4 py-2.5 text-[13px] font-medium text-text-primary transition hover:border-brand-green"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Generar informe
        </Link>
      </div>

      <RecentOrders orders={recentOrders || []} />
    </div>
  );
}
