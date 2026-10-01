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
  "#f97316", // bright orange
  "#06b6d4", // cyan
  "#5046e5", // vibrant indigo
  "#8b5cf6", // violet
  "#10b981", // emerald
  "#ec4899", // pink
  "#3b82f6", // blue
];

export const ConditionDonutChart: React.FC<Props> = ({ data = [], isLoading }) => {
  const isEmpty = !isLoading && data.length === 0;

  return (
    <ChartCard
      title="Patients by Diagnosis & Condition"
      description="Patient distribution across reported medical conditions"
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-lg text-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{item.condition}</p>
                      <p className="mt-1 font-bold text-[#5046e5]">
                        {item.count} Patients ({item.percentage || ""})
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }}
            />
            <Pie
              data={data}
              dataKey="count"
              nameKey="condition"
              cx="50%"
              cy="44%"
              innerRadius={52}
              outerRadius={78}
              paddingAngle={4}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
