import { ColorCircle } from "@/components/ui/ColorCircle";
import type { ProductColor } from "@/types/product";

interface ColorSelectorProps {
  colors: ProductColor[];
  selected: ProductColor | null;
  onSelect: (color: ProductColor) => void;
}

export function ColorSelector({
  colors,
  selected,
  onSelect,
}: ColorSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium tracking-[0.15em] uppercase text-text-secondary">
        Color
      </span>
      <div className="flex gap-4">
        {colors.map((color) => (
          <ColorCircle
            key={color.hex}
            hex={color.hex}
            name={color.name}
            active={selected?.hex === color.hex}
            onClick={() => onSelect(color)}
          />
        ))}
      </div>
    </div>
  );
}
