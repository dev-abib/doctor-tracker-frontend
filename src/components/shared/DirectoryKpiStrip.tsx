"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface KpiMetric {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  trend?: string;
  color?: "primary" | "emerald" | "indigo" | "violet" | "amber";
}

interface DirectoryKpiStripProps {
  metrics: KpiMetric[];
  className?: string;
}

export const DirectoryKpiStrip: React.FC<DirectoryKpiStripProps> = ({
  metrics,
  className,
}) => {
  const colorStyles = {
    primary: "bg-primary/10 text-primary border-primary/20",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  };

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3", className)}>
      {metrics.map((m, idx) => {
        const style = colorStyles[m.color || "primary"];
        return (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl border border-border/70 bg-card/80 shadow-2xs hover:border-border transition-all group"
          >
            <div
              className={cn(
                "flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border shadow-xs transition-transform group-hover:scale-105",
                style
              )}
            >
              {m.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-muted-foreground truncate uppercase tracking-wider">
                {m.label}
              </p>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-base sm:text-lg font-black text-foreground tracking-tight">
                  {m.value}
                </span>
                {m.subtext && (
                  <span className="text-[10px] text-muted-foreground font-medium truncate hidden sm:inline">
                    {m.subtext}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
