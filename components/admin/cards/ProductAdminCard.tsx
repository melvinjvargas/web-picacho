import Image from "next/image";
import { formatPrice } from "@/lib/utils";

interface ProductAdminCardProps {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  active: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProductAdminCard({
  id,
  name,
  image,
  category,
  price,
  active,
  onToggle,
  onDelete,
}: ProductAdminCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[#FAFAFA] p-3">
      <div className="relative mb-3 h-[140px] w-[196px] overflow-hidden rounded-md bg-border">
        <Image
          src={image}
          alt={name}
          fill
          sizes="196px"
          className="object-cover"
        />
      </div>
      <h3 className="text-sm font-semibold text-text-primary">{name}</h3>
      <p className="text-xs text-text-secondary">{category}</p>
      <p className="text-sm font-bold text-brand-green">{formatPrice(price)}</p>
      <div className="mt-3 flex items-center">
        <button
          type="button"
          onClick={() => onToggle(id)}
          className={`relative h-5 w-[36px] rounded-full transition ${active ? "bg-brand-green" : "bg-[#CCCCCC]"}`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${active ? "left-[18px]" : "left-0.5"}`}
          />
        </button>
      </div>
      <button
        type="button"
        onClick={() => onDelete(id)}
        className="mt-3 flex h-8 w-full items-center justify-center gap-1.5 rounded-md bg-bg-secondary transition hover:bg-status-pending"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4622A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <span className="text-xs font-medium text-accent-orange">Eliminar</span>
      </button>
    </div>
  );
}
