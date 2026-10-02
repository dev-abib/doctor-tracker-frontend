"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Stethoscope,
  Shield,
  Activity,
  Zap,
  LayoutDashboard,
  Plus,
  Download,
  CalendarDays,
  Clock,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import { PatientsPerDoctorChart } from "@/features/dashboard/components/PatientsPerDoctorChart";
import { PatientsOverTimeChart } from "@/features/dashboard/components/PatientsOverTimeChart";
import { ConditionDonutChart } from "@/features/dashboard/components/ConditionDonutChart";
import { SpecializationBarChart } from "@/features/dashboard/components/SpecializationBarChart";
import { RecentPatientsTable } from "@/features/dashboard/components/RecentPatientsTable";
import { DoctorFormModal, DoctorFormData } from "@/features/doctors/components/DoctorFormModal";
import { PatientFormModal, PatientFormData } from "@/features/patients/components/PatientFormModal";
import { useCreateDoctor, useDoctorFilters } from "@/features/doctors/hooks/useDoctors";
import { useCreatePatient, usePatientFilters } from "@/features/patients/hooks/usePatients";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats("day");
  const { user } = useAuth();

  // Modals state
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  // Time & Greeting
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      if (hours < 12) setGreeting("Good morning");
      else if (hours < 17) setGreeting("Good afternoon");
      else setGreeting("Good evening");

      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
      setCurrentDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mutations
  const createDoctorMutation = useCreateDoctor();
  const createPatientMutation = useCreatePatient();
  const { data: patientFiltersData } = usePatientFilters();

  const handleCreateDoctor = async (formData: DoctorFormData) => {
    await createDoctorMutation.mutateAsync(formData);
  };

  const handleCreatePatient = async (formData: PatientFormData) => {
    await createPatientMutation.mutateAsync({
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
      image: formData.image,
      condition: formData.condition,
      doctor: formData.doctor,
      visitDate: formData.visitDate,
    });
  };

  const summary = data?.summary;
  const charts = data?.charts;
  const recentPatients = data?.recentPatients;

  // Export summary report as CSV
  const handleExportSummary = () => {
    if (!summary) return;
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Metric,Value",
        `Total Doctors,${summary.totalDoctors}`,
        `Total Patients,${summary.totalPatients}`,
        `Average Patients per Doctor,${summary.avgPatientsPerDoctor}`,
        `New Patients This Month,${summary.newPatientsThisMonth}`,
        `Month-over-Month Growth,${summary.momGrowthPercentage}%`,
        `Exported At,"${new Date().toLocaleString()}"`,
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `clinical_summary_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Executive summary exported as CSV!");
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Live Executive Dashboard Welcome Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-card via-card to-primary/5 border border-border/80 p-4 sm:p-6 shadow-xs relative overflow-hidden w-full">
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 w-full lg:w-auto">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                CLINICAL EXECUTIVE HUB
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            </div>
            <h1
              className="text-base sm:text-xl lg:text-2xl font-black text-foreground leading-tight mt-0.5 truncate"
              title={`${greeting}, ${user?.name || "Dr. Administrator"}`}
            >
              {greeting}, {user?.name || "Dr. Administrator"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block truncate">
              Hospital analytics, patient admissions and practitioner roster overview.
            </p>
          </div>
        </div>

        {/* Banner Right: Live Clock & Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto justify-start lg:justify-end shrink-0">
          {/* Live Date / Time Badge */}
          {currentTime && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-semibold text-muted-foreground shadow-2xs">
              <CalendarDays className="h-3.5 w-3.5 text-primary" />
              <span>{currentDate}</span>
              <span className="text-border mx-0.5">•</span>
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-foreground">{currentTime}</span>
            </div>
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportSummary}
              className="h-9 px-2.5 sm:px-3 rounded-xl text-xs font-semibold gap-1.5 shrink-0"
              title="Download CSV report"
            >
              <Download className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPatientModalOpen(true)}
              className="h-9 flex-1 sm:flex-initial rounded-xl text-xs font-semibold gap-1.5 justify-center"
            >
              <UserPlus className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">Register Patient</span>
            </Button>

            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => setIsDoctorModalOpen(true)}
              className="h-9 flex-1 sm:flex-initial rounded-xl text-xs font-semibold gap-1.5 shadow-sm justify-center"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="truncate">Add Doctor</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 5 Stat Cards in Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Doctors"
          value={summary?.totalDoctors ?? 0}
          icon={<Stethoscope className="h-4 w-4" />}
          trendText={
            summary?.totalDoctors
              ? `${summary.totalDoctors} active practitioner${summary.totalDoctors === 1 ? "" : "s"}`
              : "0 registered"
          }
          trendType="highlight"
          isLoading={isLoading}
        />

        <StatCard
          title="Active Patients"
          value={summary?.totalPatients ?? 0}
          icon={<Users className="h-4 w-4" />}
          trendText={
            summary
              ? `${summary.momGrowthPercentage >= 0 ? `+${summary.momGrowthPercentage}%` : `${summary.momGrowthPercentage}%`} MoM growth`
              : "0% MoM"
          }
          trendType={summary && summary.momGrowthPercentage >= 0 ? "positive" : "neutral"}
          isLoading={isLoading}
        />

        <StatCard
          title="System Admins"
          value={1}
          icon={<Shield className="h-4 w-4" />}
          subtext="Super admin access"
          isLoading={isLoading}
        />

        <StatCard
          title="Avg Workload"
          value={`${summary?.avgPatientsPerDoctor ?? 0} / Doc`}
          icon={<Activity className="h-4 w-4" />}
          trendText={
            summary?.newPatientsThisMonth
              ? `+${summary.newPatientsThisMonth} new this month`
              : "Standard load"
          }
          trendType="positive"
          isLoading={isLoading}
        />

        <StatCard
          title="Clinical Capacity"
          value={summary?.totalDoctors ? `${summary.totalDoctors} Active Units` : "Ready"}
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

      {/* Quick Doctor Modal */}
      <DoctorFormModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        onSubmit={handleCreateDoctor}
        isLoading={createDoctorMutation.isPending}
      />

      {/* Quick Patient Modal */}
      <PatientFormModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSubmit={handleCreatePatient}
        doctorsList={patientFiltersData?.doctors || []}
        isLoading={createPatientMutation.isPending}
      />
    </div>
  );
}
