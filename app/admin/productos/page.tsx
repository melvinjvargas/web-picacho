"use client";

import { ProductForm } from "@/components/admin/forms/ProductForm";

export default function ProductosPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-semibold text-text-primary">
        Nuevo producto
      </h1>
      <ProductForm />
    </div>
  );
}
