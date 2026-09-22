import type { Product } from "../types/product";

/**
 * Placeholder data so the New Order form has real products to select from.
 * Swap for `priceService.ts` API calls once the backend endpoint exists —
 * every caller already goes through that service, never this file directly.
 */
export const MOCK_PRODUCTS: Product[] = [
  { id: "PRD-001", name: "Buprofezin 25% WP", category: "Insecticide", packSize: "1KG", unitPrice: 2200, packing: "10 x 1KG / carton" },
  { id: "PRD-002", name: "Chass 10% EC", category: "Insecticide", packSize: "1L", unitPrice: 1850, packing: "12 x 1L / carton" },
  { id: "PRD-003", name: "Dinotefuran 20% SG", category: "Insecticide", packSize: "500G", unitPrice: 3100, packing: "20 x 500G / carton" },
  { id: "PRD-004", name: "Fide 25% WDG", category: "Fungicide", packSize: "1KG", unitPrice: 2650, packing: "10 x 1KG / carton" },
  { id: "PRD-005", name: "Glyphosate 48% EC", category: "Herbicide", packSize: "1L", unitPrice: 950, packing: "12 x 1L / carton" },
  { id: "PRD-006", name: "Hit More 2.5% EC", category: "Insecticide", packSize: "1L", unitPrice: 1400, packing: "12 x 1L / carton" },
  { id: "PRD-007", name: "Honest 30%", category: "Insecticide", packSize: "1L", unitPrice: 1750, packing: "12 x 1L / carton" },
  { id: "PRD-008", name: "Kill Crown 20% SC", category: "Fungicide", packSize: "1L", unitPrice: 2050, packing: "12 x 1L / carton" },
  { id: "PRD-009", name: "Multiplier 13.5%", category: "Herbicide", packSize: "1L", unitPrice: 1300, packing: "12 x 1L / carton" },
  { id: "PRD-010", name: "One Kill 3% SC", category: "Insecticide", packSize: "1L", unitPrice: 1600, packing: "12 x 1L / carton" },
  { id: "PRD-011", name: "Paraquat 24% SL", category: "Herbicide", packSize: "1L", unitPrice: 880, packing: "12 x 1L / carton" },
  { id: "PRD-012", name: "Recall 42% EC", category: "Insecticide", packSize: "1L", unitPrice: 1950, packing: "12 x 1L / carton" },
  { id: "PRD-013", name: "Sorter 40% EC", category: "Herbicide", packSize: "1L", unitPrice: 1100, packing: "12 x 1L / carton" },
  { id: "PRD-014", name: "Safe All 80% WG", category: "Fungicide", packSize: "1KG", unitPrice: 2400, packing: "10 x 1KG / carton" },
  { id: "PRD-015", name: "Treaty 6% ME", category: "Insecticide", packSize: "1L", unitPrice: 2900, packing: "12 x 1L / carton" },
  { id: "PRD-016", name: "X-Clean 5% EC", category: "Herbicide", packSize: "1L", unitPrice: 780, packing: "12 x 1L / carton" },
];
