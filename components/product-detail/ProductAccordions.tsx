import { AccordionItem } from "@/components/ui/AccordionItem";

interface ProductAccordionsProps {
  description: string;
  caracteristicas: string;
  cuidados: string;
}

export function ProductAccordions({
  description,
  caracteristicas,
  cuidados,
}: ProductAccordionsProps) {
  return (
    <div className="flex flex-col">
      <AccordionItem label="Descripción">
        {description}
      </AccordionItem>
      <AccordionItem label="Características">
        {caracteristicas}
      </AccordionItem>
      <AccordionItem label="Cuidados">
        {cuidados}
      </AccordionItem>
    </div>
  );
}
