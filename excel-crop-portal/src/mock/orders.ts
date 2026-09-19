import type { OrderSummary } from "../types/order";

/**
 * Placeholder data so the dashboard has something real to render.
 * Swap for `orderService.ts` calls once the API is wired up.
 */
export const MOCK_ORDERS: OrderSummary[] = [
  { id: "SO-1042", customerName: "Malik Agro Store", territory: "Multan City", region: "South Punjab", total: 184500, status: "PENDING_RECOMMENDATION", placedOn: "2026-09-16" },
  { id: "SO-1041", customerName: "Chishti Fertilizers", territory: "Multan City", region: "South Punjab", total: 96200, status: "RECOMMENDED", placedOn: "2026-09-15" },
  { id: "SO-1039", customerName: "Green Fields Traders", territory: "Vehari", region: "South Punjab", total: 412000, status: "APPROVED", placedOn: "2026-09-14" },
  { id: "SO-1035", customerName: "Al-Barkat Seeds", territory: "Khanewal", region: "South Punjab", total: 58000, status: "INVOICED", placedOn: "2026-09-12" },
  { id: "SO-1030", customerName: "Farmers Co-op Bahawalpur", territory: "Bahawalpur", region: "South Punjab", total: 271500, status: "REJECTED", placedOn: "2026-09-10" },
  { id: "SO-1028", customerName: "Zarai Traders", territory: "Multan City", region: "South Punjab", total: 63200, status: "SUBMITTED", placedOn: "2026-09-09" },
];
