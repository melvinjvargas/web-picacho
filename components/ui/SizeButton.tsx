import { cn } from "@/lib/utils";

interface SizeButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function SizeButton({ label, active = false, onClick }: SizeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded text-sm font-medium transition-colors",
        active
          ? "bg-text-primary text-white"
          : "border border-border text-text-primary hover:border-text-primary",
      )}
    >
      {label}
    </button>
  );
}
