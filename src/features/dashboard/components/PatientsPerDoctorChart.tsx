"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartCard } from "@/components/shared/ChartCard";
import { PatientsPerDoctorStat } from "@/types/api";

interface Props {
  data?: PatientsPerDoctorStat[];
  isLoading?: boolean;
}

const COLORS = [
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#0284c7",
  "#0ea5e9",
  "#06b6d4",
  "#14b8a6",
  "#10b981",
  "#6366f1",
  "#8b5cf6",
];

export const PatientsPerDoctorChart: React.FC<Props> = ({ data = [], isLoading }) => {
  const chartData = data.map((item) => ({
    name: item.doctorName.replace("Dr. ", ""),
    fullName: item.doctorName,
    specialization: item.specialization,
    patients: item.patientCount,
  }));

  const isEmpty = !isLoading && chartData.length === 0;

  return (
    <ChartCard
      title="Top Doctors by Patient Volume"
      description="Doctors with highest patient assignments (Top 10)"
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
          >
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-border bg-card p-3 shadow-xl text-xs">
                      <p className="font-bold text-foreground">{item.fullName}</p>
                      <p className="text-muted-foreground">{item.specialization}</p>
                      <p className="mt-1.5 font-semibold text-primary">
                        {item.patients} Patient{item.patients === 1 ? "" : "s"}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="patients" radius={[0, 8, 8, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
