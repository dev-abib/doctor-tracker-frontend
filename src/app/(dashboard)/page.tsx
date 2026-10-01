"use client";

import React, { useState } from "react";
import {
  Users,
  Stethoscope,
  Shield,
  Activity,
  Zap,
  LayoutDashboard,
} from "lucide-react";
import { StatCard } from "@/components/shared/StatCard";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { PatientsPerDoctorChart } from "@/features/dashboard/components/PatientsPerDoctorChart";
import { PatientsOverTimeChart } from "@/features/dashboard/components/PatientsOverTimeChart";
import { ConditionDonutChart } from "@/features/dashboard/components/ConditionDonutChart";
import { SpecializationBarChart } from "@/features/dashboard/components/SpecializationBarChart";
import { RecentPatientsTable } from "@/features/dashboard/components/RecentPatientsTable";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function DashboardPage() {
  const [timeframe] = useState<"day" | "week" | "month">("day");
  const { data, isLoading } = useDashboardStats(timeframe);
  const { user } = useAuth();

  const summary = data?.summary;
  const charts = data?.charts;
  const recentPatients = data?.recentPatients;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Live Executive Dashboard Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#e8eef6] dark:border-slate-800 p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff2fc] dark:bg-indigo-950/60 text-[#5046e5] dark:text-indigo-400 shadow-2xs">
            <LayoutDashboard className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none">
              LIVE EXECUTIVE DASHBOARD
            </span>
            <h1 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white leading-tight mt-1 truncate">
              Welcome back, {user?.name || "Dr. Administrator"}
            </h1>
          </div>
        </div>

        <div className="rounded-xl bg-[#eff2fc] dark:bg-indigo-950/60 px-3 py-1.5 border border-indigo-100 dark:border-indigo-800/60 shrink-0">
          <span className="text-xs font-semibold text-[#5046e5] dark:text-indigo-400">
            Role: Super Admin
          </span>
        </div>
      </div>

      {/* 5 Stat Cards in Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Doctors"
          value={summary?.totalDoctors ?? 36}
          icon={<Stethoscope className="h-4 w-4" />}
          trendText="+100% this month"
          trendType="positive"
          isLoading={isLoading}
        />

        <StatCard
          title="Active Patients"
          value={summary?.totalPatients ?? 360}
          icon={<Users className="h-4 w-4" />}
          trendText="+78% retention"
          trendType="positive"
          isLoading={isLoading}
        />

        <StatCard
          title="System Admins"
          value={2}
          icon={<Shield className="h-4 w-4" />}
          subtext="Super admin access"
          isLoading={isLoading}
        />

        <StatCard
          title="Avg Workload"
          value={`${summary?.avgPatientsPerDoctor ?? 10} / Doc`}
          icon={<Activity className="h-4 w-4" />}
          trendText="Active milestone record"
          trendType="positive"
          isLoading={isLoading}
        />

        <StatCard
          title="Clinical Capacity"
          value="6 / 6 Live"
          icon={<Zap className="h-4 w-4" />}
          subtext="100% operational"
          isLoading={isLoading}
        />
      </div>

      {/* Row 1 Charts: Consultations Volume (Bar) & Streak Velocity (Line) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <PatientsOverTimeChart
          data={charts?.patientsOverTime}
          isLoading={isLoading}
        />

        <PatientsPerDoctorChart
          data={charts?.patientsPerDoctor}
          isLoading={isLoading}
        />
      </div>

      {/* Row 2 Charts: Specialization (Bar) & Condition Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SpecializationBarChart
          data={charts?.doctorsBySpecialization}
          isLoading={isLoading}
        />

        <ConditionDonutChart
          data={charts?.patientsByCondition}
          isLoading={isLoading}
        />
      </div>

      {/* Recent Admissions / Consultations Table */}
      <RecentPatientsTable
        patients={recentPatients}
        isLoading={isLoading}
      />
    </div>
  );
}
