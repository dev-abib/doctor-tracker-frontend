"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  icon?: React.ReactNode;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  className?: string;
  align?: "left" | "right";
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  icon,
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
  align = "left",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isSelected = value !== "" && value !== "all" && value !== "newest";
  const selectedOption = options.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens (if search is shown)
  useEffect(() => {
    if (isOpen && options.length > 7 && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen, options.length]);

  const filteredOptions = searchQuery
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  return (
    <div ref={containerRef} className={cn("relative inline-block text-left", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 h-9 px-3 rounded-xl border text-xs font-medium transition-all select-none cursor-pointer w-full text-left outline-none",
          isSelected
            ? "border-primary/40 bg-primary/10 text-primary font-semibold shadow-2xs"
            : "border-border/80 bg-card text-foreground/80 hover:border-border hover:bg-muted/60 hover:text-foreground",
          isOpen && "ring-2 ring-primary/20 border-primary/50"
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {icon && (
          <span className={cn("shrink-0", isSelected ? "text-primary" : "text-muted-foreground")}>
            {icon}
          </span>
        )}

        <span className="truncate flex-1">
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 opacity-60 transition-transform duration-200",
            isOpen && "rotate-180 opacity-100",
            isSelected ? "text-primary" : "text-muted-foreground"
          )}
        />
      </button>

      {/* Floating Modern Popover Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1.5 min-w-[200px] max-w-[280px] rounded-2xl border border-border/80 bg-card/95 p-1.5 shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150",
            align === "right" ? "right-0" : "left-0"
          )}
          role="listbox"
        >
          {/* Quick Search inside dropdown if many options */}
          {options.length > 7 && (
            <div className="relative mb-1.5 px-1 pt-0.5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search options..."
                className="h-8 w-full rounded-xl bg-muted/60 pl-8 pr-3 text-xs outline-none focus:bg-muted/80 placeholder:text-muted-foreground/70"
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto space-y-0.5 no-scrollbar pr-0.5">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                No matches found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isItemActive = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium text-left cursor-pointer transition-colors",
                      isItemActive
                        ? "bg-primary/15 text-primary font-semibold"
                        : "text-foreground hover:bg-muted/80 hover:text-foreground"
                    )}
                    role="option"
                    aria-selected={isItemActive}
                  >
                    <span className="truncate mr-2">{opt.label}</span>
                    {isItemActive && (
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
