"use client";

import { useInformes } from "./_hooks/useInformes";
import { PeriodFilters } from "./_components/PeriodFilters";
import { MetricsRow } from "./_components/MetricsRow";
import { TopProductsTable } from "./_components/TopProductsTable";
import { DiscountsUsedTable } from "./_components/DiscountsUsedTable";

export default function InformesPage() {
  const {
    period,
    setPeriod,
    totalRevenue,
    totalOrders,
    topProducts,
    discounts,
    avgTicket,
    maxCount,
    periods,
  } = useInformes();

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-semibold text-text-primary">
        Informes
      </h1>

      <PeriodFilters
        periods={periods}
        activePeriod={period}
        onPeriodChange={setPeriod}
      />

      <MetricsRow
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        avgTicket={avgTicket}
      />

      <TopProductsTable topProducts={topProducts} maxCount={maxCount} />

      <DiscountsUsedTable discounts={discounts} />
    </div>
  );
}
