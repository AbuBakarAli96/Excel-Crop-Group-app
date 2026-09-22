import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Customer } from "../types/customer";
import { IconSearch, IconChevronDown, IconCheck, IconUsers } from "./icons";

interface CustomerSelectProps {
  id?: string;
  label?: string;
  placeholder?: string;
  /** Already territory-scoped by the caller — this component never re-filters by territory. */
  options: Customer[];
  value: Customer | null;
  onChange: (customer: Customer) => void;
  error?: boolean;
}

/**
 * Searchable, keyboard-accessible customer picker used on the New Order
 * form. A Territory Manager only ever picks from this list — customer
 * details are never hand-typed. Mirrors LocationSelect's combobox pattern
 * for visual and interaction consistency.
 */
const CustomerSelect: React.FC<CustomerSelectProps> = ({
  id,
  label,
  placeholder = "Search for a customer…",
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
    return options.filter(
      (c) =>
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.whatsapp.includes(q) ||
        c.address.toLowerCase().includes(q)
    );
  }, [options, query]);

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

  const select = (c: Customer) => {
    onChange(c);
    closeDropdown();
  };

  const handleQueryChange = (v: string) => {
    setQuery(v);
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
              <IconUsers size={14} />
            </span>
            <span className="truncate font-medium text-[var(--txt)]">{value.name}</span>
            <span className="hidden sm:inline text-[11px] text-[var(--txt3)] shrink-0 truncate">
              {value.territory}
            </span>
          </span>
        ) : (
          <span className="text-[var(--txt3)] truncate">{placeholder}</span>
        )}
        <IconChevronDown
          size={16}
          className={`text-[var(--txt3)] shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
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
              placeholder="Search name, phone or address…"
              className="flex-1 min-w-0 outline-none text-[13.5px] bg-transparent"
              role="combobox"
              aria-expanded={open}
              aria-controls={`${id}-listbox`}
            />
          </div>

          <ul id={`${id}-listbox`} role="listbox" className="max-h-72 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-8 text-center text-[13px] text-[var(--txt3)]">
                {options.length === 0
                  ? "No customers found for your territory yet."
                  : `No customers match "${query}".`}
              </li>
            )}

            {filtered.map((c, i) => {
              const isSelected = value?.id === c.id;
              const isHighlighted = i === highlighted;

              return (
                <li role="none" key={c.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => select(c)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors"
                    style={{
                      background: isHighlighted ? "var(--g3)" : "transparent",
                      color: isSelected ? "var(--g1)" : "var(--txt)",
                    }}
                  >
                    <IconUsers size={15} className="shrink-0 text-[var(--txt3)]" />
                    <span className="flex-1 min-w-0">
                      <span className="block truncate text-[13.5px] font-medium">{c.name}</span>
                      <span className="block truncate text-[11px] text-[var(--txt3)]">
                        {c.whatsapp} · {c.address}
                      </span>
                    </span>
                    {isSelected && <IconCheck size={15} className="shrink-0" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomerSelect;
