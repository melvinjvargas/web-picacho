"use client";

interface OrderRow {
  id: string;
  status: string;
}

interface Props {
  orders: OrderRow[];
}

const STATUS_CARDS = [
  {
    status: "pendiente",
    label: "Pendientes",
    color: "#DC2626",
    bg: "#FEE2E2",
    icon: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    status: "en_proceso",
    label: "En proceso",
    color: "#D97706",
    bg: "#FEF3C7",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    status: "completado",
    label: "Completados",
    color: "#2D4A32",
    bg: "#E8F0E9",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    status: "devolucion",
    label: "Devoluciones",
    color: "#1976D2",
    bg: "#E3F2FD",
    icon: "M3 4h1m0 16h1m8-16h1m0 16h1M7 4h1m0 16h1m4-16h1m0 16h1",
  },
];

export function RecentOrders({ orders }: Props) {
  const counts: Record<string, number> = {};
  for (const o of orders) {
    counts[o.status] = (counts[o.status] || 0) + 1;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          Pedidos
        </h2>
        <a
          href="/admin/pedidos"
          className="text-xs font-medium text-brand-green hover:underline"
        >
          Ver todos →
        </a>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {STATUS_CARDS.map((card) => {
          const count = counts[card.status] || 0;
          return (
            <a
              key={card.status}
              href={`/admin/pedidos?status=${card.status}`}
              className="rounded-xl border border-border px-6 py-10 transition hover:shadow-sm hover:border-text-secondary"
              style={{ backgroundColor: card.bg }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={card.color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={card.icon} />
                  </svg>
                </div>
                <div>
                  <p
                    className="text-[32px] font-bold leading-tight"
                    style={{ color: card.color }}
                  >
                    {count}
                  </p>
                  <p className="text-xs font-medium text-text-secondary">
                    {card.label}
                  </p>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
