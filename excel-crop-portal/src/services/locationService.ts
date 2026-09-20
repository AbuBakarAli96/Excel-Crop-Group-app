import { PAKISTAN } from "../data/locations/pakistan";
import type { Province, District } from "../types/location";

/**
 * Read-only helpers over the static location dataset (`data/locations/pakistan.ts`).
 * This is the one place to change when the data source moves to a real
 * `/api/locations` endpoint — every caller (LocationPicker, SignUp,
 * Admin > Locations) only ever imports from here, never from the raw dataset.
 */

export interface FlatCity {
  province: string;
  district: string;
  city: string;
}

export function getCountryName(): string {
  return PAKISTAN.name;
}

export function getProvinces(): Province[] {
  return PAKISTAN.provinces;
}

export function getDistricts(provinceName: string): District[] {
  return PAKISTAN.provinces.find((p) => p.name === provinceName)?.districts ?? [];
}

export function getCities(provinceName: string, districtName: string): string[] {
  return getDistricts(provinceName).find((d) => d.name === districtName)?.cities ?? [];
}

/** Every city in the dataset, flattened with its province/district, for the
 * cross-hierarchy search box (type a city name without picking province/district first). */
export function getAllCitiesFlat(): FlatCity[] {
  const flat: FlatCity[] = [];
  for (const province of PAKISTAN.provinces) {
    for (const district of province.districts) {
      for (const city of district.cities) {
        flat.push({ province: province.name, district: district.name, city });
      }
    }
  }
  return flat;
}

export function searchCities(query: string, limit = 20): FlatCity[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getAllCitiesFlat()
    .filter((entry) => entry.city.toLowerCase().includes(q))
    .slice(0, limit);
}

/** True if the given city name exists in the dataset (case-insensitive, any district). */
export function cityExistsInDataset(cityName: string): boolean {
  const q = cityName.trim().toLowerCase();
  return getAllCitiesFlat().some((entry) => entry.city.toLowerCase() === q);
}
