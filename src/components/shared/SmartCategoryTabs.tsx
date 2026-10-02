"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CategoryGroup {
  label: string;
  value: string;
  count?: number;
  icon?: React.ReactNode;
  conditions?: string[]; // Sub-conditions matching this group
}

interface SmartCategoryTabsProps {
  categories: CategoryGroup[];
  allConditions?: string[];
  selectedCondition: string;
  onSelectCondition: (condition: string) => void;
  className?: string;
}

export const SmartCategoryTabs: React.FC<SmartCategoryTabsProps> = ({
  categories,
  allConditions = [],
  selectedCondition,
  onSelectCondition,
  className,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isDropdownOpen]);

  // Determine if active condition is one of the main tabs or from dropdown
  const isCustomConditionSelected =
    Boolean(selectedCondition) &&
    !categories.some((c) => c.value === selectedCondition);

  const filteredConditions = allConditions.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {/* Primary Category Tabs */}
      {categories.map((cat) => {
        const isActive =
          cat.value === ""
            ? !selectedCondition
            : selectedCondition === cat.value ||
              (cat.conditions && cat.conditions.includes(selectedCondition));

        return (
          <button
            key={cat.label}
            type="button"
            onClick={() => onSelectCondition(cat.value === selectedCondition ? "" : cat.value)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-2xs",
              isActive
                ? "bg-primary text-primary-foreground shadow-xs shadow-primary/25 scale-[1.01]"
                : "bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/60"
            )}
          >
            {cat.icon}
            <span>{cat.label}</span>
            {cat.count !== undefined && (
              <span
                className={cn(
                  "ml-0.5 rounded-md px-1.5 py-0.2 text-[10px] font-bold",
                  isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                )}
              >
                {cat.count}
              </span>
            )}
          </button>
        );
      })}

      {/* Selected Custom Condition Pill (if chosen from dropdown) */}
      {isCustomConditionSelected && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground shadow-xs shadow-primary/25">
          <span>{selectedCondition}</span>
          <button
            type="button"
            onClick={() => onSelectCondition("")}
            className="hover:bg-white/20 rounded-full p-0.5 transition-colors cursor-pointer"
            title="Clear filter"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      )}

      {/* 'More Diagnoses' Dropdown Popover */}
      {allConditions.length > 0 && (
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              "inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border",
              isDropdownOpen || isCustomConditionSelected
                ? "bg-muted/80 text-foreground border-primary/40 shadow-xs"
                : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/60"
            )}
            aria-haspopup="listbox"
            aria-expanded={isDropdownOpen}
          >
            <span>All Diagnoses ({allConditions.length})</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-200 opacity-60",
                isDropdownOpen && "rotate-180 opacity-100"
              )}
            />
          </button>

          {/* Floating Diagnoses Popover */}
          {isDropdownOpen && (
            <div className="absolute z-50 left-0 sm:right-0 sm:left-auto mt-1.5 w-72 rounded-2xl border border-border/80 bg-card/95 p-2 shadow-2xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150">
              <div className="relative mb-2 px-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search all diagnoses..."
                  className="h-8 w-full rounded-xl bg-muted/60 pl-8 pr-3 text-xs font-medium outline-none focus:bg-muted/90 placeholder:text-muted-foreground"
                />
              </div>

              <div className="max-h-56 overflow-y-auto space-y-0.5 no-scrollbar pr-0.5">
                {filteredConditions.length === 0 ? (
                  <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                    No matching diagnoses found
                  </div>
                ) : (
                  filteredConditions.map((cond) => {
                    const isSelected = selectedCondition === cond;
                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => {
                          onSelectCondition(isSelected ? "" : cond);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          "flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium text-left cursor-pointer transition-colors",
                          isSelected
                            ? "bg-primary/15 text-primary font-bold"
                            : "text-foreground hover:bg-muted/80"
                        )}
                      >
                        <span className="truncate mr-2">{cond}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
