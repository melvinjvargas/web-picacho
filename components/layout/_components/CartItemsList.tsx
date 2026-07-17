import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/context/CartContext";

interface CartItemsListProps {
  items: CartItem[];
  onRemove: (productId: string) => void;
  onClose: () => void;
}

export function CartItemsList({ items, onRemove, onClose }: CartItemsListProps) {
  if (items.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-sm text-text-muted">Tu cesta está vacía</p>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 text-sm font-medium text-brand-green hover:underline"
          >
            Seguir comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4">
      <ul className="flex flex-col gap-4">
        {items.map((item) => (
          <li
            key={`${item.product.id}-${item.size}-${item.color?.hex}`}
            className="flex gap-3 border-b border-border pb-4"
          >
            {/* Thumbnail */}
            <div className="h-20 w-20 shrink-0 rounded-md bg-bg-secondary flex items-center justify-center">
              <span className="text-[10px] text-text-muted">img</span>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <p className="text-sm font-semibold text-text-primary truncate">
                {item.product.name}
              </p>
              {item.size && (
                <p className="text-xs text-text-secondary">Talla: {item.size}</p>
              )}
              {item.color && (
                <p className="text-xs text-text-secondary">Color: {item.color.name}</p>
              )}
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-bold text-text-primary">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
                <span className="text-xs text-text-muted">x{item.quantity}</span>
              </div>
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() => onRemove(item.product.id)}
              className="self-start p-1 text-text-muted hover:text-accent-orange transition-colors"
            >
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
