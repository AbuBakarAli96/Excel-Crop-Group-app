import type { OrganizationalLocation } from "./location";

export type AccessRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AccessRequest {
  id: string;
  name: string;
  email: string;
  /** Stored only for the mock login flow — a real backend must hash this. */
  password: string;
  location: OrganizationalLocation;
  status: AccessRequestStatus;
  submittedAt: string;
  /** True once the applicant has logged in and seen the "access approved" banner. */
  acknowledged: boolean;
}
