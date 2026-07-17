"use client";

import { AdminTable } from "@/components/admin/data-display/AdminTable";
import { createCategoriasColumns } from "./CategoriasColumns";
import type { Database } from "@/lib/database";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

interface CategoriasTableProps {
  data: CategoryRow[];
  loading?: boolean;
  editingId: string | null;
  editName: string;
  setEditName: (v: string) => void;
  startEdit: (cat: CategoryRow) => void;
  saveEdit: (id: string) => void;
  cancelEdit: () => void;
  onDelete: (id: string) => void;
  productCounts: Record<string, number>;
}

export function CategoriasTable(props: CategoriasTableProps) {
  const columns = createCategoriasColumns(props);
  return (
    <AdminTable<CategoryRow>
      columns={columns}
      data={props.data}
      keyExtractor={(row) => row.id}
      loading={props.loading}
      emptyMessage="Sin categorías."
    />
  );
}
