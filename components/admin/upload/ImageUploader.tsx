"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function sanitizeFilename(name: string): string {
  const dotIndex = name.lastIndexOf(".");
  const ext = dotIndex >= 0 ? name.slice(dotIndex) : "";
  const base = dotIndex >= 0 ? name.slice(0, dotIndex) : name;
  const clean = base
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase()
    .slice(0, 100);
  return `${clean}${ext.toLowerCase()}`;
}

function isValidImageFile(file: File): boolean {
  if (!file.type.startsWith("image/")) return false;
  const ext = file.name.split(".").pop()?.toLowerCase();
  const validExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
  if (!ext || !validExtensions.includes(ext)) return false;
  return true;
}

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}

export function ImageUploader({ value, onChange, max = 5 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Refs to avoid stale closure in useCallback handlers
  const valueRef = useRef(value);
  const maxRef = useRef(max);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    valueRef.current = value;
  });
  useEffect(() => {
    maxRef.current = max;
  });
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  async function uploadFiles(files: File[]) {
    const currentValue = valueRef.current;
    const currentMax = maxRef.current;
    const remaining = currentMax - currentValue.length;
    const toUpload = files.slice(0, remaining);
    if (toUpload.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const { createBrowserSupabase } = await import("@/lib/supabase");
      const supabase = createBrowserSupabase();
      const urls: string[] = [];
      let firstError: string | null = null;

      for (const file of toUpload) {
        // Validate file size before uploading
        if (file.size > MAX_FILE_SIZE) {
          firstError =
            firstError ||
            `"${file.name}" supera el límite de 5MB.`;
          continue;
        }

        const name = `${Date.now()}-${sanitizeFilename(file.name)}`;
        const { data, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(name, file);

        if (uploadError || !data) {
          firstError =
            firstError ||
            uploadError?.message ||
            `Error al subir "${file.name}".`;
          continue;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("product-images").getPublicUrl(data.path);
        urls.push(publicUrl);
      }

      if (urls.length > 0) {
        onChangeRef.current([...currentValue, ...urls]);
      }

      if (firstError) {
        setError(firstError);
      }
    } finally {
      setUploading(false);
    }
  }

  const uploadFilesRef = useRef(uploadFiles);
  useEffect(() => {
    uploadFilesRef.current = uploadFiles;
  });

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(isValidImageFile);
    if (files.length === 0) return;
    await uploadFilesRef.current(files);
  }, []);

  const onFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter(isValidImageFile);
      if (files.length === 0) return;
      await uploadFilesRef.current(files);
      // Reset input value so the same file can be selected again
      e.target.value = "";
    },
    [],
  );

  function handleDragStart(e: React.DragEvent<HTMLDivElement>, index: number) {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>, dropIndex: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) return;
    const newValue = [...value];
    const [removed] = newValue.splice(dragIndex, 1);
    newValue.splice(dropIndex, 0, removed);
    onChange(newValue);
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function removeImage(index: number) {
    onChange(value.filter((_, i) => i !== index));
    setError(null);
  }

  const isFull = value.length >= max;

  return (
    <div>
      <div
        onDrop={isFull ? undefined : onDrop}
        onDragOver={isFull ? undefined : (e) => e.preventDefault()}
        className={cn(
          "mb-3 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition",
          isFull
            ? "cursor-not-allowed border-border bg-bg-secondary/50 opacity-50"
            : "border-border hover:border-brand-green",
        )}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onFileSelect}
          className="hidden"
          id="image-upload"
          disabled={isFull || uploading}
        />
        <label
          htmlFor="image-upload"
          className={cn(
            "cursor-pointer text-center",
            (isFull || uploading) && "cursor-not-allowed",
          )}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mx-auto mb-2 text-text-secondary"
          >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          <p className="text-sm text-text-secondary">
            {uploading
              ? "Subiendo..."
              : isFull
                ? `Máximo ${max} imágenes alcanzado`
                : `Arrastra imágenes o haz clic (max ${max})`}
          </p>
        </label>
      </div>

      {error && (
        <p className="mb-3 text-sm text-red-600">{error}</p>
      )}

      {value.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {value.map((url, i) => (
            <div
              key={url}
              draggable
              onDragStart={(e) => handleDragStart(e, i)}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
              onDragEnter={(e) => { e.preventDefault(); setDragOverIndex(i); }}
              onDragLeave={() => setDragOverIndex(null)}
              onDrop={(e) => handleDrop(e, i)}
              onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
              className={cn(
                "relative shrink-0 cursor-grab rounded-lg transition",
                dragIndex === i && "opacity-30",
                dragOverIndex === i && dragIndex !== i && "ring-2 ring-brand-green ring-offset-1",
              )}
            >
              <Image
                src={url}
                alt={`Imagen ${i + 1}`}
                width={64}
                height={64}
                className="rounded-lg object-cover"
                draggable={false}
              />
              {/* Drag handle — top-left */}
              <div className="absolute left-0.5 top-0.5 flex h-4 w-4 cursor-grab items-center justify-center rounded-tl-md rounded-br bg-black/40 text-white/90">
                <svg width="8" height="7" viewBox="0 0 8 7" fill="currentColor">
                  <rect width="8" height="1.4" rx="0.7" />
                  <rect y="2.8" width="8" height="1.4" rx="0.7" />
                  <rect y="5.6" width="8" height="1.4" rx="0.7" />
                </svg>
              </div>
              {/* Remove button — top-right */}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
