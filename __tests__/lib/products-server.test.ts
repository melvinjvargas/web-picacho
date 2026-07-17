import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("next/cache", () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
}));

vi.mock("@/lib/server-supabase", () => ({
  createServerSupabase: vi.fn(),
}));

import { createServerSupabase } from "@/lib/server-supabase";
import {
  fetchFromSupabaseServer,
  getAllProductsServer,
  getFeaturedProductsServer,
  getProductByIdServer,
  getProductBySlugServer,
} from "@/lib/data/products-server";

const mockCreateSS = createServerSupabase as ReturnType<typeof vi.fn>;

/** Build a mock .from("products").select("*").eq(...).order(...) chain */
function mockProductsChain(result: {
  data: Record<string, unknown>[] | null;
  error: { message: string } | null;
}) {
  const orderFn = vi.fn().mockResolvedValue(result);
  const eqFn = vi.fn().mockReturnValue({ order: orderFn });
  const selectFn = vi.fn().mockReturnValue({ eq: eqFn });
  const fromFn = vi.fn().mockReturnValue({ select: selectFn });
  return { fromFn, selectFn, eqFn, orderFn };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── fetchFromSupabaseServer ─────────────────────────────────────────────────

describe("fetchFromSupabaseServer", () => {
  it("returns parsed products on success", async () => {
    const { fromFn } = mockProductsChain({
      data: [
        {
          id: "1",
          name: "Camisa Montaña",
          slug: "camisa-montana",
          category: "senderismo",
          price: 350,
          original_price: 450,
          is_new: true,
          design_description: "Diseño inspirado en senderos",
          sizes: ["S", "M", "L"],
          colors: [{ hex: "#2D4A32", name: "Verde Musgo" }],
          images: ["/img1.jpg"],
        },
      ],
      error: null,
    });

    mockCreateSS.mockResolvedValue({ from: fromFn });

    const products = await fetchFromSupabaseServer();
    expect(products).toHaveLength(1);
    expect(products[0]).toMatchObject({
      id: "1",
      name: "Camisa Montaña",
      slug: "camisa-montana",
      category: "senderismo",
      price: 350,
      originalPrice: 450,
      isNew: true,
      images: ["/img1.jpg"],
      sizes: ["S", "M", "L"],
    });
  });

  it("returns empty array on Supabase error", async () => {
    const { fromFn } = mockProductsChain({
      data: null,
      error: { message: "DB connection failed" },
    });
    mockCreateSS.mockResolvedValue({ from: fromFn });

    const products = await fetchFromSupabaseServer();
    expect(products).toEqual([]);
  });

  it("returns empty array when Supabase throws", async () => {
    mockCreateSS.mockRejectedValue(new Error("Network error"));

    const products = await fetchFromSupabaseServer();
    expect(products).toEqual([]);
  });

  // ─── parseDbRow edge cases (tested indirectly) ──────────────────────────

  it("handles null/undefined fields gracefully", async () => {
    const { fromFn } = mockProductsChain({
      data: [
        {
          id: null,
          name: undefined,
          slug: null,
          category: null,
          price: null,
          is_new: null,
          design_description: null,
          sizes: null,
          colors: null,
          images: null,
        },
      ],
      error: null,
    });
    mockCreateSS.mockResolvedValue({ from: fromFn });

    const products = await fetchFromSupabaseServer();
    expect(products).toHaveLength(1);
    expect(products[0]).toMatchObject({
      id: "",
      name: "",
      slug: "",
      category: "",
      price: 0,
      isNew: false,
      design_description: "",
      images: [],
      sizes: [],
      colors: [],
    });
  });

  it("handles colors as JSONB objects", async () => {
    const { fromFn } = mockProductsChain({
      data: [
        {
          id: "c1",
          name: "Camisa Ríos",
          slug: "camisa-rios",
          category: "rios",
          price: 320,
          design_description: "",
          sizes: [],
          colors: [
            { hex: "#1A5B8C", name: "Azul Río" },
            { hex: "#2D4A32" },
          ],
          images: [],
        },
      ],
      error: null,
    });
    mockCreateSS.mockResolvedValue({ from: fromFn });

    const products = await fetchFromSupabaseServer();
    expect(products[0].colors).toHaveLength(2);
    expect(products[0].colors[0]).toEqual({ hex: "#1A5B8C", name: "Azul Río" });
    expect(products[0].colors[1]).toEqual({ hex: "#2D4A32", name: "#2D4A32" });
  });

  it("handles empty colors array", async () => {
    const { fromFn } = mockProductsChain({
      data: [
        {
          id: "e1",
          name: "Producto sin colores",
          slug: "sin-colores",
          category: "camping",
          price: 100,
          design_description: "",
          sizes: [],
          colors: [],
          images: [],
        },
      ],
      error: null,
    });
    mockCreateSS.mockResolvedValue({ from: fromFn });

    const products = await fetchFromSupabaseServer();
    expect(products[0].colors).toEqual([]);
  });

  it("treats empty Supabase data the same as null", async () => {
    const { fromFn } = mockProductsChain({
      data: [],
      error: null,
    });
    mockCreateSS.mockResolvedValue({ from: fromFn });

    const products = await fetchFromSupabaseServer();
    // data = [] has length 0 → .map returns [] — then if (!data) is false
    // BUT the code checks `if (error || !data) return []` — !data is true for null, false for []
    // Then `data.map(parseDbRow)` returns [] for empty array — correct
    expect(products).toEqual([]);
  });
});

// ─── getAllProductsServer ────────────────────────────────────────────────────

describe("getAllProductsServer", () => {
  it("returns DB products when available", async () => {
    const { fromFn } = mockProductsChain({
      data: [
        {
          id: "db-1",
          name: "DB Product",
          slug: "db-product",
          category: "fauna",
          price: 200,
          design_description: "",
          sizes: [],
          colors: [],
          images: [],
        },
      ],
      error: null,
    });
    mockCreateSS.mockResolvedValue({ from: fromFn });

    const products = await getAllProductsServer();
    expect(products.length).toBeGreaterThanOrEqual(1);
    expect(products[0].id).toBe("db-1");
  });

  it("falls back to static products when DB returns empty", async () => {
    const { fromFn } = mockProductsChain({
      data: [],
      error: null,
    });
    mockCreateSS.mockResolvedValue({ from: fromFn });

    const products = await getAllProductsServer();
    // Static products from data/products.ts should have at least 1 product
    expect(products.length).toBeGreaterThanOrEqual(1);
    // The first static product should have expected Product shape
    expect(products[0]).toHaveProperty("id");
    expect(products[0]).toHaveProperty("name");
    expect(products[0]).toHaveProperty("slug");
  });

  it("falls back to static products when Supabase throws", async () => {
    mockCreateSS.mockRejectedValue(new Error("Down"));

    const products = await getAllProductsServer();
    expect(products.length).toBeGreaterThanOrEqual(1);
  });
});

// ─── getFeaturedProductsServer ──────────────────────────────────────────────

describe("getFeaturedProductsServer", () => {
  it("returns at most 4 products", async () => {
    const rows = Array.from({ length: 8 }, (_, i) => ({
      id: `p${i}`,
      name: `Product ${i}`,
      slug: `product-${i}`,
      category: "camping",
      price: 100 + i * 10,
      design_description: "",
      sizes: [],
      colors: [],
      images: [],
    }));

    const { fromFn } = mockProductsChain({ data: rows, error: null });
    mockCreateSS.mockResolvedValue({ from: fromFn });

    const featured = await getFeaturedProductsServer();
    expect(featured).toHaveLength(4);
  });

  it("returns fewer than 4 when DB has less", async () => {
    const { fromFn } = mockProductsChain({
      data: [
        {
          id: "only",
          name: "Only One",
          slug: "only-one",
          category: "trail",
          price: 150,
          design_description: "",
          sizes: [],
          colors: [],
          images: [],
        },
      ],
      error: null,
    });
    mockCreateSS.mockResolvedValue({ from: fromFn });

    const featured = await getFeaturedProductsServer();
    expect(featured).toHaveLength(1);
  });
});

// ─── getProductByIdServer ────────────────────────────────────────────────────

describe("getProductByIdServer", () => {
  it("finds product by id", async () => {
    const { fromFn } = mockProductsChain({
      data: [
        {
          id: "abc-123",
          name: "Camisa Río",
          slug: "camisa-rio",
          category: "rios",
          price: 320,
          design_description: "",
          sizes: [],
          colors: [],
          images: [],
        },
      ],
      error: null,
    });
    mockCreateSS.mockResolvedValue({ from: fromFn });

    const product = await getProductByIdServer("abc-123");
    expect(product).toBeDefined();
    expect(product!.name).toBe("Camisa Río");
  });

  it("finds product by slug fallback", async () => {
    const { fromFn } = mockProductsChain({
      data: [
        {
          id: "p-1",
          name: "Gorra Sendero",
          slug: "gorra-sendero",
          category: "senderismo",
          price: 250,
          design_description: "",
          sizes: [],
          colors: [],
          images: [],
        },
      ],
      error: null,
    });
    mockCreateSS.mockResolvedValue({ from: fromFn });

    const product = await getProductByIdServer("gorra-sendero");
    expect(product).toBeDefined();
    expect(product!.name).toBe("Gorra Sendero");
  });

  it("returns undefined when not found", async () => {
    const { fromFn } = mockProductsChain({
      data: [],
      error: null,
    });
    mockCreateSS.mockResolvedValue({ from: fromFn });

    const product = await getProductByIdServer("nonexistent");
    expect(product).toBeUndefined();
  });
});

// ─── getProductBySlugServer ──────────────────────────────────────────────────

describe("getProductBySlugServer", () => {
  it("finds product by slug", async () => {
    const { fromFn } = mockProductsChain({
      data: [
        {
          id: "s-1",
          name: "Camisa Escalada",
          slug: "camisa-escalada",
          category: "escalada",
          price: 380,
          design_description: "",
          sizes: [],
          colors: [],
          images: [],
        },
      ],
      error: null,
    });
    mockCreateSS.mockResolvedValue({ from: fromFn });

    const product = await getProductBySlugServer("camisa-escalada");
    expect(product).toBeDefined();
    expect(product!.slug).toBe("camisa-escalada");
  });

  it("returns undefined for unknown slug", async () => {
    const { fromFn } = mockProductsChain({
      data: [{ id: "1", name: "A", slug: "a", category: "fauna", price: 100, design_description: "", sizes: [], colors: [], images: [] }],
      error: null,
    });
    mockCreateSS.mockResolvedValue({ from: fromFn });

    const product = await getProductBySlugServer("no-existe");
    expect(product).toBeUndefined();
  });
});
