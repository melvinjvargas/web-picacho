"use client";

import { usePathname } from "next/navigation";
import { CartProvider, useCart } from "@/context/CartContext";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { PromoBar } from "@/components/layout/PromoBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

function AppShell({ children }: { children: React.ReactNode }) {
  const { drawerOpen, closeDrawer } = useCart();
  const pathname = usePathname();

  if (pathname.startsWith("/login") || pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <PromoBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <AppShell>{children}</AppShell>
    </CartProvider>
  );
}
