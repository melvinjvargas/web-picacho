import { cn } from "@/lib/utils";

interface UploadZoneProps {
  isFull: boolean;
  uploading: boolean;
  max: number;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onDrop?: (e: React.DragEvent) => Promise<void>;
  onDragOver?: (e: React.DragEvent) => void;
}

export function UploadZone({ isFull, uploading, max, onFileSelect, onDrop, onDragOver }: UploadZoneProps) {
  const disabled = isFull || uploading;

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
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
        disabled={disabled}
      />
      <label
        htmlFor="image-upload"
        className={cn(
          "cursor-pointer text-center",
          disabled && "cursor-not-allowed",
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
  );
}
