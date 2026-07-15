import { SizeButton } from "@/components/ui/SizeButton";
import type { SizeLabel } from "@/types/product";

interface SizeSelectorProps {
  sizes: SizeLabel[];
  selected: SizeLabel | null;
  onSelect: (size: SizeLabel) => void;
}

export function SizeSelector({
  sizes,
  selected,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium tracking-[0.15em] uppercase text-text-secondary">
        Talla
      </span>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <SizeButton
            key={size}
            label={size}
            active={selected === size}
            onClick={() => onSelect(size)}
          />
        ))}
      </div>
    </div>
  );
}
