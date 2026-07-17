import { formatPrice } from "@/lib/utils";

interface CartCheckoutSectionProps {
  totalPrice: number;
  step: "cart" | "form";
  name: string;
  phone: string;
  sending: boolean;
  error: string;
  onSetStep: (step: "cart" | "form") => void;
  onSetName: (name: string) => void;
  onSetPhone: (phone: string) => void;
  onCheckout: () => Promise<void>;
  onClearCart: () => void;
  onClearError: () => void;
}

export function CartCheckoutSection({
  totalPrice,
  step,
  name,
  phone,
  sending,
  error,
  onSetStep,
  onSetName,
  onSetPhone,
  onCheckout,
  onClearCart,
  onClearError,
}: CartCheckoutSectionProps) {
  if (step === "cart") {
    return (
      <div className="border-t border-border px-5 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-text-secondary">Total</span>
          <span className="font-heading text-lg font-bold text-text-primary">
            {formatPrice(totalPrice)}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSetStep("form")}
          className="flex items-center justify-center gap-2 rounded-md bg-brand-green py-3 text-sm font-semibold text-white hover:bg-brand-green/90 transition-colors"
        >
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M3 21l1.65-3.8a9.63 9.63 0 1112.7-12.7A9.63 9.63 0 013 21z" />
          </svg>
          Comprar por WhatsApp
        </button>

        <button
          type="button"
          onClick={onClearCart}
          className="text-center text-xs text-text-muted hover:text-accent-orange transition-colors"
        >
          Vaciar cesta
        </button>
      </div>
    );
  }

  // Step === "form"
  return (
    <div className="border-t border-border px-5 py-4 flex flex-col gap-3">
      <button
        type="button"
        onClick={() => { onSetStep("cart"); onClearError(); }}
        className="self-start text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        ← Volver
      </button>

      <div className="flex flex-col gap-2">
        <div>
          <label className="mb-1 block text-xs text-text-secondary">Nombre</label>
          <input
            value={name}
            onChange={(e) => onSetName(e.target.value)}
            placeholder="Tu nombre"
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand-green"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-text-secondary">Teléfono</label>
          <input
            value={phone}
            onChange={(e) => onSetPhone(e.target.value)}
            placeholder="+504 9999-9999"
            type="tel"
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand-green"
          />
        </div>

        {error && (
          <p className="text-xs text-danger">{error}</p>
        )}

        <div className="flex items-center justify-between mt-1">
          <span className="text-sm font-medium text-text-secondary">Total</span>
          <span className="font-heading text-lg font-bold text-text-primary">
            {formatPrice(totalPrice)}
          </span>
        </div>

        <button
          type="button"
          onClick={onCheckout}
          disabled={sending}
          className="mt-1 flex items-center justify-center gap-2 rounded-md bg-brand-green py-3 text-sm font-semibold text-white hover:bg-brand-green/90 transition-colors disabled:opacity-50"
        >
          {sending ? (
            "Procesando..."
          ) : (
            <>
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 21l1.65-3.8a9.63 9.63 0 1112.7-12.7A9.63 9.63 0 013 21z" />
              </svg>
              Enviar pedido
            </>
          )}
        </button>
      </div>
    </div>
  );
}
