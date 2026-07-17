import type { Database } from "@/lib/database";

type DiscountRow = Database["public"]["Tables"]["discounts"]["Row"];

interface DiscountsUsedTableProps {
  discounts: DiscountRow[];
}

export function DiscountsUsedTable({ discounts }: DiscountsUsedTableProps) {
  return (
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
  );
}
