import type { ProdSales } from "../_hooks/useInformes";

interface TopProductsTableProps {
  topProducts: ProdSales[];
  maxCount: number;
}

export function TopProductsTable({ topProducts, maxCount }: TopProductsTableProps) {
  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold text-text-primary">
        Productos más vendidos
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F4F0]">
              <th className="h-10 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 200 }}>
                Producto
              </th>
              <th className="h-10 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 240 }}>
                Progreso
              </th>
              <th className="h-10 px-4 text-right text-[13px] font-semibold text-text-primary" style={{ width: 100 }}>
                Ventas
              </th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((prod) => (
              <tr key={prod.name} className="h-12 border-t border-border">
                <td className="px-4 text-sm text-text-primary" style={{ width: 200 }}>
                  {prod.name}
                </td>
                <td className="px-4" style={{ width: 240 }}>
                  <div className="h-2 w-full rounded-sm bg-[#F5F4F0]">
                    <div
                      className="h-full rounded-sm bg-brand-green transition-all"
                      style={{ width: `${(prod.count / maxCount) * 100}%` }}
                    />
                  </div>
                </td>
                <td className="px-4 text-right text-sm font-medium text-text-primary" style={{ width: 100 }}>
                  {prod.count} ventas
                </td>
              </tr>
            ))}
            {topProducts.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-sm text-text-secondary">
                  Sin datos de ventas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
