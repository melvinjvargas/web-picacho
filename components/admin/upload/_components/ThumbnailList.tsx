import Image from "next/image";
import { cn } from "@/lib/utils";

interface ThumbnailListProps {
  images: string[];
  dragIndex: number | null;
  dragOverIndex: number | null;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onRemove: (index: number) => void;
}

export function ThumbnailList({
  images,
  dragIndex,
  dragOverIndex,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onRemove,
}: ThumbnailListProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {images.map((url, i) => (
        <div
          key={url}
          draggable
          onDragStart={(e) => onDragStart(e, i)}
          onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; onDragOver(e); }}
          onDragEnter={(e) => { e.preventDefault(); onDragEnter(e, i); }}
          onDragLeave={onDragLeave}
          onDrop={(e) => onDrop(e, i)}
          onDragEnd={onDragEnd}
          className={cn(
            "relative h-20 w-20 shrink-0 cursor-grab rounded-lg transition",
            dragIndex === i && "opacity-30",
            dragOverIndex === i && dragIndex !== i && "ring-2 ring-brand-green ring-offset-1",
          )}
        >
          <Image
            src={url}
            alt={`Imagen ${i + 1}`}
            width={80}
            height={80}
            className="h-full w-full rounded-lg object-cover"
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
            onClick={() => onRemove(i)}
            className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white text-xs hover:bg-red-600"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
