"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductForm, type EditProductData } from "@/components/admin/forms/ProductForm";
import { createBrowserSupabase } from "@/lib/supabase";

export default function EditarProductoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<EditProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const loadProduct = useCallback(async () => {
    const supabase = createBrowserSupabase();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (!data) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    // Extract hex values from JSONB[] colors column
    const colorHexes = ((data.colors || []) as Array<{ hex: string }>).map(
      (c) => c.hex
    );

    setProduct({
      id: data.id,
      name: data.name,
      slug: data.slug,
      category: data.category,
      price: data.price,
      original_price: data.original_price ?? null,
      is_new: data.is_new,
      is_active: data.is_active,
      design_description: data.design_description,
      images: data.images || [],
      sizes: data.sizes || [],
      colors: colorHexes,
    });
    setLoading(false);
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProduct();
  }, [loadProduct]);

  function handleSuccess() {
    router.push("/admin/productos");
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-semibold text-text-primary">
          Cargando...
        </h1>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="space-y-6">
        <h1 className="font-heading text-2xl font-semibold text-text-primary">
          Producto no encontrado.
        </h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl font-semibold text-text-primary">
        Editar producto
      </h1>
      <ProductForm product={product} onSuccess={handleSuccess} />
    </div>
  );
}
