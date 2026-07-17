import { unstable_cache } from "next/cache";
import { createServerSupabase } from "@/lib/server-supabase";
import { CACHE_TAGS } from "@/lib/cache-tags";

export interface DashboardMetrics {
  ordersToday: number;
  weekRevenue: number;
  monthRevenue: number;
  activeProducts: number;
  inactiveProducts: number;
}

export const getDashboardMetrics = unstable_cache(
  async (): Promise<DashboardMetrics> => {
    const supabase = await createServerSupabase();

    const now = new Date();
    const last24h = new Date(
      now.getTime() - 24 * 60 * 60 * 1000,
    ).toISOString();
    const firstOfMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-01`;

    const { count: ordersToday } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", last24h);

    const { data: monthOrders } = await supabase
      .from("orders")
      .select("total")
      .gte("created_at", firstOfMonth)
      .in("status", ["completado", "en_proceso"]);

    const monthRevenue = (monthOrders || []).reduce(
      (sum, o) => sum + Number(o.total || 0),
      0,
    );

    const { count: activeProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true);

    const { count: inactiveProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_active", false);

    // Start of current week (Monday 00:00 UTC)
    const nowUTC = new Date();
    const dayOfWeek = nowUTC.getUTCDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(
      Date.UTC(
        nowUTC.getUTCFullYear(),
        nowUTC.getUTCMonth(),
        nowUTC.getUTCDate() - daysFromMonday,
        0,
        0,
        0,
        0,
      ),
    );

    const { data: weekOrders } = await supabase
      .from("orders")
      .select("total")
      .gte("created_at", startOfWeek.toISOString())
      .in("status", ["completado", "en_proceso"]);

    const weekRevenue = (weekOrders || []).reduce(
      (sum, o) => sum + Number(o.total || 0),
      0,
    );

    return {
      ordersToday: ordersToday ?? 0,
      weekRevenue,
      monthRevenue,
      activeProducts: activeProducts ?? 0,
      inactiveProducts: inactiveProducts ?? 0,
    };
  },
  ["dashboard-metrics"],
  { revalidate: 120, tags: [CACHE_TAGS.adminDashboard] },
);
