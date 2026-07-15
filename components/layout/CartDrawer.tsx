"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { submitOrderAndGetWhatsAppUrl } from "@/services/checkoutService";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const [step, setStep] = useState<"cart" | "form">("cart");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  async function handleCheckout() {
    setError("");

    if (!name.trim()) {
      setError("Ingresá tu nombre.");
      return;
    }
    if (!phone.trim()) {
      setError("Ingresá tu teléfono.");
      return;
    }

    setSending(true);
    try {
      const url = await submitOrderAndGetWhatsAppUrl(name.trim(), phone.trim(), items);
      clearCart();
      setStep("cart");
      setName("");
      setPhone("");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      setError("Error al procesar el pedido. Intentá de nuevo.");
    } finally {
      setSending(false);
    }
  }

  function handleClose() {
    setStep("cart");
    setError("");
    setName("");
    setPhone("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      {/* Drawer */}
      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-heading text-lg font-bold text-text-primary">
            {step === "cart" ? `Tu cesta (${totalItems})` : "Tus datos"}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-bg-secondary transition-colors"
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm text-text-muted">Tu cesta está vacía</p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 text-sm font-medium text-brand-green hover:underline"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
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
                    onClick={() => removeItem(item.product.id)}
                    className="self-start p-1 text-text-muted hover:text-accent-orange transition-colors"
                  >
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 flex flex-col gap-3">
            {step === "cart" ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-secondary">Total</span>
                  <span className="font-heading text-lg font-bold text-text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="flex items-center justify-center gap-2 rounded-md bg-brand-green py-3 text-sm font-semibold text-white hover:bg-brand-green/90 transition-colors"
                >
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M3 21l1.65-3.8a9.63 9.63 0 1112.7-12.7A9.63 9.63 0 013 21z" />
                  </svg>
                  Comprar por WhatsApp
                </button>

                <button
                  type="button"
                  onClick={clearCart}
                  className="text-center text-xs text-text-muted hover:text-accent-orange transition-colors"
                >
                  Vaciar cesta
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => { setStep("cart"); setError(""); }}
                  className="self-start text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  ← Volver
                </button>

                <div className="flex flex-col gap-2">
                  <div>
                    <label className="mb-1 block text-xs text-text-secondary">Nombre</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-brand-green"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-text-secondary">Teléfono</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                    onClick={handleCheckout}
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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
