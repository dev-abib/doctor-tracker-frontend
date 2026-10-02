"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PillItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface ScrollablePillsProps {
  items: PillItem[];
  selectedValue: string;
  onSelect: (value: string) => void;
  allLabel?: string;
  className?: string;
}

export const ScrollablePills: React.FC<ScrollablePillsProps> = ({
  items,
  selectedValue,
  onSelect,
  allLabel = "All",
  className,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollContainerRef.current;
    if (!el) return;

    // Check after layout and font render
    const t1 = setTimeout(updateScrollState, 50);
    const t2 = setTimeout(updateScrollState, 300);

    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    // ResizeObserver for rock-solid dynamic responsiveness
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => updateScrollState());
      resizeObserver.observe(el);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [items]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollAmount = direction === "left" ? -280 : 280;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setTimeout(updateScrollState, 200);
  };

  return (
    <div className={cn("flex items-center gap-1.5 w-full select-none", className)}>
      {/* Left Scroll Arrow Button */}
      <button
        type="button"
        onClick={() => handleScroll("left")}
        disabled={!canScrollLeft}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all cursor-pointer shadow-xs",
          canScrollLeft
            ? "bg-card border-border/80 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
            : "bg-muted/40 border-border/40 text-muted-foreground/30 cursor-not-allowed opacity-40"
        )}
        title="Scroll left"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollContainerRef}
        className="flex-1 flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar scroll-smooth"
      >
        {/* 'All' pill */}
        <button
          type="button"
          onClick={() => onSelect("")}
          className={cn(
            "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0",
            !selectedValue
              ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-bold"
              : "bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/60"
          )}
        >
          <Layers className="h-3 w-3 shrink-0" />
          <span>{allLabel}</span>
        </button>

        {/* Category Pills */}
        {items.map((item) => {
          const isActive = selectedValue === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => onSelect(isActive ? "" : item.value)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-bold"
                  : "bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:border-border hover:bg-muted/60"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Scroll Arrow Button */}
      <button
        type="button"
        onClick={() => handleScroll("right")}
        disabled={!canScrollRight}
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border transition-all cursor-pointer shadow-xs",
          canScrollRight
            ? "bg-card border-border/80 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary"
            : "bg-muted/40 border-border/40 text-muted-foreground/30 cursor-not-allowed opacity-40"
        )}
        title="Scroll right"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};
