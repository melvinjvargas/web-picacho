"use client";

import { AdminTable } from "@/components/admin/data-display/AdminTable";
import { createInventarioColumns } from "./InventarioColumns";
import type { Database } from "@/lib/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

interface InventarioTableProps {
  products: ProductRow[];
  onToggle: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export function InventarioTable({ products, onToggle, onDelete, onEdit }: InventarioTableProps) {
  const columns = createInventarioColumns(onToggle, onDelete, onEdit);

  return (
    <AdminTable<ProductRow>
      columns={columns}
      data={products}
      keyExtractor={(row) => row.id}
      emptyMessage="No hay productos en el inventario."
    />
  );
}
