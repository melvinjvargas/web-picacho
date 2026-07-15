import { cn } from "@/lib/utils";

interface ColorCircleProps {
  hex: string;
  name: string;
  active?: boolean;
  onClick?: () => void;
}

export function ColorCircle({
  hex,
  name,
  active = false,
  onClick,
}: ColorCircleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center gap-1"
      title={name}
    >
      <span
        className={cn(
          "block h-8 w-8 rounded-full border-2 transition-all",
          active
            ? "border-text-primary scale-110"
            : "border-border hover:border-text-secondary",
        )}
        style={{ backgroundColor: hex }}
      />
      <span
        className={cn(
          "text-[11px] font-medium",
          active ? "text-text-primary" : "text-text-secondary",
        )}
      >
        {name}
      </span>
    </button>
  );
}
