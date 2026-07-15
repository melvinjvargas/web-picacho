import { cn } from "@/lib/utils";

type StatusVariant =
  | "completed"
  | "completado"
  | "pending"
  | "pendiente"
  | "shipped"
  | "enviado"
  | "en_proceso"
  | "devolucion"
  | "inactive"
  | "inactivo"
  | "active"
  | "activo"
  | "cancelado"
  | "canceled"
  | "default";

const styles: Record<StatusVariant, string> = {
  completed: "bg-[#E8F0E9] text-[#2D4A32]",
  completado: "bg-[#E8F0E9] text-[#2D4A32]",
  pending: "bg-[#FFF0E5] text-[#C4622A]",
  pendiente: "bg-[#FFF0E5] text-[#C4622A]",
  shipped: "bg-[#E3F2FD] text-[#1976D2]",
  enviado: "bg-[#E3F2FD] text-[#1976D2]",
  en_proceso: "bg-[#FEF3C7] text-[#D97706]",
  devolucion: "bg-[#E3F2FD] text-[#1976D2]",
  inactive: "bg-[#F5F4F0] text-[#6B6B6B]",
  inactivo: "bg-[#F5F4F0] text-[#6B6B6B]",
  active: "bg-[#E8F0E9] text-[#2D4A32]",
  activo: "bg-[#E8F0E9] text-[#2D4A32]",
  cancelado: "bg-[#F5F4F0] text-[#6B6B6B]",
  canceled: "bg-[#F5F4F0] text-[#6B6B6B]",
  default: "bg-[#F5F4F0] text-[#6B6B6B]",
};

const labels: Record<string, string> = {
  completed: "Completado",
  completado: "Completado",
  pending: "Pendiente",
  pendiente: "Pendiente",
  shipped: "Enviado",
  enviado: "Enviado",
  en_proceso: "En proceso",
  devolucion: "Devolución",
  inactive: "Inactivo",
  inactivo: "Inactivo",
  active: "Activo",
  activo: "Activo",
  cancelado: "Cancelado",
  canceled: "Cancelado",
};

interface StatusChipProps {
  status: string;
}

export function StatusChip({ status }: StatusChipProps) {
  const variant =
    (status as StatusVariant) in styles ? (status as StatusVariant) : "default";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3 py-0.5 text-xs font-medium",
        styles[variant],
      )}
      style={{ minWidth: 96, height: 28 }}
    >
      {labels[status] || status}
    </span>
  );
}
