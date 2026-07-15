"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createBrowserSupabase } from "@/lib/supabase";
import { deleteProduct as deleteProductAction, toggleProductActive } from "@/lib/actions/products";
import { ConfirmModal } from "@/components/admin/feedback/ConfirmModal";
import type { Database } from "@/lib/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export default function InventarioPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [filter, setFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  async function load() {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    setProducts(data || []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  async function toggleActive(id: string, current: boolean) {
    const result = await toggleProductActive(id, current);
    if (result.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_active: !current } : p)),
      );
    }
  }

  async function deleteProduct(id: string) {
    setDeleteTarget(id);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    const result = await deleteProductAction(deleteTarget);
    if (result.success) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget));
    }
    setDeleteTarget(null);
  }

  const filtered =
    filter === "all"
      ? products
      : products.filter((p) => (filter === "active" ? p.is_active : !p.is_active));

  function generateSku(p: ProductRow) {
    const shortId = p.id.substring(0, 3).toUpperCase();
    const firstSize = p.sizes?.[0] || "STD";
    const firstColor = p.colors?.[0]?.name || "STD";
    const colorShort = typeof firstColor === "string" && firstColor.length > 4 ? firstColor.substring(0, 4) : String(firstColor);
    return `PIC-${shortId}-${firstSize}-${colorShort}`;
  }

  function getColorName(p: ProductRow) {
    const c = p.colors?.[0];
    if (!c) return "Único";
    return String(c.name) || "Único";
  }

  const filterChips = [
    { label: "Todos", value: "all" },
    { label: "Activos", value: "active" },
    { label: "Inactivos", value: "inactive" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold text-text-primary">
        Inventario
      </h1>

      <div className="flex gap-3">
        {filterChips.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className="inline-flex items-center rounded-full px-4 py-2 text-[13px] font-medium transition"
            style={{
              backgroundColor: filter === f.value ? "#111111" : "#F5F4F0",
              color: filter === f.value ? "#FFFFFF" : "#111111",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F5F4F0]">
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 200 }}>
                Producto
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 120 }}>
                Categoría
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 140 }}>
                SKU
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 60 }}>
                Talla
              </th>
              <th className="h-12 px-4 text-left text-[13px] font-semibold text-text-primary" style={{ width: 80 }}>
                Color
              </th>
              <th className="h-12 px-4 text-center text-[13px] font-semibold text-text-primary" style={{ width: 100 }}>
                Estado
              </th>
              <th className="h-12 px-4 text-center text-[13px] font-semibold text-text-primary" style={{ width: 120 }}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => {
              const thumb = product.images?.[0] || "";
              return (
                <tr
                  key={product.id}
                  className="h-12 border-t border-border transition hover:bg-bg-secondary/50"
                >
                  <td className="px-4 text-sm" style={{ width: 200 }}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-bg-secondary">
                        {thumb ? (
                          <Image
                            src={thumb}
                            alt=""
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <span className="text-sm text-text-primary">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 text-sm text-text-primary" style={{ width: 120 }}>
                    {product.category}
                  </td>
                  <td className="px-4 text-sm text-text-secondary" style={{ width: 140 }}>
                    {generateSku(product)}
                  </td>
                  <td className="px-4 text-sm text-text-primary" style={{ width: 60 }}>
                    {product.sizes?.[0] || "STD"}
                  </td>
                  <td className="px-4 text-sm text-text-primary" style={{ width: 80 }}>
                    {getColorName(product)}
                  </td>
                  <td className="px-4 text-center" style={{ width: 100 }}>
                    <button
                      type="button"
                      onClick={() => toggleActive(product.id, product.is_active)}
                      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200"
                      style={{
                        backgroundColor: product.is_active ? "#2D4A32" : "#E8E8E8",
                      }}
                    >
                      <span
                        className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200"
                        style={{
                          margin: 2,
                          transform: product.is_active ? "translateX(20px)" : "translateX(0)",
                        }}
                      />
                    </button>
                  </td>
                  <td className="px-4" style={{ width: 120 }}>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => router.push(`/admin/productos/${product.id}/editar`)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F0E9] text-brand-green transition hover:opacity-80"
                        title="Editar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(product.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5F4F0] text-accent-orange transition hover:opacity-80"
                        title="Eliminar"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-text-secondary">
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Eliminar producto"
        message="¿Estás seguro de que querés eliminar este producto? Esta acción no se puede deshacer."
      />
    </div>
  );
}
