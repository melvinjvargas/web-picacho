import { describe, it, expect } from "vitest";
import {
  cn,
  formatPrice,
  getWhatsAppLink,
  buildWhatsAppOrderText,
} from "@/lib/utils";

// ─── cn ──────────────────────────────────────────────────────────────────────

describe("cn", () => {
  it("merges class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters falsy values", () => {
    expect(cn("foo", false, undefined, null, "", "bar")).toBe("foo bar");
  });

  it("concatenates class names (clsx-only, no twMerge)", () => {
    // cn uses clsx which concatenates — not tailwind-merge which resolves conflicts
    expect(cn("px-4", "px-6")).toBe("px-4 px-6");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });

  it("returns empty string for all falsy", () => {
    expect(cn(false, null, undefined, "")).toBe("");
  });

  it("handles conditional objects", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });

  it("handles nested arrays", () => {
    expect(cn("base", ["nested-1", ["nested-2"]])).toBe(
      "base nested-1 nested-2",
    );
  });
});

// ─── formatPrice ─────────────────────────────────────────────────────────────

describe("formatPrice", () => {
  it("formats integer price with two decimals", () => {
    expect(formatPrice(100)).toBe("L. 100.00");
  });

  it("formats decimal price", () => {
    expect(formatPrice(250.5)).toBe("L. 250.50");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("L. 0.00");
  });

  it("formats large number with commas via toFixed", () => {
    expect(formatPrice(1234.56)).toBe("L. 1234.56");
  });
});

// ─── getWhatsAppLink ─────────────────────────────────────────────────────────

describe("getWhatsAppLink", () => {
  it("builds a WhatsApp link with encoded message", () => {
    const link = getWhatsAppLink("50431524573", "Hola Picacho!");
    expect(link).toMatch(/^https:\/\/wa\.me\/50431524573\?text=/);
    expect(link).toContain("Hola%20Picacho!");
  });

  it("encodes special characters in message", () => {
    const link = getWhatsAppLink("123456789", "Hello & welcome!");
    expect(link).toContain("Hello%20%26%20welcome!");
  });

  it("encodes line breaks", () => {
    const link = getWhatsAppLink("123456789", "Line 1\nLine 2");
    expect(link).toContain("Line%201%0ALine%202");
  });
});

// ─── buildWhatsAppOrderText ────────────────────────────────────────────────────

describe("buildWhatsAppOrderText", () => {
  it("builds basic message with product name", () => {
    const text = buildWhatsAppOrderText("Camisa Río");
    expect(text).toBe("Hola Picacho! Quiero pedir:\n- Camisa Río");
  });

  it("includes size when provided", () => {
    const text = buildWhatsAppOrderText("Camisa Río", "M");
    expect(text).toContain("- Talla: M");
    expect(text).toContain("- Camisa Río");
  });

  it("includes color when provided", () => {
    const text = buildWhatsAppOrderText("Camisa Río", undefined, "Verde");
    expect(text).toContain("- Color: Verde");
    expect(text).not.toContain("Talla");
  });

  it("includes quantity only when > 1", () => {
    const text = buildWhatsAppOrderText("Camisa Río", "L", "Azul", 3);
    expect(text).toContain("- Cantidad: 3");
    expect(text).toContain("- Talla: L");
    expect(text).toContain("- Color: Azul");
  });

  it("excludes quantity when exactly 1", () => {
    const text = buildWhatsAppOrderText("Camisa Río", "M", "Rojo", 1);
    expect(text).not.toContain("Cantidad");
    expect(text).toContain("- Talla: M");
  });

  it("excludes quantity when undefined", () => {
    const text = buildWhatsAppOrderText("Camisa Río", "XL");
    expect(text).not.toContain("Cantidad");
  });

  it("handles all parameters", () => {
    const text = buildWhatsAppOrderText("Gorra Sendero", "L", "Negro", 2);
    const lines = text.split("\n");
    expect(lines[0]).toBe("Hola Picacho! Quiero pedir:");
    expect(lines).toContain("- Gorra Sendero");
    expect(lines).toContain("- Talla: L");
    expect(lines).toContain("- Color: Negro");
    expect(lines).toContain("- Cantidad: 2");
  });
});
