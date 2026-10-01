"use client";

import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
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

  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        value={innerValue}
        onChange={(e) => setInnerValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-8"
      />
      {innerValue && (
        <button
          type="button"
          onClick={() => {
            setInnerValue("");
            onChange("");
          }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
