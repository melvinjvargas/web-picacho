import fs from "node:fs";
import path from "node:path";

export interface ProductStaticContent {
  description: string;
  caracteristicas: string;
  cuidados: string;
}

let cached: ProductStaticContent | null = null;

export function getProductStaticContent(): ProductStaticContent {
  if (cached) return cached;

  const filePath = path.join(process.cwd(), "data", "producto.txt");
  const raw = fs.readFileSync(filePath, "utf-8");

  const sections: Record<string, string> = {};
  const regex = /=== (.+?) ===\n([\s\S]*?)(?=\n=== |$)/g;
  let match;
  while ((match = regex.exec(raw)) !== null) {
    const key = match[1].trim().toLowerCase();
    const value = match[2].trim();
    sections[key] = value;
  }

  cached = {
    description: sections["descripción"] || "",
    caracteristicas: sections["características"] || "",
    cuidados: sections["cuidados"] || "",
  };

  return cached;
}
