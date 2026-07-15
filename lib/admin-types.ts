import type { Database } from "./database";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"];

export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];

export type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
export type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];

export type DiscountRow = Database["public"]["Tables"]["discounts"]["Row"];
export type DiscountInsert = Database["public"]["Tables"]["discounts"]["Insert"];
export type DiscountUpdate = Database["public"]["Tables"]["discounts"]["Update"];
