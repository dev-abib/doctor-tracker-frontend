import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  emptyTitle = "No chart data available",
  emptyDescription = "There is not enough data to generate this visualization yet.",
  className,
  children,
}) => {
  return (
    <Card className={cn("overflow-hidden border-border/80 flex flex-col justify-between min-w-0 w-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-xs">{description}</CardDescription>
          )}
        </div>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className="pt-2 flex-1 flex flex-col justify-center">
        {isLoading ? (
          <div className="flex h-72 w-full flex-col items-center justify-center gap-3">
            <Skeleton className="h-4/5 w-full rounded-xl" />
            <div className="flex w-full justify-between gap-4 px-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ) : isEmpty ? (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
};
