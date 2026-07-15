import { Icon } from "./Icon";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  phone: string;
  message: string;
  className?: string;
}

export function WhatsAppButton({
  phone,
  message,
  className,
}: WhatsAppButtonProps) {
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-green py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-green/90",
        className,
      )}
    >
      <Icon name="whatsapp" size={20} className="text-white" />
      Comprar por WhatsApp
    </a>
  );
}
