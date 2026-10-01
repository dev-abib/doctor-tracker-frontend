import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label?: string;
  };
  subtitle?: string;
  isLoading?: boolean;
  colorClassName?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  isLoading = false,
  colorClassName = "from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400",
}) => {
  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/80">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
          <div className="mt-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = trend && trend.value > 0;
  const isNegative = trend && trend.value < 0;
  const isZero = trend && trend.value === 0;

  return (
    <Card className="relative overflow-hidden border-border/80 transition-all duration-300 hover:shadow-md hover:border-primary/40 group">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity" />
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm",
              colorClassName
            )}
          >
            {icon}
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-extrabold tracking-tight text-foreground">
            {value}
          </div>

          {trend && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold",
                  isPositive && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                  isNegative && "bg-red-500/10 text-red-600 dark:text-red-400",
                  isZero && "bg-muted text-muted-foreground"
                )}
              >
                {isPositive && <TrendingUp className="h-3 w-3" />}
                {isNegative && <TrendingDown className="h-3 w-3" />}
                {isZero && <Minus className="h-3 w-3" />}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground">
                {trend.label || "vs last month"}
              </span>
            </div>
          )}

          {subtitle && !trend && (
            <p className="mt-1.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
