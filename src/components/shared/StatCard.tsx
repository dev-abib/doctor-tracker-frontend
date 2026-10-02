import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatNumber } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trendText?: string;
  trendType?: "positive" | "neutral" | "highlight";
  subtext?: string;
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trendText,
  trendType = "positive",
  subtext,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-8 w-8 rounded-xl" />
        </div>
        <div className="mt-3">
          <Skeleton className="h-7 w-16" />
          <Skeleton className="mt-2 h-3.5 w-28" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-primary/30 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between">
      {/* Subtle top gradient accent on hover */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground truncate pr-2">
          {title}
        </p>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 transition-all duration-200 shadow-2xs">
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
          {typeof value === "number" ? formatNumber(value) : value}
        </div>

        {trendText && (
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center text-[11px] font-bold",
                trendType === "positive" && "text-emerald-600 dark:text-emerald-400",
                trendType === "highlight" && "text-primary",
                trendType === "neutral" && "text-muted-foreground"
              )}
            >
              {trendText}
            </span>
          </div>
        )}

        {subtext && !trendText && (
          <p className="mt-1 text-[11px] text-muted-foreground font-normal">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};
