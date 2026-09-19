import type { LoginCredentials, Role, User } from "../types/auth";
import { getRequestByEmail, acknowledgeRequest } from "./accessRequestService";
import type { LocationType } from "../types/location";

/**
 * Mock authentication service.
 * -----------------------------------------------------------------------
 * Replace `login()` with a real call to your API, e.g.:
 *
 *   const res = await fetch("/api/auth/login", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify(credentials),
 *   });
 *   if (!res.ok) throw new Error("Invalid username or password.");
 *   const { user, token } = await res.json();
 *
 * The three demo accounts below let you preview all three role-based
 * dashboards (see the Permission Matrix in the main project plan).
 * Any account created through the "Request Access" flow (see
 * accessRequestService.ts) is also handled here, once approved.
 */
const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "territory@excelcropgroup.com.pk": {
    password: "password",
    user: {
      id: "u-tm-1",
      name: "Ahmed Raza",
      username: "territory@excelcropgroup.com.pk",
      role: "TERRITORY_MANAGER",
      territory: "Multan City",
      region: "South Punjab",
    },
  },
  "regional@excelcropgroup.com.pk": {
    password: "password",
    user: {
      id: "u-rm-1",
      name: "Bilal Hussain",
      username: "regional@excelcropgroup.com.pk",
      role: "REGIONAL_MANAGER",
      region: "South Punjab",
    },
  },
  "hq@excelcropgroup.com.pk": {
    password: "password",
    user: {
      id: "u-ho-1",
      name: "Sana Tariq",
      username: "hq@excelcropgroup.com.pk",
      role: "HEAD_OFFICE",
    },
  },
};

const AUTH_STORAGE_KEY = "ecg_auth_user";

const ROLE_BY_LOCATION_TYPE: Record<LocationType, Role> = {
  TERRITORY: "TERRITORY_MANAGER",
  REGION: "REGIONAL_MANAGER",
  HEAD_OFFICE: "HEAD_OFFICE",
};

/** Thrown when credentials belong to a real access request that isn't an active account yet. */
export class AccessStatusError extends Error {
  status: "PENDING" | "REJECTED";
  locationName: string;
  constructor(status: "PENDING" | "REJECTED", locationName: string) {
    super(
      status === "PENDING"
        ? `Your access request for ${locationName} is still pending administrator approval.`
        : `Your access request for ${locationName} was not approved. Please contact your administrator.`
    );
    this.name = "AccessStatusError";
    this.status = status;
    this.locationName = locationName;
  }
}

export interface LoginResult {
  user: User;
  /** True only on the very first successful login right after HQ approval. */
  justApproved?: boolean;
  roleLabel?: string;
}

export async function login(credentials: LoginCredentials): Promise<LoginResult> {
  // simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 700));

  const username = credentials.username.trim().toLowerCase();

  // 1. Fixed demo accounts (unchanged behavior)
  const demo = DEMO_USERS[username];
  if (demo) {
    if (demo.password !== credentials.password) {
      throw new Error("Invalid username or password.");
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demo.user));
    return { user: demo.user };
  }

  // 2. Accounts created through the "Request Access" flow
  const request = getRequestByEmail(username);
  if (!request) {
    throw new Error("Invalid username or password.");
  }
  if (request.status === "PENDING" || request.status === "REJECTED") {
    throw new AccessStatusError(request.status, request.location.name);
  }
  // status === "APPROVED"
  if (request.password !== credentials.password) {
    throw new Error("Invalid username or password.");
  }

  const user: User = {
    id: request.id,
    name: request.name,
    username: request.email,
    role: ROLE_BY_LOCATION_TYPE[request.location.type],
    territory: request.location.type === "TERRITORY" ? request.location.name : undefined,
    region:
      request.location.type === "REGION"
        ? request.location.name
        : request.location.parentRegion,
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));

  const justApproved = !request.acknowledged;
  if (justApproved) acknowledgeRequest(request.id);

  return { user, justApproved, roleLabel: request.location.roleLabel };
}

export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
