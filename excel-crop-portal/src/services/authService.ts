import type { LoginCredentials, User } from "../types/auth";

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

export async function login(credentials: LoginCredentials): Promise<User> {
  // simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 700));

  const record = DEMO_USERS[credentials.username.trim().toLowerCase()];
  if (!record || record.password !== credentials.password) {
    throw new Error("Invalid username or password.");
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(record.user));
  return record.user;
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
