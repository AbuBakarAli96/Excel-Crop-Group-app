/**
 * An organizational location a user can request access under.
 * Backed today by `mock/locations.ts`; swap that module's data source for a
 * real `/api/locations` call once the backend exposes one — nothing else
 * in the app needs to change, since everything consumes this shape.
 */
export type LocationType = "TERRITORY" | "REGION" | "HEAD_OFFICE";

export interface OrganizationalLocation {
  id: string;
  name: string;
  type: LocationType;
  /** Parent region name, only meaningful for TERRITORY entries */
  parentRegion?: string;
  /** The role a user is granted when their request under this location is approved */
  roleLabel: string;
}

export const LOCATION_TYPE_LABEL: Record<LocationType, string> = {
  TERRITORY: "Territory",
  REGION: "Region",
  HEAD_OFFICE: "Head Office",
};
