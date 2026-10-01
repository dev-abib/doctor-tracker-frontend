"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartCard } from "@/components/shared/ChartCard";
import { ConditionStat } from "@/types/api";

interface Props {
  data?: ConditionStat[];
  isLoading?: boolean;
}

const DONUT_COLORS = [
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
];

export const ConditionDonutChart: React.FC<Props> = ({ data = [], isLoading }) => {
  const isEmpty = !isLoading && data.length === 0;

  return (
    <ChartCard
      title="Patients by Diagnosis / Condition"
      description="Distribution across top reported conditions"
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-border bg-card p-3 shadow-xl text-xs">
                      <p className="font-semibold text-foreground">{item.condition}</p>
                      <p className="mt-1 font-bold text-primary">
                        {item.count} Patients
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={40}
              iconType="circle"
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="condition"
              cx="50%"
              cy="45%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
