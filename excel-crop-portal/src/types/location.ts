/**
 * Structured location hierarchy: Country -> Province -> District -> City.
 * Backed today by `data/locations/pakistan.ts` (a static starter dataset).
 * Swap `locationService.ts`'s data source for a real `/api/locations`
 * endpoint later — nothing else needs to change, since every consumer
 * (LocationPicker, SignUp, Admin > Locations) only depends on these types
 * and on `locationService`'s function signatures.
 */

export interface District {
  name: string;
  /** Cities/towns within this district. Most districts list their own
   * namesake city first, plus any other well-known towns in the area. */
  cities: string[];
}

export interface Province {
  name: string;
  districts: District[];
}

export interface Country {
  name: string;
  provinces: Province[];
}

/** A single resolved location, as stored against a user/registration. */
export interface SelectedLocation {
  country: string;
  province: string;
  district: string;
  city: string;
  /** True when the city was typed manually rather than picked from the list
   * (i.e. it wasn't found in the current dataset). Lets an admin spot and
   * fold new cities into the dataset later. */
  isCustomCity?: boolean;
}
