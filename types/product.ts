export interface Category {
  slug: string;
  name: string;
  imageQuery?: string;
}

export interface ProductColor {
  hex: string;
  name: string;
}

export type SizeLabel = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category["slug"];
  price: number;
  originalPrice?: number;
  isNew?: boolean;
  description?: string;
  images: string[];
  sizes: SizeLabel[];
  colors: ProductColor[];
  caracteristicas?: string;
  cuidados?: string;
  design_description: string;
}

export interface Discount {
  code: string;
  percentage: number;
}
