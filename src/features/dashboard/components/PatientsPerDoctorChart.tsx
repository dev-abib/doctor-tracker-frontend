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
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis
              dataKey="name"
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
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 shadow-lg text-xs">
                      <p className="font-bold text-slate-900 dark:text-white">{item.fullName}</p>
                      <p className="text-slate-400">{item.specialization}</p>
                      <p className="mt-1 font-bold text-[#5046e5] dark:text-indigo-400">
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
              stroke="#5046e5"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#5046e5", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#5046e5", stroke: "var(--card)", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
