import type { AccessRequest, AccessRequestStatus } from "../types/accessRequest";
import type { OrganizationalLocation } from "../types/location";

/**
 * Mock access-request service (localStorage-backed).
 * -----------------------------------------------------------------------
 * This is the single integration point for the "Request Access" flow.
 * Every function below is a direct stand-in for a future REST call:
 *
 *   createRequest   → POST /api/access-requests
 *   getAllRequests  → GET  /api/access-requests            (admin only)
 *   getRequestByEmail → GET /api/access-requests?email=... (used by login)
 *   approveRequest  → POST /api/access-requests/:id/approve
 *   rejectRequest   → POST /api/access-requests/:id/reject
 *   acknowledgeRequest → POST /api/access-requests/:id/acknowledge
 *
 * Swap the body of each function for a `fetch(...)` call when the backend
 * is ready — callers (SignUp, Login, AccessRequests page) don't need to
 * change, since they only depend on this module's function signatures.
 */

const STORAGE_KEY = "ecg_access_requests";
/** Fired whenever the request list changes, so the sidebar badge / bell
 * dropdown can refresh without polling. Same-tab only (unlike the native
 * `storage` event, which only fires across tabs). */
export const ACCESS_REQUESTS_CHANGED_EVENT = "ecg:access-requests-changed";

function readAll(): AccessRequest[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedInitialRequests();
  try {
    return JSON.parse(raw) as AccessRequest[];
  } catch {
    return [];
  }
}

function writeAll(requests: AccessRequest[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  window.dispatchEvent(new Event(ACCESS_REQUESTS_CHANGED_EVENT));
}

/** Seeds one example pending request so the admin screen isn't empty on first run. */
function seedInitialRequests(): AccessRequest[] {
  const seed: AccessRequest[] = [
    {
      id: "req-seed-1",
      name: "Abu Bakar Ali",
      email: "abubakar.ali@excelcropgroup.com.pk",
      password: "password",
      location: {
        id: "loc-reg-sp",
        name: "South Punjab",
        type: "REGION",
        roleLabel: "Regional Manager",
      },
      status: "PENDING",
      submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
      acknowledged: false,
    },
  ];
  writeAll(seed);
  return seed;
}

export async function createRequest(input: {
  name: string;
  email: string;
  password: string;
  location: OrganizationalLocation;
}): Promise<AccessRequest> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const all = readAll();

  const existing = all.find((r) => r.email.toLowerCase() === input.email.trim().toLowerCase());
  if (existing) {
    throw new Error("An access request already exists for this email address.");
  }

  const request: AccessRequest = {
    id: `req-${Date.now()}`,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    password: input.password,
    location: input.location,
    status: "PENDING",
    submittedAt: new Date().toISOString(),
    acknowledged: false,
  };

  writeAll([request, ...all]);
  return request;
}

export async function getAllRequests(): Promise<AccessRequest[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return readAll();
}

export function getRequestByEmail(email: string): AccessRequest | null {
  const all = readAll();
  return all.find((r) => r.email.toLowerCase() === email.trim().toLowerCase()) ?? null;
}

async function setStatus(id: string, status: AccessRequestStatus): Promise<AccessRequest> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const all = readAll();
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) throw new Error("Request not found.");
  all[index] = { ...all[index], status };
  writeAll(all);
  return all[index];
}

export const approveRequest = (id: string) => setStatus(id, "APPROVED");
export const rejectRequest = (id: string) => setStatus(id, "REJECTED");

export function acknowledgeRequest(id: string): void {
  const all = readAll();
  const index = all.findIndex((r) => r.id === id);
  if (index === -1) return;
  all[index] = { ...all[index], acknowledged: true };
  writeAll(all);
}
