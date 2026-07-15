import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceTagProps {
  price: number;
  discountedPrice?: number;
  className?: string;
}

export function PriceTag({ price, discountedPrice, className }: PriceTagProps) {
  return (
    <span className={cn("text-base font-medium", className)}>
      {discountedPrice ? (
        <>
          <span className="line-through text-text-muted mr-2">
            {formatPrice(price)}
          </span>
          <span className="text-accent-orange">
            {formatPrice(discountedPrice)}
          </span>
        </>
      ) : (
        formatPrice(price)
      )}
    </span>
  );
}
