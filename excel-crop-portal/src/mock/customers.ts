import type { Customer } from "../types/customer";

/**
 * Placeholder data so the New Order form has real customers to select from.
 * Swap for `customerService.ts` API calls once the backend endpoint exists —
 * every caller already goes through that service, never this file directly.
 */
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "CUST-001",
    name: "Malik Agro Store",
    whatsapp: "03001234567",
    address: "Main Bazaar, Multan City",
    territory: "Multan City",
    region: "South Punjab",
    approvedLimit: 500000,
    currentBalance: 84500,
  },
  {
    id: "CUST-002",
    name: "Chishti Fertilizers",
    whatsapp: "03007654321",
    address: "Chowk Kumharanwala, Multan City",
    territory: "Multan City",
    region: "South Punjab",
    approvedLimit: 300000,
    currentBalance: 0,
  },
  {
    id: "CUST-003",
    name: "Zarai Traders",
    whatsapp: "03011122334",
    address: "Vehari Road, Multan City",
    territory: "Multan City",
    region: "South Punjab",
    approvedLimit: 200000,
    currentBalance: 12500,
  },
  {
    id: "CUST-004",
    name: "Green Fields Traders",
    whatsapp: "03214455667",
    address: "Chowk Azam, Vehari",
    territory: "Vehari",
    region: "South Punjab",
    approvedLimit: 450000,
    currentBalance: 61200,
  },
  {
    id: "CUST-005",
    name: "Al-Barkat Seeds",
    whatsapp: "03339988776",
    address: "Kacha Khoh Road, Khanewal",
    territory: "Khanewal",
    region: "South Punjab",
    approvedLimit: 150000,
  },
  {
    id: "CUST-006",
    name: "Delawar Agro Traders",
    whatsapp: "03451237890",
    address: "Chowk Godar, Muzaffargarh",
    territory: "Muzaffargarh",
    region: "South",
    approvedLimit: 350000,
    currentBalance: 22000,
  },
  {
    id: "CUST-007",
    name: "Wesendy Wali Spray Center",
    whatsapp: "03089871234",
    address: "Khan Spray Center, Muzaffargarh",
    territory: "Muzaffargarh",
    region: "South",
    approvedLimit: 250000,
  },
];
