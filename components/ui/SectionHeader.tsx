import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label: string;
  title: string;
  linkLabel?: string;
  linkHref?: string;
  className?: string;
}

export function SectionHeader({
  label,
  title,
  linkLabel,
  linkHref,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-end justify-between w-full",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold tracking-[0.15em] uppercase text-brand-green">
          {label}
        </span>
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary break-words">
          {title}
        </h2>
      </div>
      {linkLabel && linkHref && (
        <a
          href={linkHref}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          {linkLabel} →
        </a>
      )}
    </div>
  );
}
