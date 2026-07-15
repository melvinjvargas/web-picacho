import { AccordionItem } from "@/components/ui/AccordionItem";

export function SizeGuideAccordion() {
  return (
    <AccordionItem label="Guía de tallas">
      <div className="flex flex-col gap-3">
        <p className="text-xs text-text-secondary">
          Camiseta unisex. Si dudás entre dos tallas, elegí la más grande.
        </p>
        {/* Size diagram */}
        <div className="rounded-lg bg-white p-4 flex flex-col items-center gap-2">
          <div className="relative w-36 h-24">
            {/* Simple T-shirt outline using a div with border */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <svg
                viewBox="0 0 160 130"
                className="w-full h-full"
                fill="none"
                stroke="#2D4A32"
                strokeWidth={2}
              >
                <path d="M50 25 L110 25 L130 45 L110 60 L110 110 L50 110 L50 60 L30 45 Z" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-[10px] text-text-secondary">
            <p>A = Ancho: 46-66 cm</p>
            <p>B = Largo: 62-82 cm</p>
          </div>
        </div>
      </div>
    </AccordionItem>
  );
}
