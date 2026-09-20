import type { SelectedLocation } from "./location";

export type RequestedRole = "TERRITORY_MANAGER" | "REGIONAL_MANAGER";

export type RegistrationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface RegistrationRequest {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: RequestedRole;
  /** Structured Country -> Province -> District -> City, picked via LocationPicker. */
  location: SelectedLocation;
  password: string;
  status: RegistrationStatus;
  submittedAt: string;
  decidedAt?: string;
}

export interface NewRegistrationInput {
  fullName: string;
  email: string;
  phone: string;
  role: RequestedRole;
  location: SelectedLocation;
  password: string;
}
