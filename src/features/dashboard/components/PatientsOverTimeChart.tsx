"use client";

import React, { useState } from "react";
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
import { TimeSeriesPoint } from "@/types/api";

interface Props {
  data?: {
    day: TimeSeriesPoint[];
    week: TimeSeriesPoint[];
    month: TimeSeriesPoint[];
  };
  isLoading?: boolean;
}

export const PatientsOverTimeChart: React.FC<Props> = ({ data, isLoading }) => {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("month");

  const currentData = data ? data[timeframe] || [] : [];
  const isEmpty = !isLoading && currentData.length === 0;

  const timeframeAction = (
    <div className="flex items-center rounded-xl bg-[#eff2fc] dark:bg-slate-800 p-0.5">
      {(["day", "week", "month"] as const).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTimeframe(t)}
          className={`h-6 rounded-lg px-2.5 text-[11px] font-semibold capitalize transition-all cursor-pointer ${
            timeframe === t
              ? "bg-[#5046e5] text-white shadow-2xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );

  return (
    <ChartCard
      title="Patient Registrations Over Time"
      description="Historical admission and consultation volume by selected timeframe"
      action={timeframeAction}
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={currentData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(80, 70, 229, 0.08)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-lg text-xs">
                      <p className="font-semibold text-slate-400">{item.date}</p>
                      <p className="mt-1 text-sm font-bold text-[#5046e5] dark:text-indigo-400">
                        {item.count} Patients Registered
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
