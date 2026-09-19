import React, { useEffect, useMemo, useRef, useState } from "react";
import type { LocationType, OrganizationalLocation } from "../types/location";
import { LOCATION_TYPE_LABEL } from "../types/location";
import { IconBuilding, IconMap, IconSearch, IconChevronDown, IconCheck } from "./icons";

const TYPE_ORDER: LocationType[] = ["HEAD_OFFICE", "REGION", "TERRITORY"];
const TYPE_ICON: Record<LocationType, React.ComponentType<{ size?: number; className?: string }>> = {
  HEAD_OFFICE: IconBuilding,
  REGION: IconMap,
  TERRITORY: IconMap,
};

interface LocationSelectProps {
  id?: string;
  label?: string;
  placeholder?: string;
  options: OrganizationalLocation[];
  value: OrganizationalLocation | null;
  onChange: (location: OrganizationalLocation) => void;
  error?: boolean;
}

/**
 * Searchable, keyboard-accessible location picker used on the Sign Up /
 * Request Access form. Deliberately built as a custom component rather
 * than a native <select> — a real org directory (territories + regions +
 * head office) is too long to browse comfortably in a native dropdown,
 * especially on mobile.
 */
const LocationSelect: React.FC<LocationSelectProps> = ({
  id,
  label,
  placeholder = "Search for your territory, region or office…",
  options,
  value,
  onChange,
  error,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return options
      .filter(
        (loc) =>
          !q ||
          loc.name.toLowerCase().includes(q) ||
          loc.parentRegion?.toLowerCase().includes(q) ||
          LOCATION_TYPE_LABEL[loc.type].toLowerCase().includes(q)
      )
      .sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type));
  }, [options, query]);

  // Precompute which rows need a group-type header, without mutating a
  // variable from inside the render-time .map() below.
  const rows = useMemo(
    () =>
      filtered.reduce<{ loc: OrganizationalLocation; showHeader: boolean }[]>((acc, loc) => {
        const prevType = acc.length > 0 ? acc[acc.length - 1].loc.type : null;
        acc.push({ loc, showHeader: loc.type !== prevType });
        return acc;
      }, []),
    [filtered]
  );

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    // let the panel mount before focusing so layout doesn't jump
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const openDropdown = () => {
    setOpen(true);
    setHighlighted(0);
  };

  const closeDropdown = () => {
    setOpen(false);
    setQuery("");
    setHighlighted(0);
  };

  const select = (loc: OrganizationalLocation) => {
    onChange(loc);
    closeDropdown();
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setHighlighted(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlighted]) select(filtered[highlighted]);
    } else if (e.key === "Escape") {
      closeDropdown();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label htmlFor={id} className="block mb-1.5 text-[13px] font-semibold text-[var(--txt)]">
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        onClick={() => (open ? closeDropdown() : openDropdown())}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`ecg-input flex items-center justify-between gap-2 text-left ${error ? "ecg-input-error" : ""}`}
      >
        {value ? (
          <span className="flex items-center gap-2 min-w-0">
            <span
              className="h-7 w-7 rounded-[7px] flex items-center justify-center shrink-0"
              style={{ background: "var(--g3)", color: "var(--g1)" }}
            >
              {React.createElement(TYPE_ICON[value.type], { size: 14 })}
            </span>
            <span className="truncate font-medium text-[var(--txt)]">{value.name}</span>
            <span className="hidden sm:inline text-[11px] text-[var(--txt3)] shrink-0">
              {LOCATION_TYPE_LABEL[value.type]}
            </span>
          </span>
        ) : (
          <span className="text-[var(--txt3)] truncate">{placeholder}</span>
        )}
        <IconChevronDown size={16} className={`text-[var(--txt3)] shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full bg-white overflow-hidden"
          style={{ borderRadius: "var(--rad2)", boxShadow: "var(--sh2)", border: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: "1px solid var(--border)" }}>
            <IconSearch size={16} className="text-[var(--txt3)] shrink-0" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search territory or region…"
              className="flex-1 min-w-0 outline-none text-[13.5px] bg-transparent"
              role="combobox"
              aria-expanded={open}
              aria-controls={`${id}-listbox`}
            />
          </div>

          <ul id={`${id}-listbox`} role="listbox" className="max-h-64 overflow-y-auto py-1">
            {rows.length === 0 && (
              <li className="px-3 py-8 text-center text-[13px] text-[var(--txt3)]">
                No locations match "{query}".
              </li>
            )}

            {rows.map(({ loc, showHeader }, i) => {
              const Icon = TYPE_ICON[loc.type];
              const isSelected = value?.id === loc.id;
              const isHighlighted = i === highlighted;

              return (
                <React.Fragment key={loc.id}>
                  {showHeader && (
                    <li
                      role="presentation"
                      className="px-3 pt-2.5 pb-1 text-[10.5px] font-bold uppercase tracking-wide text-[var(--txt3)]"
                    >
                      {LOCATION_TYPE_LABEL[loc.type]}
                    </li>
                  )}
                  <li role="none">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setHighlighted(i)}
                      onClick={() => select(loc)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors"
                      style={{
                        background: isHighlighted ? "var(--g3)" : "transparent",
                        color: isSelected ? "var(--g1)" : "var(--txt)",
                      }}
                    >
                      <Icon size={15} className="shrink-0 text-[var(--txt3)]" />
                      <span className="flex-1 min-w-0 truncate text-[13.5px] font-medium">{loc.name}</span>
                      {loc.parentRegion && (
                        <span className="hidden sm:inline text-[11px] text-[var(--txt3)] shrink-0">
                          {loc.parentRegion}
                        </span>
                      )}
                      {isSelected && <IconCheck size={15} className="shrink-0" />}
                    </button>
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationSelect;
