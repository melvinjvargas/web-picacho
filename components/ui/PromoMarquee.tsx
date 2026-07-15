export function PromoMarquee() {
  const items = [
    "Envío gratis a toda Honduras +L.500",
    "Pago contra entrega disponible",
    "Nuevos diseños cada semana",
    "Algodón 100% peinado",
    "Hecho en Honduras",
    "Serigrafía al agua",
    "Diseños exclusivos",
    "Atención por WhatsApp",
  ];

  return (
    <div className="relative overflow-hidden bg-text-primary py-3">
      <div className="marquee-track whitespace-nowrap">
        {[...items, ...items].map((text, i) => (
          <span
            key={i}
            className="mx-6 text-sm font-semibold text-white"
          >
            {text}
            <span className="ml-6 text-white/40">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
