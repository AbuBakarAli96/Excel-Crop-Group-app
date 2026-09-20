import type { NewRegistrationInput, RegistrationRequest } from "../types/registration";

/**
 * Mock registration / admin-approval service.
 *
 * When a Territory or Regional Manager creates an account (Sign Up page),
 * the request is stored here with status "PENDING". The account cannot be
 * used to log in until an Admin approves it from the Admin Dashboard.
 *
 * NOTE: This is currently backed by localStorage (frontend-only mock).
 * Later this can be replaced with a real backend/API.
 */

const STORAGE_KEY = "ecg_registration_requests";
/** Fired whenever the request list changes, so the Admin sidebar badge can
 * refresh without polling (same-tab; unlike the native `storage` event). */
export const REGISTRATION_REQUESTS_CHANGED_EVENT = "ecg:registration-requests-changed";

function readAll(): RegistrationRequest[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as RegistrationRequest[];
  } catch {
    return [];
  }
}

function writeAll(requests: RegistrationRequest[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  window.dispatchEvent(new Event(REGISTRATION_REQUESTS_CHANGED_EVENT));
}

/**
 * Submit a new manager account request. Throws if an active (pending or
 * approved) request already exists for this email.
 */
export async function submitRequest(
  input: NewRegistrationInput
): Promise<RegistrationRequest> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 700));

  const requests = readAll();
  const email = input.email.trim().toLowerCase();

  const existing = requests.find(
    (r) => r.email === email && r.status !== "REJECTED"
  );

  if (existing) {
    throw new Error(
      existing.status === "PENDING"
        ? "An account request with this email is already pending Admin approval."
        : "An account with this email already exists."
    );
  }

  const request: RegistrationRequest = {
    id: `req-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    fullName: input.fullName.trim(),
    email,
    phone: input.phone.trim(),
    role: input.role,
    location: input.location,
    password: input.password,
    status: "PENDING",
    submittedAt: new Date().toISOString(),
  };

  requests.push(request);
  writeAll(requests);

  return request;
}

/** All requests, newest first — for the Admin Dashboard. */
export function getAllRequests(): RegistrationRequest[] {
  return readAll().sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
}

export function getPendingCount(): number {
  return readAll().filter((r) => r.status === "PENDING").length;
}

/** Look up a request by email — used during login to check account status. */
export function findRequestByEmail(
  email: string
): RegistrationRequest | undefined {
  const normalized = email.trim().toLowerCase();
  return readAll().find((r) => r.email === normalized);
}

export function approveRequest(id: string): void {
  const requests = readAll();
  const next = requests.map((r) =>
    r.id === id
      ? { ...r, status: "APPROVED" as const, decidedAt: new Date().toISOString() }
      : r
  );
  writeAll(next);
}

export function rejectRequest(id: string): void {
  const requests = readAll();
  const next = requests.map((r) =>
    r.id === id
      ? { ...r, status: "REJECTED" as const, decidedAt: new Date().toISOString() }
      : r
  );
  writeAll(next);
}
