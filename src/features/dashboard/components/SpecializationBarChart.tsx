"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChartCard } from "@/components/shared/ChartCard";
import { SpecializationStat } from "@/types/api";

interface Props {
  data?: SpecializationStat[];
  isLoading?: boolean;
}

export const SpecializationBarChart: React.FC<Props> = ({ data = [], isLoading }) => {
  const isEmpty = !isLoading && data.length === 0;

  return (
    <ChartCard
      title="Doctors by Specialization"
      description="Practitioner headcount across medical departments"
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis
              dataKey="specialization"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={45}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(80, 70, 229, 0.08)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-lg text-xs">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{item.specialization}</p>
                      <p className="mt-1 font-bold text-[#5046e5] dark:text-indigo-400">
                        {item.count} Doctor{item.count === 1 ? "" : "s"}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="count"
              fill="#5046e5"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
