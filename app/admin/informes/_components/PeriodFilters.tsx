"use client";

interface PeriodFiltersProps {
  periods: readonly { label: string; value: string }[];
  activePeriod: string;
  onPeriodChange: (value: string) => void;
}

export function PeriodFilters({ periods, activePeriod, onPeriodChange }: PeriodFiltersProps) {
  return (
    <div className="flex gap-2">
      {periods.map((p) => (
        <button
          key={p.value}
          type="button"
          onClick={() => onPeriodChange(p.value)}
          className="inline-flex items-center rounded-full px-4 py-2 text-[13px] font-medium transition"
          style={{
            backgroundColor: activePeriod === p.value ? "#111111" : "#F5F4F0",
            color: activePeriod === p.value ? "#FFFFFF" : "#111111",
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
