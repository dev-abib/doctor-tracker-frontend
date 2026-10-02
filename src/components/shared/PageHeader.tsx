"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  icon,
  badge,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 sm:pb-5 border-b border-border/70",
        className
      )}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {icon && (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-xs">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
              {title}
            </h1>
            {badge && <div>{badge}</div>}
          </div>
          {description && (
            <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground truncate">
              {description}
            </p>
          )}
        </div>
      </div>

      {action && (
        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-start sm:justify-end shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};
