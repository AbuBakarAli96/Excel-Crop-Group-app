import { MOCK_PRODUCTS } from "../mock/products";
import type { Product } from "../types/product";

/**
 * Read-only helpers over the product/price master dataset. This is the one
 * place to change when products move to a real `/api/products` endpoint —
 * every caller (New Order form, future Price List page) only ever imports
 * from here, never from `mock/products.ts` directly.
 */
export function getProducts(): Product[] {
  return MOCK_PRODUCTS;
}

export function getProductById(id: string): Product | undefined {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
  );
}
