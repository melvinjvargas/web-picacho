export const ORDER_STATUS = {
  pendiente: {
    bg: "#FEE2E2",
    text: "#DC2626",
    label: "Pendiente",
  },
  en_proceso: {
    bg: "#FEF3C7",
    text: "#D97706",
    label: "En proceso",
  },
  completado: {
    bg: "#E8F0E9",
    text: "#2D4A32",
    label: "Completado",
  },
  devolucion: {
    bg: "#E3F2FD",
    text: "#1976D2",
    label: "Devolución",
  },
} as const;

export type OrderStatusKey = keyof typeof ORDER_STATUS;
