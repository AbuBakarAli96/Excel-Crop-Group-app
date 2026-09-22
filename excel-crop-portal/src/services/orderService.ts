import type { NewOrderDraft, OrderLineItem } from "../types/order";

/**
 * Mock order submission service. Swap the body of `submitOrder` for a real
 * `POST /api/orders` call once the backend endpoint exists — the New Order
 * form only ever calls this function, never touches the mock data directly.
 */

export function lineNetPrice(item: OrderLineItem): number {
  return item.unitPrice * (1 - item.discountPercent / 100);
}

export function lineAmount(item: OrderLineItem): number {
  return lineNetPrice(item) * item.packs;
}

export function draftTotal(items: OrderLineItem[]): number {
  return items.reduce((sum, item) => sum + lineAmount(item), 0);
}

let nextOrderNumber = 1043;

export interface SubmittedOrder {
  id: string;
  total: number;
}

export async function submitOrder(draft: NewOrderDraft): Promise<SubmittedOrder> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 900));

  if (!draft.customerId) {
    throw new Error("Please select a customer before submitting the order.");
  }
  if (draft.items.length === 0 || draft.items.every((i) => i.packs <= 0)) {
    throw new Error("Add at least one product with a quantity before submitting.");
  }

  const id = `SO-${nextOrderNumber++}`;
  const total = draftTotal(draft.items);

  // In this mock we don't persist to a shared store — a real API call
  // would return the created order, and the dashboard/order list would
  // refetch from the backend rather than reading static mock data.
  return { id, total };
}
