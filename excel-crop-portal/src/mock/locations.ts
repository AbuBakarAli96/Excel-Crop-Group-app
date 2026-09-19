import type { OrganizationalLocation } from "../types/location";

/**
 * Placeholder location directory for the access-request flow.
 * -----------------------------------------------------------------------
 * Replace with a real `GET /api/locations` call once the backend's
 * Master Data (Regions/Territories) module is live — the shape of
 * `OrganizationalLocation` is designed to map directly onto that table,
 * so no other file needs to change when this is swapped for a fetch.
 */
export const MOCK_LOCATIONS: OrganizationalLocation[] = [
  { id: "loc-hq", name: "Head Office", type: "HEAD_OFFICE", roleLabel: "Head Office" },
  { id: "loc-reg-sp", name: "South Punjab", type: "REGION", roleLabel: "Regional Manager" },
  { id: "loc-reg-cp", name: "Central Punjab", type: "REGION", roleLabel: "Regional Manager" },
  { id: "loc-reg-sindh", name: "Sindh", type: "REGION", roleLabel: "Regional Manager" },
  { id: "loc-ter-multan", name: "Multan City", type: "TERRITORY", parentRegion: "South Punjab", roleLabel: "Territory Manager" },
  { id: "loc-ter-vehari", name: "Vehari", type: "TERRITORY", parentRegion: "South Punjab", roleLabel: "Territory Manager" },
  { id: "loc-ter-khanewal", name: "Khanewal", type: "TERRITORY", parentRegion: "South Punjab", roleLabel: "Territory Manager" },
  { id: "loc-ter-bahawalpur", name: "Bahawalpur", type: "TERRITORY", parentRegion: "South Punjab", roleLabel: "Territory Manager" },
  { id: "loc-ter-lahore", name: "Lahore City", type: "TERRITORY", parentRegion: "Central Punjab", roleLabel: "Territory Manager" },
  { id: "loc-ter-faisalabad", name: "Faisalabad", type: "TERRITORY", parentRegion: "Central Punjab", roleLabel: "Territory Manager" },
  { id: "loc-ter-hyderabad", name: "Hyderabad", type: "TERRITORY", parentRegion: "Sindh", roleLabel: "Territory Manager" },
];
