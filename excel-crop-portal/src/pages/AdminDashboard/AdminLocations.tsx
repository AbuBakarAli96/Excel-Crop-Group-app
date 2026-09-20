import React, { useMemo, useState } from "react";
import { getProvinces, searchCities } from "../../services/locationService";
import { IconSearch, IconMap, IconChevronDown, IconBuilding } from "../../components/icons";

const AdminLocations: React.FC = () => {
  const provinces = getProvinces();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(provinces[0]?.name ?? null);

  const results = useMemo(() => (query.trim() ? searchCities(query, 30) : []), [query]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="stitle">Locations</h1>
        <p className="text-[12.5px] text-[var(--txt2)] mt-1 ml-[14px]">
          The structured Country → Province → District → City directory used by the Sign Up location picker.
        </p>
      </div>

      <div className="relative mb-6 max-w-md">
        <IconSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--txt3)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search any city…"
          className="ecg-input pl-9"
        />
      </div>

      {query.trim() && (
        <div className="ecg-card mb-6 overflow-hidden">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-[13px] text-[var(--txt2)]">No cities match "{query}".</div>
          ) : (
            results.map((r, i) => (
              <div
                key={`${r.province}-${r.district}-${r.city}`}
                className="flex items-center justify-between px-4 py-2.5"
                style={{ borderTop: i === 0 ? "none" : "1px solid var(--border)" }}
              >
                <span className="text-[13px] font-medium text-[var(--txt)]">{r.city}</span>
                <span className="text-[11.5px] text-[var(--txt3)]">{r.district} · {r.province}</span>
              </div>
            ))
          )}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {provinces.map((province) => {
          const cityCount = province.districts.reduce((sum, d) => sum + d.cities.length, 0);
          const isOpen = expanded === province.name;
          return (
            <div key={province.name} className="ecg-card overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : province.name)}
                className="w-full flex items-center justify-between gap-3 px-4 md:px-5 py-3.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="h-9 w-9 rounded-[9px] flex items-center justify-center shrink-0"
                    style={{ background: "#fff0e6", color: "var(--o1)" }}
                  >
                    <IconMap size={16} />
                  </span>
                  <div className="text-left min-w-0">
                    <div className="text-[13.5px] font-bold text-[var(--txt)] truncate">{province.name}</div>
                    <div className="text-[11.5px] text-[var(--txt2)]">
                      {province.districts.length} districts · {cityCount} cities
                    </div>
                  </div>
                </div>
                <IconChevronDown
                  size={16}
                  className={`text-[var(--txt3)] shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isOpen && (
                <div className="px-4 md:px-5 pb-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5" style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                  {province.districts.map((district) => (
                    <div key={district.name} className="p-3" style={{ background: "var(--bg)", borderRadius: "var(--rad)" }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <IconBuilding size={13} className="text-[var(--g1)] shrink-0" />
                        <span className="text-[12.5px] font-bold text-[var(--txt)] truncate">{district.name}</span>
                      </div>
                      <div className="text-[11.5px] text-[var(--txt2)] leading-relaxed">
                        {district.cities.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminLocations;
