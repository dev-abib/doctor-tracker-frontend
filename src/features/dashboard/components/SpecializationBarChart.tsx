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
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
            <XAxis
              dataKey="specialization"
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              interval={0}
              angle={-25}
              textAnchor="end"
              height={45}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-2.5 shadow-xl text-xs space-y-1">
                      <p className="font-bold text-foreground">{item.specialization}</p>
                      <p className="font-semibold text-primary">
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
              fill="var(--primary)"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
