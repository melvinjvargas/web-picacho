"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems, openDrawer } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="font-heading text-xl font-bold text-brand-green">
            {SITE.name}
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#catalogo"
            className="text-sm font-bold text-[#f92b89] hover:underline"
          >
            Ofertas
          </Link>
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button type="button" className="p-2 text-text-secondary hover:text-text-primary transition-colors">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx={11} cy={11} r={8} />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>

          {/* Favorites */}
          <button type="button" className="hidden sm:block p-2 text-text-secondary hover:text-text-primary transition-colors">
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>

          {/* Cart */}
          <button
            type="button"
            onClick={openDrawer}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors relative"
          >
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 -mr-2"
            aria-label="Abrir menú"
          >
            <Icon name="menu" size={24} />
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="font-heading text-lg font-bold text-brand-green">
              {SITE.name}
            </span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="p-2"
              aria-label="Cerrar menú"
            >
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-base font-medium text-text-primary hover:bg-bg-secondary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#catalogo"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-3 text-base font-bold text-[#f92b89]"
            >
              Ofertas
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
