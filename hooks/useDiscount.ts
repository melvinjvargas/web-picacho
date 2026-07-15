"use client";

import { useState } from "react";

interface DiscountState {
  code: string;
  isApplied: boolean;
  discountAmount: number;
  message: string | null;
}

const VALID_DISCOUNTS: Record<string, number> = {
  VERANO20: 20,
  PICACHO10: 10,
  MONTANA15: 15,
};

export function useDiscount(productPrice: number) {
  const [state, setState] = useState<DiscountState>({
    code: "",
    isApplied: false,
    discountAmount: 0,
    message: null,
  });

  function applyDiscount(code: string) {
    const upperCode = code.toUpperCase().trim();
    const percentage = VALID_DISCOUNTS[upperCode];

    if (percentage !== undefined) {
      const amount = (productPrice * percentage) / 100;
      setState({
        code: upperCode,
        isApplied: true,
        discountAmount: amount,
        message: `✓ ${upperCode} aplicado — L.${amount.toFixed(2)} de descuento`,
      });
    } else {
      setState({
        code: upperCode,
        isApplied: false,
        discountAmount: 0,
        message: "Código no válido",
      });
    }
  }

  function clearDiscount() {
    setState({ code: "", isApplied: false, discountAmount: 0, message: null });
  }

  return { ...state, applyDiscount, clearDiscount };
}
