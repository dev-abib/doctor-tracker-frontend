"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus, X, Calendar, RotateCcw } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { Pagination } from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PatientTable } from "@/features/patients/components/PatientTable";
import {
  PatientFormModal,
  PatientFormData,
} from "@/features/patients/components/PatientFormModal";
import {
  usePatientsList,
  usePatientFilters,
  useCreatePatient,
  useUpdatePatient,
  useDeletePatient,
} from "@/features/patients/hooks/usePatients";
import { Patient } from "@/types/api";

export default function PatientsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial query state from URL params
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const searchParam = searchParams.get("search") || "";
  const conditionParam = searchParams.get("condition") || "";
  const doctorParam = searchParams.get("doctor") || "";
  const genderParam = searchParams.get("gender") || "";
  const startDateParam = searchParams.get("startDate") || "";
  const endDateParam = searchParams.get("endDate") || "";
  const sortParam = searchParams.get("sort") || "newest";

  const [page, setPage] = useState(pageParam);
  const [search, setSearch] = useState(searchParam);
  const [condition, setCondition] = useState(conditionParam);
  const [doctor, setDoctor] = useState(doctorParam);
  const [gender, setGender] = useState(genderParam);
  const [startDate, setStartDate] = useState(startDateParam);
  const [endDate, setEndDate] = useState(endDateParam);
  const [sort, setSort] = useState(sortParam);

  // Derive date preset
  const getDatePreset = () => {
    if (!startDateParam && !endDateParam) return "all";
    const todayStr = new Date().toISOString().split("T")[0];
    if (startDateParam === todayStr && endDateParam === todayStr) return "today";
    const d7 = new Date();
    d7.setDate(d7.getDate() - 7);
    const d7Str = d7.toISOString().split("T")[0];
    if (startDateParam === d7Str && endDateParam === todayStr) return "last7";
    const d30 = new Date();
    d30.setDate(d30.getDate() - 30);
    const d30Str = d30.toISOString().split("T")[0];
    if (startDateParam === d30Str && endDateParam === todayStr) return "last30";
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    if (startDateParam === firstOfMonth && endDateParam === todayStr) return "thisMonth";
    return "custom";
  };

  const [datePreset, setDatePreset] = useState<string>(getDatePreset());

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Sync state into URL params
  const updateUrlParams = useCallback(
    (paramsObj: Record<string, string | number | undefined>) => {
      const current = new URLSearchParams(searchParams.toString());
      Object.entries(paramsObj).forEach(([key, value]) => {
        if (value === undefined || value === "" || (key === "page" && value === 1)) {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });
      router.replace(`${pathname}?${current.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  // Sync state with URL params on navigation (e.g. browser back/forward)
  useEffect(() => {
    setPage(pageParam);
    setSearch(searchParam);
    setCondition(conditionParam);
    setDoctor(doctorParam);
    setGender(genderParam);
    setStartDate(startDateParam);
    setEndDate(endDateParam);
    setSort(sortParam);
    setDatePreset(getDatePreset());
  }, [
    pageParam,
    searchParam,
    conditionParam,
    doctorParam,
    genderParam,
    startDateParam,
    endDateParam,
    sortParam,
  ]);

  // Queries & Mutations
  const { data: filtersData } = usePatientFilters();
  const { data, isLoading } = usePatientsList({
    page,
    limit: 10,
    search,
    condition,
    doctor,
    gender,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    sort,
  });

  const createPatientMutation = useCreatePatient();
  const updatePatientMutation = useUpdatePatient();
  const deletePatientMutation = useDeletePatient();

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
    updateUrlParams({ search: val, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    updateUrlParams({ page: newPage });
  };

  const handleDatePresetChange = (preset: string) => {
    setDatePreset(preset);
    const todayStr = new Date().toISOString().split("T")[0];
    if (preset === "all") {
      setStartDate("");
      setEndDate("");
      setPage(1);
      updateUrlParams({ startDate: undefined, endDate: undefined, page: 1 });
    } else if (preset === "today") {
      setStartDate(todayStr);
      setEndDate(todayStr);
      setPage(1);
      updateUrlParams({ startDate: todayStr, endDate: todayStr, page: 1 });
    } else if (preset === "last7") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      const dStr = d.toISOString().split("T")[0];
      setStartDate(dStr);
      setEndDate(todayStr);
      setPage(1);
      updateUrlParams({ startDate: dStr, endDate: todayStr, page: 1 });
    } else if (preset === "last30") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      const dStr = d.toISOString().split("T")[0];
      setStartDate(dStr);
      setEndDate(todayStr);
      setPage(1);
      updateUrlParams({ startDate: dStr, endDate: todayStr, page: 1 });
    } else if (preset === "thisMonth") {
      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
      setStartDate(firstOfMonth);
      setEndDate(todayStr);
      setPage(1);
      updateUrlParams({ startDate: firstOfMonth, endDate: todayStr, page: 1 });
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setCondition("");
    setDoctor("");
    setGender("");
    setStartDate("");
    setEndDate("");
    setDatePreset("all");
    setSort("newest");
    setPage(1);
    router.replace(pathname, { scroll: false });
  };

  const handleCreateSubmit = async (formData: PatientFormData) => {
    await createPatientMutation.mutateAsync({
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
      condition: formData.condition,
      doctor: formData.doctor,
      visitDate: formData.visitDate,
    });
  };

  const handleEditSubmit = async (formData: PatientFormData) => {
    if (!editingPatient) return;
    await updatePatientMutation.mutateAsync({
      id: editingPatient._id,
      data: {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        condition: formData.condition,
        doctor: formData.doctor,
        visitDate: formData.visitDate,
      },
    });
    setEditingPatient(null);
  };

  const handleDelete = async (id: string) => {
    await deletePatientMutation.mutateAsync(id);
  };

  const hasActiveFilters = !!(
    search ||
    condition ||
    doctor ||
    gender ||
    startDate ||
    endDate ||
    sort !== "newest"
  );

  const selectedDoctorObj = filtersData?.doctors.find((d) => d._id === doctor);

  const headerAction = (
    <Button
      variant="gradient"
      size="sm"
      className="rounded-xl h-9 font-semibold"
      onClick={() => setIsCreateModalOpen(true)}
    >
      <Plus className="h-4 w-4 mr-1.5" />
      Register Patient
    </Button>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Patient Management"
        description="Comprehensive patient registry with diagnosis history and doctor allocation."
        action={headerAction}
      />

      {/* Modern Integrated Search & Filter Toolbar */}
      <div className="rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 space-y-3 shadow-xs">
        {/* Row 1: Dedicated Search Bar (Full Width) */}
        <div className="w-full">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by patient name, condition, or phone..."
            className="w-full"
          />
        </div>

        {/* Row 2: Clean Filter Selectors (Responsive Grid: 2 cols on mobile, 3 on tablet, 5 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-2 border-t border-border/40">
          {/* Condition Filter */}
          <Select
            value={condition}
            onChange={(e) => {
              const val = e.target.value;
              setCondition(val);
              setPage(1);
              updateUrlParams({ condition: val, page: 1 });
            }}
            className="h-10 text-xs w-full"
          >
            <option value="">All Conditions</option>
            {filtersData?.conditions.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </Select>

          {/* Doctor Filter */}
          <Select
            value={doctor}
            onChange={(e) => {
              const val = e.target.value;
              setDoctor(val);
              setPage(1);
              updateUrlParams({ doctor: val, page: 1 });
            }}
            className="h-10 text-xs w-full"
          >
            <option value="">All Doctors</option>
            {filtersData?.doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name}
              </option>
            ))}
          </Select>

          {/* Gender Filter */}
          <Select
            value={gender}
            onChange={(e) => {
              const val = e.target.value;
              setGender(val);
              setPage(1);
              updateUrlParams({ gender: val, page: 1 });
            }}
            className="h-10 text-xs w-full"
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>

          {/* Date Preset */}
          <Select
            value={datePreset}
            onChange={(e) => handleDatePresetChange(e.target.value)}
            className="h-10 text-xs w-full"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="last7">Last 7 Days</option>
            <option value="last30">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="custom">Custom Range...</option>
          </Select>

          {/* Sort Order */}
          <Select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
              updateUrlParams({ sort: e.target.value, page: 1 });
            }}
            className="h-10 text-xs w-full"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name_asc">Name (A – Z)</option>
            <option value="name_desc">Name (Z – A)</option>
            <option value="age_asc">Age (Low – High)</option>
            <option value="age_desc">Age (High – Low)</option>
          </Select>
        </div>

        {/* Custom Date Range Selector (only revealed if 'custom' is selected) */}
        {datePreset === "custom" && (
          <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-border/50 text-xs text-muted-foreground animate-in fade-in duration-150">
            <span className="font-semibold text-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Custom Date Range:
            </span>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                  updateUrlParams({ startDate: e.target.value, page: 1 });
                }}
                className="h-8 text-xs w-36 px-2"
              />
              <span>to</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                  updateUrlParams({ endDate: e.target.value, page: 1 });
                }}
                className="h-8 text-xs w-36 px-2"
              />
            </div>
          </div>
        )}

        {/* Active Filter Chips with 1-Click Dismiss */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2.5 border-t border-border/50 text-xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Active:
            </span>

            {search && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-xs font-medium">
                Keyword: &quot;{search}&quot;
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="hover:text-destructive cursor-pointer ml-0.5"
                  title="Remove search filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {condition && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 px-2.5 py-1 text-xs font-medium">
                Condition: {condition}
                <button
                  type="button"
                  onClick={() => {
                    setCondition("");
                    setPage(1);
                    updateUrlParams({ condition: undefined, page: 1 });
                  }}
                  className="hover:text-destructive cursor-pointer ml-0.5"
                  title="Remove condition filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {doctor && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 px-2.5 py-1 text-xs font-medium">
                Doctor: {selectedDoctorObj?.name || "Assigned"}
                <button
                  type="button"
                  onClick={() => {
                    setDoctor("");
                    setPage(1);
                    updateUrlParams({ doctor: undefined, page: 1 });
                  }}
                  className="hover:text-destructive cursor-pointer ml-0.5"
                  title="Remove doctor filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {gender && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 px-2.5 py-1 text-xs font-medium">
                Gender: {gender}
                <button
                  type="button"
                  onClick={() => {
                    setGender("");
                    setPage(1);
                    updateUrlParams({ gender: undefined, page: 1 });
                  }}
                  className="hover:text-destructive cursor-pointer ml-0.5"
                  title="Remove gender filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {(startDate || endDate) && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/40 px-2.5 py-1 text-xs font-medium">
                Date: {datePreset !== "custom" ? datePreset : `${startDate || "Any"} – ${endDate || "Any"}`}
                <button
                  type="button"
                  onClick={() => handleDatePresetChange("all")}
                  className="hover:text-destructive cursor-pointer ml-0.5"
                  title="Remove date filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {sort !== "newest" && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs font-medium">
                Sort: {sort}
                <button
                  type="button"
                  onClick={() => {
                    setSort("newest");
                    setPage(1);
                    updateUrlParams({ sort: undefined, page: 1 });
                  }}
                  className="hover:text-destructive cursor-pointer ml-0.5"
                  title="Reset sort"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive gap-1 ml-auto"
            >
              <RotateCcw className="h-3 w-3" />
              Reset All
            </Button>
          </div>
        )}
      </div>

      {/* Patient Table */}
      <PatientTable
        patients={data?.patients || []}
        isLoading={isLoading}
        onEdit={(pat) => setEditingPatient(pat)}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {data?.meta && (
        <Pagination
          meta={data.meta}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}

      {/* Create Patient Modal */}
      <PatientFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        doctorsList={filtersData?.doctors || []}
        isLoading={createPatientMutation.isPending}
      />

      {/* Edit Patient Modal */}
      <PatientFormModal
        isOpen={!!editingPatient}
        onClose={() => setEditingPatient(null)}
        onSubmit={handleEditSubmit}
        initialData={editingPatient}
        doctorsList={filtersData?.doctors || []}
        isLoading={updatePatientMutation.isPending}
      />
    </div>
  );
}
