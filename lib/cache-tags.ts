export const CACHE_TAGS = {
  products: "products",
  /** Dynamic tags — use with template literal: `CACHE_TAGS.product("slug")` */
  product: (slug: string) => `product-${slug}`,
  adminDashboard: "admin-dashboard",
  adminPedidos: "admin-pedidos",
  content: "content",
} as const;
