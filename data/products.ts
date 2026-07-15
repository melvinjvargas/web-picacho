import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "sendero-nocturno",
    name: "Sendero Nocturno",
    slug: "sendero-nocturno",
    category: "camping",
    price: 315.0,
    originalPrice: 450.0,
    isNew: false,
    images: [
      "https://placehold.co/600x800/2D4A32/FFF?text=Sendero+Nocturno+(Frente)",
      "https://placehold.co/600x800/1B2A36/FFF?text=Sendero+Nocturno+(Espalda)",
      "https://placehold.co/600x800/C4622A/FFF?text=Sendero+Nocturno+(Detalle)",
      "https://placehold.co/600x800/6B6B6B/FFF?text=Sendero+Nocturno+(Etiqueta)",
      "https://placehold.co/600x800/111111/FFF?text=Sendero+Nocturno+(Lifestyle)",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { hex: "#111111", name: "Negro" },
      { hex: "#FFFFFF", name: "Blanco" },
      { hex: "#2D4A32", name: "Verde" },
    ],
    design_description:
      "Una carpa bajo el cielo estrellado del Cerro El Picacho. Inspirada en las noches de camping en las montañas hondureñas que nos conectan con lo salvaje.",
  },
  {
    id: "cumbre-nublada",
    name: "Cumbre Nublada",
    slug: "cumbre-nublada",
    category: "senderismo",
    price: 480.0,
    isNew: true,
    images: ["/products/cumbre-1.jpg", "/products/cumbre-2.jpg", "/products/cumbre-3.jpg", "/products/cumbre-4.jpg", "/products/cumbre-5.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { hex: "#111111", name: "Negro" },
      { hex: "#FFFFFF", name: "Blanco" },
      { hex: "#2D4A32", name: "Verde" },
    ],
    design_description:
      "La niebla matutina que envuelve la cima del Picacho al amanecer. Un homenaje a quienes despiertan temprano para alcanzar la cumbre.",
  },
  {
    id: "fogata-salvaje",
    name: "Fogata Salvaje",
    slug: "fogata-salvaje",
    category: "camping",
    price: 315.0,
    originalPrice: 450.0,
    isNew: false,
    images: ["/products/fogata-1.jpg", "/products/fogata-2.jpg", "/products/fogata-3.jpg", "/products/fogata-4.jpg", "/products/fogata-5.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { hex: "#111111", name: "Negro" },
      { hex: "#C4622A", name: "Naranja" },
    ],
    design_description:
      "El calor de una fogata al final de un día de aventura. Evoca las mejores noches compartidas bajo las estrellas en el corazón del bosque.",
  },
  {
    id: "brisa-de-montana",
    name: "Brisa de Montaña",
    slug: "brisa-de-montana",
    category: "senderismo",
    price: 470.0,
    isNew: true,
    images: ["/products/brisa-1.jpg", "/products/brisa-2.jpg", "/products/brisa-3.jpg", "/products/brisa-4.jpg", "/products/brisa-5.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { hex: "#FFFFFF", name: "Blanco" },
      { hex: "#2D4A32", name: "Verde" },
    ],
    design_description:
      "El viento fresco que recorre los senderos del Picacho. Para quienes sienten la brisa de la montaña como su segunda piel.",
  },
  {
    id: "pared-vertical",
    name: "Pared Vertical",
    slug: "pared-vertical",
    category: "escalada",
    price: 343.0,
    originalPrice: 490.0,
    isNew: true,
    images: ["/products/pared-1.jpg", "/products/pared-2.jpg", "/products/pared-3.jpg", "/products/pared-4.jpg", "/products/pared-5.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { hex: "#111111", name: "Negro" },
      { hex: "#FFFFFF", name: "Blanco" },
    ],
    design_description:
      "El desafío de la roca que solo los valientes enfrentan. Celebra el espíritu de la escalada y la superación personal.",
  },
  {
    id: "polvo-de-estrella",
    name: "Polvo de Estrella",
    slug: "polvo-de-estrella",
    category: "trail",
    price: 322.0,
    originalPrice: 460.0,
    isNew: false,
    images: ["/products/polvo-1.jpg", "/products/polvo-2.jpg", "/products/polvo-3.jpg", "/products/polvo-4.jpg", "/products/polvo-5.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { hex: "#111111", name: "Negro" },
      { hex: "#2D4A32", name: "Verde" },
    ],
    design_description:
      "Cada paso en el trail deja una estela de polvo de estrella. Inspirada en los corredores de montaña que se mueven libres bajo el cielo abierto.",
  },
  {
    id: "alba-montanesa",
    name: "Alba Montañesa",
    slug: "alba-montanesa",
    category: "naturaleza",
    price: 475.0,
    isNew: true,
    images: ["/products/alba-1.jpg", "/products/alba-2.jpg", "/products/alba-3.jpg", "/products/alba-4.jpg", "/products/alba-5.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { hex: "#FFFFFF", name: "Blanco" },
      { hex: "#C4622A", name: "Naranja" },
    ],
    design_description:
      "Los primeros rayos de sol iluminando las cumbres del Picacho. Captura la magia del amanecer en la montaña, cuando todo renace.",
  },
  {
    id: "luna-de-campo",
    name: "Luna de Campo",
    slug: "luna-de-campo",
    category: "camping",
    price: 318.0,
    originalPrice: 455.0,
    isNew: false,
    images: ["/products/luna-1.jpg", "/products/luna-2.jpg", "/products/luna-3.jpg", "/products/luna-4.jpg", "/products/luna-5.jpg"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: [
      { hex: "#111111", name: "Negro" },
      { hex: "#FFFFFF", name: "Blanco" },
    ],
    design_description:
      "Noches de luna llena sobre los campos hondureños. Celebra la conexión profunda con la naturaleza y la tranquilidad del campo.",
  },
];

export const newProducts = products.filter((p) => p.isNew);
export const bestSellers = products.filter((p) => !p.isNew).slice(0, 4);
export const featuredProducts = products.slice(0, 4);
