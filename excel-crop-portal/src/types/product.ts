/**
 * A saved product record, including its current price and packing info.
 * Products (and their prices) are maintained centrally — a Territory
 * Manager only ever selects from this list on the New Order form, never
 * types product details by hand. Shared with the future Price List page.
 */
export interface Product {
  id: string;
  name: string;
  category?: string;
  /** e.g. "1L", "500ML", "1KG" */
  packSize: string;
  /** Price per pack, before any order-line discount. */
  unitPrice: number;
  /** Carton/packing info, e.g. "12 x 1L / carton". Optional — not every product has it. */
  packing?: string;
}
