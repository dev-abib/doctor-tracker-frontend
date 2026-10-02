"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChartCard } from "@/components/shared/ChartCard";
import { PatientsPerDoctorStat } from "@/types/api";

interface Props {
  data?: PatientsPerDoctorStat[];
  isLoading?: boolean;
}

export const PatientsPerDoctorChart: React.FC<Props> = ({ data = [], isLoading }) => {
  const chartData = data.slice(0, 8).map((item) => ({
    name: item.doctorName.replace("Dr. ", ""),
    fullName: item.doctorName,
    specialization: item.specialization,
    patients: item.patientCount,
  }));

  const isEmpty = !isLoading && chartData.length === 0;

  return (
    <ChartCard
      title="Top Doctors by Patient Volume"
      description="Active patient load assigned across practitioner roster"
      isLoading={isLoading}
      isEmpty={isEmpty}
    >
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.6} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-border/80 bg-card/95 backdrop-blur-md p-2.5 shadow-xl text-xs space-y-1">
                      <p className="font-bold text-foreground">{item.fullName}</p>
                      <p className="text-muted-foreground">{item.specialization}</p>
                      <p className="font-semibold text-primary">
                        {item.patients} Active Patients
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="patients"
              stroke="var(--primary)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "var(--primary)", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "var(--primary)", stroke: "var(--card)", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
