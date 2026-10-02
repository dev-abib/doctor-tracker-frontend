"use client";

import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartCard } from "@/components/shared/ChartCard";
import { ConditionStat } from "@/types/api";
import { cn } from "@/lib/utils";

interface Props {
  data?: ConditionStat[];
  isLoading?: boolean;
}

const DONUT_COLORS = [
  "#4f46e5", // Indigo Primary
  "#0ea5e9", // Sky Blue
  "#10b981", // Emerald
  "#8b5cf6", // Purple
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#14b8a6", // Teal
  "#6366f1", // Iris
  "#64748b", // Slate
];

export const ConditionDonutChart: React.FC<Props> = ({ data = [], isLoading }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isEmpty = !isLoading && data.length === 0;
  const totalCount = data.reduce((acc, item) => acc + (item.count || 0), 0);

  return (
    <ChartCard
      title="Patients by Diagnosis & Condition"
      description="Patient distribution across reported medical conditions"
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        {/* Donut Chart with Center Total Badge */}
        <div className="relative h-56 w-56 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    const pct =
                      item.percentage ||
                      (totalCount > 0
                        ? `${Math.round((item.count / totalCount) * 100)}%`
                        : "0%");
                    return (
                      <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-2.5 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-foreground">{item.condition}</p>
                        <p className="font-semibold text-primary">
                          {item.count} Patients ({pct})
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={data}
                dataKey="count"
                nameKey="condition"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={3}
                onMouseEnter={(_, idx) => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                    className="stroke-card transition-all cursor-pointer"
                    strokeWidth={2}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Hole Stat */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-foreground tracking-tight leading-none">
              {totalCount}
            </span>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-1">
              Patients
            </span>
          </div>
        </div>

        {/* Structured Custom Legend Grid with Visible Smooth Scrollbar */}
        <div className="flex-1 w-full h-54 overflow-y-auto space-y-1.5 pr-2 scrollbar-visible">
          {data.map((item, index) => {
            const color = DONUT_COLORS[index % DONUT_COLORS.length];
            const pct =
              totalCount > 0
                ? `${Math.round((item.count / totalCount) * 100)}%`
                : "0%";
            const isHovered = activeIndex === index;

            return (
              <div
                key={item.condition}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={cn(
                  "flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer border",
                  isHovered
                    ? "bg-muted/80 border-border/80 font-bold"
                    : "border-transparent hover:bg-muted/40 font-medium"
                )}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: color }}
                  />
                  <span className="truncate text-foreground" title={item.condition}>
                    {item.condition}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold text-foreground">{item.count}</span>
                  <span className="text-[10px] font-bold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded-md min-w-9 text-center">
                    {pct}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ChartCard>
  );
};
