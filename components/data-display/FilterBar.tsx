import { Chip } from "@/components/ui/Chip";
import type { Category } from "@/types/category";

interface FilterBarProps {
  categories: Category[];
  activeCategory: string;
  onSelect: (slug: string) => void;
}

export function FilterBar({
  categories,
  activeCategory,
  onSelect,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Chip
          key={cat.slug}
          label={cat.name}
          active={activeCategory === cat.slug}
          onClick={() => onSelect(cat.slug)}
        />
      ))}
    </div>
  );
}
