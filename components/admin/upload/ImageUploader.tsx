"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sanitizeFilename, isValidImageFile, MAX_FILE_SIZE } from "./_components/utils";
import { UploadZone } from "./_components/UploadZone";
import { ThumbnailList } from "./_components/ThumbnailList";

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
      <UploadZone
        isFull={isFull}
        uploading={uploading}
        max={max}
        onFileSelect={onFileSelect}
        onDrop={isFull ? undefined : onDrop}
        onDragOver={isFull ? undefined : (e) => e.preventDefault()}
      />

      {error && (
        <p className="mb-3 text-sm text-red-600">{error}</p>
      )}

      {value.length > 0 && (
        <ThumbnailList
          images={value}
          dragIndex={dragIndex}
          dragOverIndex={dragOverIndex}
          onDragStart={handleDragStart}
          onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }}
          onDragEnter={(e, i) => { e.preventDefault(); setDragOverIndex(i); }}
          onDragLeave={() => setDragOverIndex(null)}
          onDrop={handleDrop}
          onRemove={removeImage}
        />
      )}
    </div>
  );
}
