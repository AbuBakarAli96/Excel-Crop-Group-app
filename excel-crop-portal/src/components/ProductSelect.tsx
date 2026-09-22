import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "../types/product";
import { IconSearch, IconChevronDown, IconCheck, IconTag } from "./icons";

interface ProductSelectProps {
  id?: string;
  placeholder?: string;
  options: Product[];
  value: Product | null;
  onChange: (product: Product) => void;
  error?: boolean;
}

const currency = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;

/**
 * Searchable product picker used per order line on the New Order form.
 * Mirrors LocationSelect / CustomerSelect's combobox pattern. Selecting a
 * product fills in pack size and price automatically — nothing here is
 * hand-typed by the Territory Manager.
 */
const ProductSelect: React.FC<ProductSelectProps> = ({
  id,
  placeholder = "Select a product…",
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
      (p) => !q || p.name.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q)
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

  const select = (p: Product) => {
    onChange(p);
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
              <IconTag size={14} />
            </span>
            <span className="truncate font-medium text-[var(--txt)]">{value.name}</span>
            <span className="hidden sm:inline text-[11px] text-[var(--txt3)] shrink-0">
              {value.packSize}
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
              placeholder="Search product name…"
              className="flex-1 min-w-0 outline-none text-[13.5px] bg-transparent"
              role="combobox"
              aria-expanded={open}
              aria-controls={`${id}-listbox`}
            />
          </div>

          <ul id={`${id}-listbox`} role="listbox" className="max-h-72 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-8 text-center text-[13px] text-[var(--txt3)]">
                No products match "{query}".
              </li>
            )}

            {filtered.map((p, i) => {
              const isSelected = value?.id === p.id;
              const isHighlighted = i === highlighted;

              return (
                <li role="none" key={p.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => select(p)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors"
                    style={{
                      background: isHighlighted ? "var(--g3)" : "transparent",
                      color: isSelected ? "var(--g1)" : "var(--txt)",
                    }}
                  >
                    <IconTag size={15} className="shrink-0 text-[var(--txt3)]" />
                    <span className="flex-1 min-w-0">
                      <span className="block truncate text-[13.5px] font-medium">{p.name}</span>
                      <span className="block truncate text-[11px] text-[var(--txt3)]">
                        {p.packSize} · {currency(p.unitPrice)}
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

export default ProductSelect;
