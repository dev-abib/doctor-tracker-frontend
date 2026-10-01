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
      title="Doctors by Medical Specialization"
      description="Practitioner headcount across medical departments"
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
            <XAxis
              dataKey="specialization"
              tick={{ fontSize: 10 }}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={50}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-border bg-card p-3 shadow-xl text-xs">
                      <p className="font-semibold text-foreground">{item.specialization}</p>
                      <p className="mt-1 font-bold text-primary">
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
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
