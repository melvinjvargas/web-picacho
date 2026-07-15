import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return `L. ${price.toFixed(2)}`;
}

export function getWhatsAppLink(
  phone: string,
  message: string,
): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppOrderText(
  productName: string,
  size?: string,
  color?: string,
  quantity?: number,
): string {
  const parts = [`Hola Picacho! Quiero pedir:`];
  parts.push(`- ${productName}`);
  if (size) parts.push(`- Talla: ${size}`);
  if (color) parts.push(`- Color: ${color}`);
  if (quantity && quantity > 1) parts.push(`- Cantidad: ${quantity}`);
  return parts.join("\n");
}
