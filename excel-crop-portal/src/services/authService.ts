import type { LoginCredentials, User } from "../types/auth";
import { findRequestByEmail } from "./registrationService";

/**
 * Mock authentication service.
 *
 * Demo accounts:
 *
 * Territory Manager:
 * Email: territory@excelcropgroup.com.pk
 * Password: password
 *
 * Regional Manager:
 * Email: regional@excelcropgroup.com.pk
 * Password: password
 *
 * Head Office:
 * Email: hq@excelcropgroup.com.pk
 * Password: password
 *
 * Admin:
 * Email: admin@excelcropgroup.com.pk
 * Password: admin123
 *
 * NOTE:
 * This is currently mock authentication.
 * Later this can be replaced with a real backend/API.
 */

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  // =====================================================
  // TERRITORY MANAGER
  // =====================================================

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

  // =====================================================
  // REGIONAL MANAGER
  // =====================================================

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

  // =====================================================
  // HEAD OFFICE
  // =====================================================

  "hq@excelcropgroup.com.pk": {
    password: "password",

    user: {
      id: "u-ho-1",
      name: "Sana Tariq",
      username: "hq@excelcropgroup.com.pk",
      role: "HEAD_OFFICE",
    },
  },

  // =====================================================
  // ADMIN
  // =====================================================

  "admin@excelcropgroup.com.pk": {
    password: "admin123",

    user: {
      id: "u-admin-1",
      name: "Excel Crop Group Admin",
      username: "admin@excelcropgroup.com.pk",
      role: "ADMIN",
    },
  },
};

const AUTH_STORAGE_KEY = "ecg_auth_user";

/** Thrown when credentials belong to a real registration request that isn't
 * an active account yet — lets the Login page style pending vs rejected differently. */
export class AccountStatusError extends Error {
  status: "PENDING" | "REJECTED";
  constructor(status: "PENDING" | "REJECTED", message: string) {
    super(message);
    this.name = "AccountStatusError";
    this.status = status;
  }
}

/**
 * Login user
 */
export async function login(
  credentials: LoginCredentials
): Promise<User> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 700));

  const username = credentials.username.trim().toLowerCase();

  const record = DEMO_USERS[username];

  if (record) {
    if (record.password !== credentials.password) {
      throw new Error("Invalid username or password.");
    }

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(record.user));
    return record.user;
  }

  // Not a demo/built-in account — check self-registered Manager accounts.
  // These only unlock after an Admin approves the request in the Admin Dashboard.
  const request = findRequestByEmail(username);

  if (request) {
    if (request.status === "PENDING") {
      throw new AccountStatusError(
        "PENDING",
        "Your account is pending Admin approval. Please wait for approval before logging in."
      );
    }

    if (request.status === "REJECTED") {
      throw new AccountStatusError(
        "REJECTED",
        "Your account request was rejected by Admin. Please contact Head Office."
      );
    }

    if (request.password !== credentials.password) {
      throw new Error("Invalid username or password.");
    }

    const user: User = {
      id: request.id,
      name: request.fullName,
      username: request.email,
      role: request.role,
      ...(request.role === "TERRITORY_MANAGER"
        ? { territory: request.location.city }
        : { region: request.location.district }),
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  // Invalid credentials
  throw new Error("Invalid username or password.");
}

/**
 * Logout current user
 */
export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

/** Built-in demo accounts, with passwords stripped — for the Admin > Users
 * read-only directory. Real deployments would list users from the backend
 * instead of this hard-coded table. */
export function getBuiltInAccounts(): User[] {
  return Object.values(DEMO_USERS).map((record) => record.user);
}

/**
 * Get currently logged-in user
 */
export function getStoredUser(): User | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}