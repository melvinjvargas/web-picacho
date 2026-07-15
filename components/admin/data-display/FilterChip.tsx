import { cn } from "@/lib/utils";

interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function FilterChip({ label, active = false, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-[13px] font-medium transition",
        active
          ? "bg-[#111111] text-white"
          : "bg-[#F5F4F0] text-text-primary hover:opacity-80",
      )}
    >
      {label}
    </button>
  );
}
