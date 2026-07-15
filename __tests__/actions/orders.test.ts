import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/server-supabase", () => ({
  createServerSupabase: vi.fn(),
}));

import { createServerSupabase } from "@/lib/server-supabase";
import { createOrder, updateOrderStatus } from "@/lib/actions/orders";

const mockCreateSS = createServerSupabase as ReturnType<typeof vi.fn>;

interface BuildSupabaseOptions {
  insertResult?: { error: null | { message: string } };
  updateResult?: { error: null | { message: string } };
  user?: { id: string } | null;
}

function buildSupabaseMock(opts: BuildSupabaseOptions = {}) {
  const insert = vi.fn().mockResolvedValue(opts.insertResult ?? { error: null });
  const eq = vi.fn().mockResolvedValue(opts.updateResult ?? { error: null });
  const update = vi.fn().mockReturnValue({ eq });
  const from = vi.fn().mockReturnValue({ insert, update });
  // Use "in" check so explicit null is not overridden by ?? fallback
  const userValue = "user" in opts ? opts.user : { id: "admin-1" };
  const getUser = vi.fn().mockResolvedValue({ data: { user: userValue } });

  return {
    from,
    auth: { getUser },
    insert,
    update,
    eq,
    getUser,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── createOrder ─────────────────────────────────────────────────────────────

describe("createOrder", () => {
  it("creates an order successfully", async () => {
    const mock = buildSupabaseMock();
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    const result = await createOrder(
      "Cliente Test",
      "50412345678",
      [{ product_id: "p1", name: "Camisa Río", size: "M", color: "Verde", quantity: 1, price: 320 }],
      320,
    );

    expect(result).toEqual({ success: true });
    expect(mock.from).toHaveBeenCalledWith("orders");
    expect(mock.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_name: "Cliente Test",
        customer_phone: "50412345678",
        total: 320,
        status: "pendiente",
      }),
    );
  });

  it("returns error when Supabase insert fails", async () => {
    const mock = buildSupabaseMock({
      insertResult: { error: { message: "Constraint violation" } },
    });
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    const result = await createOrder(
      "Cliente Test",
      "50412345678",
      [{ product_id: "p1", name: "X", size: null, color: null, quantity: 1, price: 100 }],
      100,
    );

    expect(result).toEqual({ success: false, error: "Constraint violation" });
  });

  it("allows empty items array (relies on Supabase validation)", async () => {
    const mock = buildSupabaseMock();
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    const result = await createOrder("Cliente", "50400000000", [], 0);
    expect(result).toEqual({ success: true });
  });
});

// ─── updateOrderStatus ───────────────────────────────────────────────────────

describe("updateOrderStatus", () => {
  it("updates status successfully for authenticated user", async () => {
    const mock = buildSupabaseMock({
      user: { id: "admin-1" },
    });
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    const result = await updateOrderStatus("order-1", "completado");

    expect(result).toEqual({ success: true });
    expect(mock.from).toHaveBeenCalledWith("orders");
    expect(mock.update).toHaveBeenCalledWith({ status: "completado" });
    expect(mock.eq).toHaveBeenCalledWith("id", "order-1");
  });

  it("throws 'No autorizado' for unauthenticated user", async () => {
    const mock = buildSupabaseMock({ user: null });
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    await expect(updateOrderStatus("order-1", "completado")).rejects.toThrow(
      "No autorizado",
    );
  });

  it("returns error for invalid status", async () => {
    const mock = buildSupabaseMock({ user: { id: "admin-1" } });
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    const result = await updateOrderStatus("order-1", "invalid_status");

    expect(result).toEqual({ success: false, error: "Estado inválido" });
    // update should not have been called
    expect(mock.update).not.toHaveBeenCalled();
  });

  it("returns error on Supabase update failure", async () => {
    const mock = buildSupabaseMock({
      user: { id: "admin-1" },
      updateResult: { error: { message: "Row not found" } },
    });
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    const result = await updateOrderStatus("order-1", "en_proceso");

    expect(result).toEqual({ success: false, error: "Row not found" });
  });

  it("accepts all valid statuses", async () => {
    const validStatuses = ["pendiente", "en_proceso", "completado", "devolucion"];

    for (const status of validStatuses) {
      const mock = buildSupabaseMock({ user: { id: "admin-1" } });
      mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

      const result = await updateOrderStatus("order-1", status);
      expect(result).toEqual({ success: true });
      expect(mock.update).toHaveBeenCalledWith({ status });
    }
  });
});
