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
      <div className="rounded-2xl border border-[#e8eef6] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs">
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
    <div className="rounded-2xl border border-[#e8eef6] dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate pr-2">
          {title}
        </p>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#eff2fc] dark:bg-indigo-950/60 text-[#5046e5] dark:text-indigo-400">
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {typeof value === "number" ? formatNumber(value) : value}
        </div>

        {trendText && (
          <p
            className={cn(
              "mt-1 text-xs font-semibold leading-tight",
              trendType === "positive" && "text-emerald-600 dark:text-emerald-400",
              trendType === "highlight" && "text-[#5046e5] dark:text-indigo-400",
              trendType === "neutral" && "text-slate-500 dark:text-slate-400"
            )}
          >
            {trendText}
          </p>
        )}

        {subtext && !trendText && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-normal">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};
