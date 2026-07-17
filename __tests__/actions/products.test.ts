import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("@/lib/server-supabase", () => ({
  createServerSupabase: vi.fn(),
}));

import { revalidatePath, revalidateTag } from "next/cache";
import { createServerSupabase } from "@/lib/server-supabase";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductActive,
} from "@/lib/actions/products";

const mockCreateSS = createServerSupabase as ReturnType<typeof vi.fn>;
const mockRevalidateTag = revalidateTag as ReturnType<typeof vi.fn>;

interface BuildSupabaseOptions {
  insertResult?: { error: null | { message: string } };
  updateResult?: { error: null | { message: string } };
  deleteResult?: { error: null | { message: string } };
  user?: { id: string } | null;
}

function buildSupabaseMock(opts: BuildSupabaseOptions = {}) {
  const insert = vi.fn().mockResolvedValue(opts.insertResult ?? { error: null });
  const eq = vi.fn().mockResolvedValue(opts.updateResult ?? opts.deleteResult ?? { error: null });
  const update = vi.fn().mockReturnValue({ eq });
  const deleteFn = vi.fn().mockReturnValue({ eq });
  const from = vi.fn().mockReturnValue({
    insert,
    update,
    delete: deleteFn,
  });
  const userValue = "user" in opts ? opts.user : { id: "admin-1" };
  const getUser = vi.fn().mockResolvedValue({ data: { user: userValue } });

  return {
    from,
    auth: { getUser },
    insert,
    update,
    eq,
    deleteFn,
    getUser,
  };
}

const validProduct = {
  name: "Camisa Test",
  category: "senderismo",
  price: 320,
  original_price: null,
  is_new: false,
  is_active: true,
  design_description: "Diseño de prueba",
  images: ["/img/test.jpg"],
  sizes: ["S", "M", "L"],
  colors: ["#2D4A32", "#111111"],
};

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── createProduct ───────────────────────────────────────────────────────────

describe("createProduct", () => {
  it("creates a product and revalidates tags", async () => {
    const mock = buildSupabaseMock();
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    const result = await createProduct(validProduct);

    expect(result).toEqual({ success: true });
    expect(mock.from).toHaveBeenCalledWith("products");
    expect(mock.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Camisa Test",
        category: "senderismo",
        price: 320,
        is_new: false,
        is_active: true,
      }),
    );
    expect(mockRevalidateTag).toHaveBeenCalledWith("products", {});
    expect(mockRevalidateTag).toHaveBeenCalledWith("admin-dashboard", {});
  });

  it("throws 'No autorizado' for unauthenticated user", async () => {
    const mock = buildSupabaseMock({ user: null });
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    await expect(createProduct(validProduct)).rejects.toThrow("No autorizado");
    // revalidateTag should NOT be called
    expect(mockRevalidateTag).not.toHaveBeenCalled();
    expect(vi.mocked(revalidatePath)).not.toHaveBeenCalled();
  });

  it("returns error when insert fails", async () => {
    const mock = buildSupabaseMock({
      insertResult: { error: { message: "Unique violation" } },
    });
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    const result = await createProduct(validProduct);

    expect(result).toEqual({ success: false, error: "Unique violation" });
    // revalidateTag should NOT be called on failure
    expect(mockRevalidateTag).not.toHaveBeenCalled();
  });
});

// ─── updateProduct ──────────────────────────────────────────────────────────

describe("updateProduct", () => {
  it("updates a product and revalidates tags including product slug", async () => {
    const mock = buildSupabaseMock();
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    const result = await updateProduct("prod-1", validProduct);

    expect(result).toEqual({ success: true });
    expect(mock.from).toHaveBeenCalledWith("products");
    expect(mock.update).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Camisa Test" }),
    );
    expect(mock.eq).toHaveBeenCalledWith("id", "prod-1");
    expect(mockRevalidateTag).toHaveBeenCalledWith("products", {});
    expect(mockRevalidateTag).toHaveBeenCalledWith("product-camisa-test", {});
    expect(mockRevalidateTag).toHaveBeenCalledWith("admin-dashboard", {});
  });

  it("throws 'No autorizado' for unauthenticated user", async () => {
    const mock = buildSupabaseMock({ user: null });
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    await expect(updateProduct("prod-1", validProduct)).rejects.toThrow(
      "No autorizado",
    );
    expect(mockRevalidateTag).not.toHaveBeenCalled();
  });

  it("returns error on update failure", async () => {
    const mock = buildSupabaseMock({
      updateResult: { error: { message: "Not found" } },
    });
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    const result = await updateProduct("prod-1", validProduct);

    expect(result).toEqual({ success: false, error: "Not found" });
    expect(mockRevalidateTag).not.toHaveBeenCalled();
  });
});

// ─── deleteProduct ───────────────────────────────────────────────────────────

describe("deleteProduct", () => {
  it("deletes a product and revalidates tags", async () => {
    const mock = buildSupabaseMock();
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    const result = await deleteProduct("prod-1");

    expect(result).toEqual({ success: true });
    expect(mock.from).toHaveBeenCalledWith("products");
    expect(mockRevalidateTag).toHaveBeenCalledWith("products", {});
    expect(mockRevalidateTag).toHaveBeenCalledWith("admin-dashboard", {});
  });

  it("throws 'No autorizado' for unauthenticated user", async () => {
    const mock = buildSupabaseMock({ user: null });
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    await expect(deleteProduct("prod-1")).rejects.toThrow("No autorizado");
    expect(mockRevalidateTag).not.toHaveBeenCalled();
  });
});

// ─── toggleProductActive ────────────────────────────────────────────────────

describe("toggleProductActive", () => {
  it("toggles is_active and revalidates tags", async () => {
    const mock = buildSupabaseMock();
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    const result = await toggleProductActive("prod-1", true);

    expect(result).toEqual({ success: true });
    expect(mock.update).toHaveBeenCalledWith({ is_active: false });
    expect(mockRevalidateTag).toHaveBeenCalledWith("products", {});
    expect(mockRevalidateTag).toHaveBeenCalledWith("admin-dashboard", {});
  });

  it("toggles from inactive to active", async () => {
    const mock = buildSupabaseMock();
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    const result = await toggleProductActive("prod-1", false);

    expect(result).toEqual({ success: true });
    expect(mock.update).toHaveBeenCalledWith({ is_active: true });
  });

  it("throws 'No autorizado' for unauthenticated user", async () => {
    const mock = buildSupabaseMock({ user: null });
    mockCreateSS.mockResolvedValue({ from: mock.from, auth: mock.auth });

    await expect(toggleProductActive("prod-1", true)).rejects.toThrow(
      "No autorizado",
    );
    expect(mockRevalidateTag).not.toHaveBeenCalled();
  });
});
