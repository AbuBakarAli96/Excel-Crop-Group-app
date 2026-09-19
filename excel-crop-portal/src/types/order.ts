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
