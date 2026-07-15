"use client";

import { useState } from "react";

export function PromoBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="bg-brand-green text-white">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center px-4 text-xs font-medium sm:text-sm">
        <span>Envío gratis a toda Honduras en pedidos +L.500</span>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="ml-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Cerrar aviso"
        >
          <svg
            width={12}
            height={12}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
