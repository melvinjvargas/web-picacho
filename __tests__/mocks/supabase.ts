import { vi } from "vitest";

type MockChain = Record<string, ReturnType<typeof vi.fn>> & {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  from: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  match: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  range: ReturnType<typeof vi.fn>;
  ilike: ReturnType<typeof vi.fn>;
  auth: { getUser: ReturnType<typeof vi.fn> };
  storage: { from: ReturnType<typeof vi.fn> };
};

/**
 * Creates a chainable Supabase mock that returns itself from every method.
 * Use `mockReturnValue` / `mockResolvedValue` on leaf methods to stub data.
 *
 * @example
 * const supabase = createSupabaseMock();
 * supabase.from("products").select.mockResolvedValue({ data: [], error: null });
 */
export function createSupabaseMock() {
  const chain: Record<string, unknown> = {};

  const handler: ProxyHandler<MockChain> = {
    get(_target, prop: string) {
      if (!chain[prop]) {
        chain[prop] = vi.fn().mockReturnValue(proxy);
      }
      return chain[prop];
    },
  };

  const proxy = new Proxy(
    {
      auth: { getUser: vi.fn() },
      storage: { from: vi.fn().mockReturnValue({ upload: vi.fn(), getPublicUrl: vi.fn() }) },
    } as unknown as MockChain,
    handler,
  );

  return proxy;
}
