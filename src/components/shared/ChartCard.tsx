import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./EmptyState";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  action,
  isLoading = false,
  isEmpty = false,
  emptyTitle = "No data available",
  emptyDescription = "There is not enough data to render this visualization yet.",
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#e8eef6] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-2xs flex flex-col justify-between min-w-0 w-full",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-[#f1f5f9] dark:border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className="pt-2 flex-1 flex flex-col justify-center">
        {isLoading ? (
          <div className="flex h-64 w-full flex-col items-center justify-center gap-3">
            <Skeleton className="h-4/5 w-full rounded-xl" />
            <div className="flex w-full justify-between gap-4 px-2">
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3.5 w-16" />
              <Skeleton className="h-3.5 w-16" />
            </div>
          </div>
        ) : isEmpty ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          children
        )}
      </div>
    </div>
  );
};
