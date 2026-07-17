import { cn } from "@/lib/utils";
import { Card } from "./FormHelpers";

interface ProductVariantFieldsProps {
  sizes: string[];
  allSizes: string[];
  colors: string[];
  onToggleSize: (s: string) => void;
  onAddColor: () => void;
  onUpdateColor: (i: number, h: string) => void;
  onRemoveColor: (i: number) => void;
}

export function ProductVariantFields({
  sizes,
  allSizes,
  colors,
  onToggleSize,
  onAddColor,
  onUpdateColor,
  onRemoveColor,
}: ProductVariantFieldsProps) {
  return (
    <Card title="Variantes">
      <div>
        <label className="mb-2 block text-sm text-text-secondary">Tallas</label>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((s) => (
            <button key={s} type="button" onClick={() => onToggleSize(s)}
              className={cn("rounded-lg border px-4 py-2 text-sm font-medium transition",
                sizes.includes(s) ? "border-brand-green bg-[#E8F0E9] text-brand-green" : "border-border text-text-secondary")}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-2 block text-sm text-text-secondary">Colores</label>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="flex h-9 items-center gap-3 bg-[#F8F8F8] px-3 text-xs uppercase text-text-secondary">
            <span className="w-8">Color</span><span>Código</span>
          </div>
          {colors.map((hex, i) => (
            <div key={i} className="flex h-10 items-center gap-3 border-t border-border px-3">
              <input type="color" value={hex} onChange={(e) => onUpdateColor(i, e.target.value)} className="h-6 w-8 cursor-pointer rounded border-0" />
              <input type="text" value={hex} onChange={(e) => onUpdateColor(i, e.target.value)} className="flex-1 bg-transparent text-sm outline-none" />
              {colors.length > 1 && (
                <button type="button" onClick={() => onRemoveColor(i)} className="text-xs text-accent-orange">Eliminar</button>
              )}
            </div>
          ))}
        </div>
        <button type="button" onClick={onAddColor} className="mt-2 text-sm text-brand-green">+ Agregar color</button>
      </div>
    </Card>
  );
}
