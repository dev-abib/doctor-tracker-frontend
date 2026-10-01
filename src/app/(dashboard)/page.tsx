"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Users,
  UserPlus,
  Activity,
  Plus,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { PatientsPerDoctorChart } from "@/features/dashboard/components/PatientsPerDoctorChart";
import { PatientsOverTimeChart } from "@/features/dashboard/components/PatientsOverTimeChart";
import { ConditionDonutChart } from "@/features/dashboard/components/ConditionDonutChart";
import { SpecializationBarChart } from "@/features/dashboard/components/SpecializationBarChart";
import { RecentPatientsTable } from "@/features/dashboard/components/RecentPatientsTable";
import { DoctorFormModal, DoctorFormData } from "@/features/doctors/components/DoctorFormModal";
import { useCreateDoctor } from "@/features/doctors/hooks/useDoctors";

export default function DashboardPage() {
  const [timeframe] = useState<"day" | "week" | "month">("day");
  const { data, isLoading } = useDashboardStats(timeframe);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const createDoctorMutation = useCreateDoctor();

  const handleCreateDoctor = async (formData: DoctorFormData) => {
    await createDoctorMutation.mutateAsync(formData);
  };

  const summary = data?.summary;
  const charts = data?.charts;
  const recentPatients = data?.recentPatients;

  const headerActions = (
    <div className="flex items-center gap-2.5">
      <Link href="/patients">
        <Button variant="outline" size="sm" className="rounded-xl h-9">
          <Users className="h-4 w-4 mr-1.5" />
          View Patients
        </Button>
      </Link>
      <Button
        variant="gradient"
        size="sm"
        className="rounded-xl h-9"
        onClick={() => setIsDoctorModalOpen(true)}
      >
        <Plus className="h-4 w-4 mr-1.5" />
        New Doctor
      </Button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <PageHeader
        title="Clinical Operations & Analytics"
        description="Comprehensive healthcare performance metrics, practitioner rosters, and admission trends."
        action={headerActions}
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Doctors"
          value={summary?.totalDoctors ?? 0}
          icon={<Stethoscope className="h-6 w-6" />}
          subtitle="Registered specialists across hospitals"
          isLoading={isLoading}
          colorClassName="from-blue-600/15 to-indigo-600/15 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Total Patients"
          value={summary?.totalPatients ?? 0}
          icon={<Users className="h-6 w-6" />}
          subtitle="Cumulative consultations & admissions"
          isLoading={isLoading}
          colorClassName="from-indigo-600/15 to-purple-600/15 text-indigo-600 dark:text-indigo-400"
        />

        <StatCard
          title="Avg Patients / Doctor"
          value={summary?.avgPatientsPerDoctor ?? 0}
          icon={<Activity className="h-6 w-6" />}
          subtitle="Average active clinical workload"
          isLoading={isLoading}
          colorClassName="from-emerald-600/15 to-teal-600/15 text-emerald-600 dark:text-emerald-400"
        />

        <StatCard
          title="New Patients (This Month)"
          value={summary?.newPatientsThisMonth ?? 0}
          icon={<UserPlus className="h-6 w-6" />}
          trend={{
            value: summary?.momGrowthPercentage ?? 0,
            label: "vs last month",
          }}
          isLoading={isLoading}
          colorClassName="from-sky-600/15 to-cyan-600/15 text-sky-600 dark:text-sky-400"
        />
      </div>

      {/* Row 1 Charts: Patients Over Time & Patients Per Doctor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PatientsOverTimeChart
          data={charts?.patientsOverTime}
          isLoading={isLoading}
        />

        <PatientsPerDoctorChart
          data={charts?.patientsPerDoctor}
          isLoading={isLoading}
        />
      </div>

      {/* Row 2 Charts: Conditions Donut & Specialization Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConditionDonutChart
          data={charts?.patientsByCondition}
          isLoading={isLoading}
        />

        <SpecializationBarChart
          data={charts?.doctorsBySpecialization}
          isLoading={isLoading}
        />
      </div>

      {/* Recent Patients Table */}
      <RecentPatientsTable
        patients={recentPatients}
        isLoading={isLoading}
      />

      {/* Create Doctor Modal */}
      <DoctorFormModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        onSubmit={handleCreateDoctor}
        isLoading={createDoctorMutation.isPending}
      />
    </div>
  );
}
