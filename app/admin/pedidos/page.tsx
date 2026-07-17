"use client";

import { AdminTable } from "@/components/admin/data-display/AdminTable";
import { usePedidos } from "./_hooks/usePedidos";
import { PedidosFilters } from "./_components/PedidosFilters";
import { createPedidosColumns } from "./_components/PedidosColumns";
import type { Database } from "@/lib/database";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

export default function PedidosPage() {
  const { filtered, filter, setFilter, filterChips, updateStatus } = usePedidos();

  const columns = createPedidosColumns(updateStatus);

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-text-primary">Pedidos</h1>

      <PedidosFilters chips={filterChips} activeFilter={filter} onFilterChange={setFilter} />

      <AdminTable<OrderRow>
        columns={columns}
        data={filtered}
        keyExtractor={(row) => row.id}
        rowHeight={56}
        emptyMessage="No hay pedidos aún."
      />
    </div>
  );
}
