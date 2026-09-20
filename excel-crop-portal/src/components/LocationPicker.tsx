import React, { useMemo, useState } from "react";
import type { SelectedLocation } from "../types/location";
import {
  getProvinces,
  getDistricts,
  getCities,
  searchCities,
  cityExistsInDataset,
} from "../services/locationService";
import { IconSearch, IconMap, IconChevronDown, IconCheck } from "./icons";

type Mode = "search" | "browse";

interface LocationPickerProps {
  value: SelectedLocation | null;
  onChange: (location: SelectedLocation) => void;
  error?: boolean;
}

const SelectField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
}> = ({ value, onChange, options, placeholder, disabled }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="ecg-input appearance-none pr-9 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    <IconChevronDown
      size={15}
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--txt3)]"
    />
  </div>
);

/**
 * Country -> Province -> District -> City picker.
 * Two ways in: type-ahead search across every city in the dataset, or a
 * classic cascading Province -> District -> City browse. Either path can
 * fall back to a manually-typed city name when it isn't in the dataset yet.
 */
const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, error }) => {
  const [mode, setMode] = useState<Mode>("search");
  const [query, setQuery] = useState("");
  const [manualEntry, setManualEntry] = useState(false);

  const [province, setProvince] = useState(value?.province ?? "");
  const [district, setDistrict] = useState(value?.district ?? "");
  const [manualCity, setManualCity] = useState("");

  const provinces = useMemo(() => getProvinces().map((p) => p.name), []);
  const districts = useMemo(() => (province ? getDistricts(province).map((d) => d.name) : []), [province]);
  const cities = useMemo(() => (province && district ? getCities(province, district) : []), [province, district]);

  const results = useMemo(() => searchCities(query), [query]);

  const selectResolved = (province_: string, district_: string, city_: string, isCustom = false) => {
    onChange({ country: "Pakistan", province: province_, district: district_, city: city_, isCustomCity: isCustom });
  };

  const handleProvinceChange = (v: string) => {
    setProvince(v);
    setDistrict("");
  };

  const handleDistrictChange = (v: string) => {
    setDistrict(v);
    const opts = v ? getCities(province, v) : [];
    if (opts.length === 1) {
      selectResolved(province, v, opts[0]);
    }
  };

  const handleManualConfirm = () => {
    if (!province || !manualCity.trim()) return;
    selectResolved(province, district || "Other", manualCity.trim(), !cityExistsInDataset(manualCity));
  };

  if (value && !manualEntry) {
    return (
      <div
        className="flex items-center justify-between gap-3 px-3.5 py-2.5"
        style={{ background: "var(--g3)", borderRadius: "var(--rad)", border: "1px solid #cde8cd" }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="h-8 w-8 rounded-[8px] flex items-center justify-center shrink-0"
            style={{ background: "var(--g1)", color: "#fff" }}
          >
            <IconMap size={15} />
          </span>
          <div className="min-w-0">
            <div className="text-[13.5px] font-bold text-[var(--txt)] truncate">
              {value.city}
              {value.isCustomCity && (
                <span className="ml-1.5 text-[10.5px] font-semibold text-[var(--o1)]">(new)</span>
              )}
            </div>
            <div className="text-[11.5px] text-[var(--txt2)] truncate">
              {value.district} · {value.province}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setManualEntry(false);
            onChange({ ...value, city: "" });
          }}
          className="text-[12px] font-semibold shrink-0"
          style={{ color: "var(--g1)" }}
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode("search")}
          className={`ecg-pill ${mode === "search" ? "ecg-pill-active" : ""}`}
        >
          <IconSearch size={13} /> Search city
        </button>
        <button
          type="button"
          onClick={() => setMode("browse")}
          className={`ecg-pill ${mode === "browse" ? "ecg-pill-active" : ""}`}
        >
          <IconMap size={13} /> Browse by region
        </button>
      </div>

      {mode === "search" && !manualEntry && (
        <div className="relative">
          <div className="relative">
            <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--txt3)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Start typing a city name, e.g. Multan"
              className={`ecg-input pl-9 ${error ? "ecg-input-error" : ""}`}
            />
          </div>

          {query.trim().length > 0 && (
            <div
              className="mt-2 max-h-56 overflow-y-auto bg-white"
              style={{ borderRadius: "var(--rad)", border: "1px solid var(--border)", boxShadow: "var(--sh)" }}
            >
              {results.length === 0 && (
                <div className="px-3.5 py-4 text-center text-[12.5px] text-[var(--txt2)]">
                  No matches for "{query}".
                </div>
              )}
              {results.map((r) => (
                <button
                  key={`${r.province}-${r.district}-${r.city}`}
                  type="button"
                  onClick={() => selectResolved(r.province, r.district, r.city)}
                  className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-left hover:bg-[var(--g3)] transition-colors"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <span className="text-[13px] font-medium text-[var(--txt)]">{r.city}</span>
                  <span className="text-[11px] text-[var(--txt3)] shrink-0">
                    {r.district} · {r.province}
                  </span>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setManualEntry(true)}
            className="mt-2 text-[12px] font-semibold"
            style={{ color: "var(--g1)" }}
          >
            Can't find your city? Enter it manually
          </button>
        </div>
      )}

      {mode === "browse" && !manualEntry && (
        <div className="grid sm:grid-cols-3 gap-3">
          <SelectField value={province} onChange={handleProvinceChange} options={provinces} placeholder="Province" />
          <SelectField
            value={district}
            onChange={handleDistrictChange}
            options={districts}
            placeholder="District"
            disabled={!province}
          />
          <SelectField
            value=""
            onChange={(v) => selectResolved(province, district, v)}
            options={cities}
            placeholder="City"
            disabled={!district || cities.length <= 1}
          />
        </div>
      )}

      {manualEntry && (
        <div>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <SelectField value={province} onChange={handleProvinceChange} options={provinces} placeholder="Province" />
            <SelectField
              value={district}
              onChange={setDistrict}
              options={districts}
              placeholder="District (optional)"
              disabled={!province}
            />
          </div>
          <div className="flex gap-2">
            <input
              value={manualCity}
              onChange={(e) => setManualCity(e.target.value)}
              placeholder="Type your city name"
              className="ecg-input"
            />
            <button
              type="button"
              onClick={handleManualConfirm}
              disabled={!province || !manualCity.trim()}
              className="ecg-btn ecg-btn-primary shrink-0"
            >
              <IconCheck size={15} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setManualEntry(false)}
            className="mt-2 text-[12px] font-semibold"
            style={{ color: "var(--g1)" }}
          >
            ← Back to search / browse
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
