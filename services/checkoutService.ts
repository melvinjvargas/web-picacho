import { createOrder } from "@/lib/actions/orders";
import type { CartItem } from "@/context/CartContext";
import { getWhatsAppLink, formatPrice } from "@/lib/utils";
import { SITE } from "@/lib/constants";

export async function submitOrderAndGetWhatsAppUrl(
  customerName: string,
  customerPhone: string,
  items: CartItem[],
): Promise<string> {
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  await createOrder(
    customerName,
    customerPhone,
    items.map((i) => ({
      product_id: i.product.id,
      name: i.product.name,
      size: i.size,
      color: i.color?.name ?? null,
      quantity: i.quantity,
      price: i.product.price,
    })),
    total,
  );

  const message = buildMessage(items, total);
  return getWhatsAppLink(SITE.whatsapp, message);
}

function buildMessage(items: CartItem[], total: number): string {
  const header = "Hola Picacho! Quiero hacer este pedido:\n";
  const lines = items.map((item) => {
    const parts = [`- ${item.product.name} x${item.quantity}`];
    if (item.size) parts.push(`  Talla: ${item.size}`);
    if (item.color) parts.push(`  Color: ${item.color.name}`);
    parts.push(`  ${formatPrice(item.product.price * item.quantity)}`);
    return parts.join("\n");
  });
  const totalLine = `\n\nTotal: ${formatPrice(total)}`;
  return header + lines.join("\n") + totalLine;
}
