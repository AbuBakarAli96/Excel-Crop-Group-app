import { MOCK_CUSTOMERS } from "../mock/customers";
import type { Customer } from "../types/customer";

/**
 * Read-only helpers over the customer dataset. This is the one place to
 * change when customers move to a real `/api/customers` endpoint — every
 * caller (New Order form, future My Customers page) only ever imports from
 * here, never from `mock/customers.ts` directly.
 *
 * Territory scoping happens here, not just visually in the UI — the
 * frontend never receives or renders another territory's customers, so
 * even if the calling component were misused, out-of-territory customers
 * are not present in what it gets back. The backend should still enforce
 * this same restriction once it's connected.
 */
export function getCustomerById(id: string): Customer | undefined {
  return MOCK_CUSTOMERS.find((c) => c.id === id);
}

/** Customers belonging to a single territory — what a Territory Manager may see. */
export function getCustomersForTerritory(territory: string): Customer[] {
  return MOCK_CUSTOMERS.filter((c) => c.territory === territory);
}

/** All customers — for roles above Territory Manager (Regional Manager, Head Office). */
export function getAllCustomers(): Customer[] {
  return MOCK_CUSTOMERS;
}

export function searchCustomers(customers: Customer[], query: string): Customer[] {
  const q = query.trim().toLowerCase();
  if (!q) return customers;
  return customers.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.whatsapp.includes(q) ||
      c.address.toLowerCase().includes(q)
  );
}
