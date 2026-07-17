"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { ImageUploader } from "@/components/admin/upload/ImageUploader";
import { ProductBasicFields } from "./_components/ProductBasicFields";
import { ProductVariantFields } from "./_components/ProductVariantFields";
import { Card, Field, inp } from "./_components/FormHelpers";

const productSchema = z.object({
  name: z.string().min(1, { error: "Requerido." }),
  slug: z.string().optional(),
  category: z.string().min(1, { error: "Requerido." }),
  price: z.coerce.number().min(1, { error: "Debe ser mayor a 0." }),
  original_price: z.coerce.number().optional(),
  is_new: z.boolean().optional(),
  active: z.boolean().optional(),
  design_description: z.string().optional(),
});

type ProductFormInput = z.input<typeof productSchema>;
type ProductFormOutput = z.output<typeof productSchema>;

const CATEGORIES = ["camping", "senderismo", "escalada", "trail", "naturaleza", "fauna", "rios", "montanismo"];
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export interface EditProductData {
  id: string;
  name: string;
  slug?: string;
  category: string;
  price: number;
  original_price?: number | null;
  is_new?: boolean;
  is_active: boolean;
  design_description?: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
}

interface ProductFormProps {
  onSuccess?: () => void;
  product?: EditProductData;
}

export function ProductForm({ onSuccess, product }: ProductFormProps) {
  const isEdit = !!product;
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [sizes, setSizes] = useState<string[]>(product?.sizes || []);
  const [colors, setColors] = useState<string[]>(product?.colors?.length ? product.colors : ["#111111"]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<
    ProductFormInput, unknown, ProductFormOutput
  >({
    resolver: zodResolver(productSchema),
    defaultValues: {
      active: product ? product.is_active : true,
      name: product?.name || "",
      slug: product?.slug || "",
      category: product?.category || "",
      price: product?.price,
      original_price: product?.original_price ?? undefined,
      is_new: product?.is_new || false,
      design_description: product?.design_description || "",
    },
  });
  // eslint-disable-next-line react-hooks/incompatible-library
  const active = watch("active") ?? true;

  function toggleSize(s: string) { setSizes((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]); }
  function addColor() { setColors((p) => [...p, "#000000"]); }
  function updateColor(i: number, h: string) { setColors((p) => p.map((c, j) => j === i ? h : c)); }
  function removeColor(i: number) { setColors((p) => p.filter((_, j) => j !== i)); }

  async function onSubmit(data: ProductFormOutput) {
    setSubmitting(true);
    setSuccess("");

    if (images.length === 0) {
      alert("Debes subir al menos una imagen.");
      setSubmitting(false);
      return;
    }
    if (images.length > 5) {
      alert("Máximo 5 imágenes permitidas.");
      setSubmitting(false);
      return;
    }

    const payload = {
      name: data.name,
      category: data.category,
      price: data.price,
      original_price: data.original_price || null,
      is_new: data.is_new || false,
      is_active: data.active ?? true,
      images,
      sizes,
      colors,
      design_description: data.design_description || "",
    };

    if (isEdit && product) {
      const result = await updateProduct(product.id, payload);
      if (!result.success) { alert("Error: " + result.error); setSubmitting(false); return; }
      setSuccess("Producto actualizado.");
      setSubmitting(false);
      setTimeout(() => { setSuccess(""); onSuccess?.(); }, 1000);
    } else {
      const result = await createProduct(payload);
      if (!result.success) { alert("Error: " + result.error); setSubmitting(false); return; }
      setSuccess("Producto creado.");
      reset(); setImages([]); setSizes([]); setColors(["#111111"]); setSubmitting(false);
      setTimeout(() => { setSuccess(""); onSuccess?.(); }, 1000);
    }
  }

  const submitDraft = handleSubmit((data) => onSubmit({ ...data, active: false }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-[1fr_360px] gap-x-8 gap-y-6">
        <div className="row-span-2">
          <ProductBasicFields
            register={register}
            nameError={errors.name?.message}
            descError={errors.design_description?.message}
            categoryError={errors.category?.message}
            categories={CATEGORIES}
          />
        </div>

        <Card title="Estado">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-primary">Publicado</span>
            <button type="button" onClick={() => setValue("active", !active)}
              className={`relative h-6 w-11 rounded-xl transition ${active ? "bg-brand-green" : "bg-[#CCCCCC]"}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${active ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        </Card>

        <Card title="Precio">
          <Field label="" error={errors.price?.message}>
            <div className="flex h-12 items-center rounded-md border border-border bg-[#F8F8F8] px-4">
              <span className="mr-2 text-sm text-text-secondary">L.</span>
              <input type="number" step="0.01" {...register("price")} className="flex-1 bg-transparent text-sm outline-none" />
            </div>
          </Field>
          <Field label="Precio original" error={errors.original_price?.message}>
            <input type="number" step="0.01" {...register("original_price")} placeholder="L. 0.00" className={inp()} />
          </Field>
        </Card>

        <Card title="Multimedia">
          <ImageUploader value={images} onChange={setImages} max={5} />
        </Card>

        <ProductVariantFields
          sizes={sizes}
          allSizes={ALL_SIZES}
          colors={colors}
          onToggleSize={toggleSize}
          onAddColor={addColor}
          onUpdateColor={updateColor}
          onRemoveColor={removeColor}
        />
      </div>

      {success && <p className="mt-6 rounded-lg bg-[#E8F0E9] px-4 py-2 text-sm text-brand-green">{success}</p>}

      <div className="sticky bottom-0 z-10 mt-8 flex h-16 items-center justify-between border-t border-border bg-[#FAFAFA] px-8">
        <button type="button" onClick={submitDraft} disabled={submitting}
          className="h-11 rounded-md border border-border bg-white px-5 text-sm text-text-primary transition hover:bg-bg-secondary">
          Guardar borrador
        </button>
        <button type="submit" disabled={submitting}
          className="h-11 rounded-md bg-brand-green px-5 text-sm font-semibold text-white transition hover:bg-brand-green/90 disabled:opacity-50">
          {submitting ? "Guardando..." : isEdit ? "Guardar cambios" : "Publicar"}
        </button>
      </div>
    </form>
  );
}
