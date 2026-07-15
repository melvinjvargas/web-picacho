"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Inicio" },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/inventario", label: "Inventario" },
  { href: "/admin/descuentos", label: "Descuentos" },
  { href: "/admin/informes", label: "Informes" },
];

interface Props {
  onClose: () => void;
}

export function AdminSidebar({ onClose }: Props) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col bg-[#FAFAFA]">
      <div className="flex items-center justify-between px-6 py-5">
        <div>
          <span className="font-heading text-xl font-bold text-text-primary">
            PICACHO
          </span>
          <span className="text-xs text-text-secondary ml-1">Admin</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#F0F0F0] transition-colors lg:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose()}
              className={cn(
                "flex items-center rounded-md px-3 py-2.5 text-sm transition",
                active
                  ? "bg-[#E8F0E9] font-semibold text-brand-green"
                  : "font-normal text-text-secondary hover:bg-[#F0F0F0] hover:text-text-primary",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-3 py-3">
        <button
          type="button"
          onClick={async () => {
            const { createBrowserSupabase } = await import("@/lib/supabase");
            const supabase = createBrowserSupabase();
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm text-text-secondary transition hover:bg-[#F0F0F0] hover:text-text-primary"
        >
          Salir
        </button>
      </div>
    </aside>
  );
}
