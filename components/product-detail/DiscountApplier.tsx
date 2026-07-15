"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface DiscountApplierProps {
  onApply: (code: string) => void;
  message: string | null;
  isApplied: boolean;
}

export function DiscountApplier({
  onApply,
  message,
  isApplied,
}: DiscountApplierProps) {
  const [input, setInput] = useState("");

  function handleApply() {
    if (input.trim()) {
      onApply(input.trim());
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Código de descuento"
          disabled={isApplied}
          className="flex-1 h-11 rounded-md border border-border bg-white px-3 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-text-primary disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={isApplied || !input.trim()}
          className="h-11 rounded-md bg-text-primary px-4 text-sm font-medium text-white hover:bg-text-primary/90 disabled:opacity-50 transition-colors"
        >
          Aplicar
        </button>
      </div>
      {message && (
        <p
          className={cn(
            "text-xs font-medium",
            isApplied ? "text-brand-green" : "text-accent-orange",
          )}
        >
          {message}
        </p>
      )}
    </div>
  );
}
