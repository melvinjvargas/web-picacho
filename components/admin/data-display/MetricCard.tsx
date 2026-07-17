import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: string;
  variant?: "default" | "alert";
}

const variantStyles = {
  default: "bg-[#E8F0E9] text-brand-green",
  alert: "bg-[#FFF0E5] text-accent-orange",
};

export function MetricCard({ title, value, icon, variant = "default" }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border bg-[#FAFAFA] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-[13px] text-text-secondary">{title}</p>
          <p className="text-2xl sm:text-[32px] font-bold leading-tight text-text-primary">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg",
            variantStyles[variant],
          )}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d={icon} />
          </svg>
        </div>
      </div>
    </div>
  );
}
