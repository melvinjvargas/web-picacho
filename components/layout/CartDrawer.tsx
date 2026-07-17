"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { submitOrderAndGetWhatsAppUrl } from "@/services/checkoutService";
import { CartItemsList } from "./_components/CartItemsList";
import { CartCheckoutSection } from "./_components/CartCheckoutSection";

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
        <CartItemsList items={items} onRemove={removeItem} onClose={handleClose} />

        {/* Footer */}
        {items.length > 0 && (
          <CartCheckoutSection
            totalPrice={totalPrice}
            step={step}
            name={name}
            phone={phone}
            sending={sending}
            error={error}
            onSetStep={setStep}
            onSetName={setName}
            onSetPhone={setPhone}
            onCheckout={handleCheckout}
            onClearCart={clearCart}
            onClearError={() => setError("")}
          />
        )}
      </div>
    </div>
  );
}
