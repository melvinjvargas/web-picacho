interface Chip {
  label: string;
  value: string;
}

interface PedidosFiltersProps {
  chips: Chip[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
}

export function PedidosFilters({ chips, activeFilter, onFilterChange }: PedidosFiltersProps) {
  return (
    <div className="flex gap-2">
      {chips.map((f) => (
        <button
          key={f.value}
          type="button"
          onClick={() => onFilterChange(f.value)}
          className="inline-flex items-center rounded-full px-4 py-2 text-[13px] font-medium transition"
          style={{
            backgroundColor: activeFilter === f.value ? "#111111" : "#F0F0F0",
            color: activeFilter === f.value ? "#FFFFFF" : "#111111",
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
