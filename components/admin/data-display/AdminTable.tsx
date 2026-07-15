import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  width?: string;
  render?: (row: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  rowHeight?: 48 | 56;
  emptyMessage?: string;
  loading?: boolean;
  error?: string | null;
}

function SkeletonRow({ cols, rowClass }: { cols: number; rowClass: string }) {
  return (
    <tr className="animate-pulse border-t border-border">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className={cn("px-4", rowClass)}>
          <div className="h-4 w-3/4 rounded bg-[#E8E8E8]" />
        </td>
      ))}
    </tr>
  );
}

export function AdminTable<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  rowHeight = 48,
  emptyMessage = "Sin resultados.",
  loading = false,
  error = null,
}: AdminTableProps<T>) {
  const rowClass = rowHeight === 56 ? "h-14" : "h-12";

  return (
    <div className="space-y-3">
      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-border bg-[#FAFAFA]">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F4F0]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary"
                  style={col.width ? { width: col.width, minWidth: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <>
                <SkeletonRow cols={columns.length} rowClass={rowClass} />
                <SkeletonRow cols={columns.length} rowClass={rowClass} />
                <SkeletonRow cols={columns.length} rowClass={rowClass} />
              </>
            ) : (
              <>
                {data.map((row) => (
                  <tr
                    key={keyExtractor(row)}
                    className="border-t border-border transition hover:bg-bg-secondary/50"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn("px-4 text-sm text-text-primary", rowClass)}
                        style={col.width ? { width: col.width, minWidth: col.width } : undefined}
                      >
                        {col.render
                          ? col.render(row)
                          : String(row[col.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
                {data.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-sm text-text-secondary"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
