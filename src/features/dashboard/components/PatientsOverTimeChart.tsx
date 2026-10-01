"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChartCard } from "@/components/shared/ChartCard";
import { Button } from "@/components/ui/button";
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
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month">("day");

  const currentData = data ? data[timeframe] || [] : [];
  const isEmpty = !isLoading && currentData.length === 0;

  const timeframeAction = (
    <div className="flex items-center rounded-xl border border-border/80 bg-muted/30 p-0.5">
      {(["day", "week", "month"] as const).map((t) => (
        <Button
          key={t}
          variant={timeframe === t ? "default" : "ghost"}
          size="sm"
          onClick={() => setTimeframe(t)}
          className="h-7 rounded-lg px-2.5 text-xs capitalize"
        >
          {t}
        </Button>
      ))}
    </div>
  );

  return (
    <ChartCard
      title="Patient Registrations Over Time"
      description={`Admission and visit volume by ${timeframe}`}
      action={timeframeAction}
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={currentData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="patientColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-border bg-card p-3 shadow-xl text-xs">
                      <p className="font-semibold text-muted-foreground">{item.date}</p>
                      <p className="mt-1 text-sm font-bold text-primary">
                        {item.count} Patients Registered
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#patientColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
