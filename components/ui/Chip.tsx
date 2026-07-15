import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ label, active = false, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-text-primary text-bg-primary"
          : "bg-bg-primary text-text-primary border border-border hover:border-text-primary",
        className,
      )}
    >
      {label}
    </button>
  );
}
