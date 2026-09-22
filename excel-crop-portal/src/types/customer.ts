/**
 * A saved customer record. Customers are created by Management/Admin and
 * looked up (never hand-typed) by a Territory Manager when creating an
 * order — see CustomerSelect + customerService.
 */
export interface Customer {
  id: string;
  name: string;
  whatsapp: string;
  address: string;
  territory: string;
  region: string;
  /** Optional — shown as read-only context on the New Order form when present. */
  approvedLimit?: number;
  /** Optional — current outstanding balance, shown as read-only context. */
  currentBalance?: number;
}
