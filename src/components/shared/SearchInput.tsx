"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value: externalValue,
  onChange,
  placeholder = "Search...",
  className,
  debounceMs = 300,
}) => {
  const [innerValue, setInnerValue] = useState(externalValue);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync internal state when parent updates
  useEffect(() => {
    setInnerValue(externalValue);
  }, [externalValue]);

  // Debounce notification to parent
  useEffect(() => {
    const handler = setTimeout(() => {
      if (innerValue !== externalValue) {
        onChange(innerValue);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [innerValue, externalValue, onChange, debounceMs]);

  // Global keyboard shortcut: press '/' or 'Ctrl+K' / 'Cmd+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if ((e.key === "/" && !isInput) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary shrink-0 pointer-events-none z-10 opacity-90" />
      <input
        ref={inputRef}
        type="text"
        value={innerValue}
        onChange={(e) => setInnerValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex h-10 w-full rounded-xl border border-input bg-background/80 pl-10 pr-12 py-2 text-xs font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all duration-200"
      />

      {/* Clear Button or Keyboard Shortcut Hint */}
      {innerValue ? (
        <button
          type="button"
          onClick={() => {
            setInnerValue("");
            onChange("");
            inputRef.current?.focus();
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : !isFocused ? (
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-muted/80 border border-border/60 text-[10px] font-semibold text-muted-foreground">
          <span>/</span>
        </div>
      ) : null}
    </div>
  );
};
