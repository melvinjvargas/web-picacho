import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "whatsapp" | "ghost";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
  href?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-green text-white hover:bg-brand-green/90",
  secondary:
    "bg-bg-primary text-text-primary border border-text-primary hover:bg-bg-secondary",
  whatsapp:
    "bg-brand-green text-white hover:bg-brand-green/90",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary",
};

export function Button({
  children,
  variant = "primary",
  className,
  onClick,
  href,
}: ButtonProps) {
  const styles = cn(
    "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-colors",
    variantStyles[variant],
    className,
  );

  if (href) {
    return (
      <a href={href} className={styles} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={styles}>
      {children}
    </button>
  );
}
