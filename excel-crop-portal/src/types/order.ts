export type OrderStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PENDING_RECOMMENDATION"
  | "RECOMMENDED"
  | "APPROVED"
  | "REJECTED"
  | "INVOICED";

export interface OrderSummary {
  id: string;
  customerName: string;
  territory: string;
  region: string;
  total: number;
  status: OrderStatus;
  placedOn: string;
}

/** Payment terms, matching the paper Sales Order Form's checkbox options. */
export type PaymentTerm = "ADVANCE_CASH" | "CASH_ON_DELIVERY" | "REVOLVING_CREDIT";

export const PAYMENT_TERM_LABEL: Record<PaymentTerm, string> = {
  ADVANCE_CASH: "Advance Cash",
  CASH_ON_DELIVERY: "Cash On Delivery",
  REVOLVING_CREDIT: "Revolving Credit",
};

/** One product row on the New Order form. */
export interface OrderLineItem {
  /** Local row id (for React keys / add-remove), not a server id. */
  rowId: string;
  productId: string;
  productName: string;
  packSize: string;
  packs: number;
  unitPrice: number;
  discountPercent: number;
}

/** The in-progress order being built on the New Order form. */
export interface NewOrderDraft {
  customerId: string | null;
  paymentTerm: PaymentTerm;
  remarks: string;
  items: OrderLineItem[];
}

