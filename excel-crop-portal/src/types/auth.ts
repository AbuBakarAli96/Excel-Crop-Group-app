export type Role =
  | "TERRITORY_MANAGER"
  | "REGIONAL_MANAGER"
  | "HEAD_OFFICE"
  | "ADMIN";

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;

  /** Territory name, only meaningful for TERRITORY_MANAGER */
  territory?: string;

  /** Region name, meaningful for REGIONAL_MANAGER and HEAD_OFFICE */
  region?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export const ROLE_LABEL: Record<Role, string> = {
  TERRITORY_MANAGER: "Territory Manager",
  REGIONAL_MANAGER: "Regional Manager",
  HEAD_OFFICE: "Head Office",
  ADMIN: "Admin",
};