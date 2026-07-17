"use client";

import { AdminTable } from "@/components/admin/data-display/AdminTable";
import { createDescuentosColumns } from "./DescuentosColumns";
import type { Database } from "@/lib/database";

type DiscountRow = Database["public"]["Tables"]["discounts"]["Row"];

interface DescuentosTableProps {
  data: DiscountRow[];
  loading?: boolean;
  editingId: string | null;
  editCode: string;
  setEditCode: (v: string) => void;
  editValue: string;
  setEditValue: (v: string) => void;
  startEdit: (d: DiscountRow) => void;
  saveEdit: (id: string) => void;
  cancelEdit: () => void;
  onToggle: (id: string, currentActive: boolean) => void;
  onDelete: (id: string) => void;
  getDiscountType: (d: DiscountRow) => "percentage" | "fixed";
  getDiscountValue: (d: DiscountRow) => string;
}

export function DescuentosTable(props: DescuentosTableProps) {
  const columns = createDescuentosColumns(props);
  return (
    <AdminTable<DiscountRow>
      columns={columns}
      data={props.data}
      keyExtractor={(row) => row.id}
      loading={props.loading}
      emptyMessage="Sin descuentos."
    />
  );
}
