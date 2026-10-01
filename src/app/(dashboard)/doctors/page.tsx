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
import { DoctorTable } from "@/features/doctors/components/DoctorTable";
import { DoctorFormModal, DoctorFormData } from "@/features/doctors/components/DoctorFormModal";
import {
  useDoctorsList,
  useDoctorFilters,
  useCreateDoctor,
  useUpdateDoctor,
  useDeleteDoctor,
} from "@/features/doctors/hooks/useDoctors";
import { Doctor } from "@/types/api";

export default function DoctorsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read initial query state from URL params
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const searchParam = searchParams.get("search") || "";
  const specializationParam = searchParams.get("specialization") || "";
  const hospitalParam = searchParams.get("hospital") || "";
  const startDateParam = searchParams.get("startDate") || "";
  const endDateParam = searchParams.get("endDate") || "";
  const sortParam = searchParams.get("sort") || "newest";

  // Query parameters state
  const [page, setPage] = useState(pageParam);
  const [limit] = useState(10);
  const [search, setSearch] = useState(searchParam);
  const [specialization, setSpecialization] = useState(specializationParam);
  const [hospital, setHospital] = useState(hospitalParam);
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
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

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
    setSpecialization(specializationParam);
    setHospital(hospitalParam);
    setStartDate(startDateParam);
    setEndDate(endDateParam);
    setSort(sortParam);
    setDatePreset(getDatePreset());
  }, [
    pageParam,
    searchParam,
    specializationParam,
    hospitalParam,
    startDateParam,
    endDateParam,
    sortParam,
  ]);

  // Queries & Mutations
  const { data: filtersData } = useDoctorFilters();
  const { data, isLoading } = useDoctorsList({
    page,
    limit,
    search,
    specialization,
    hospital,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    sort,
  });

  const createDoctorMutation = useCreateDoctor();
  const updateDoctorMutation = useUpdateDoctor();
  const deleteDoctorMutation = useDeleteDoctor();

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
    setSpecialization("");
    setHospital("");
    setStartDate("");
    setEndDate("");
    setDatePreset("all");
    setSort("newest");
    setPage(1);
    router.replace(pathname, { scroll: false });
  };

  const handleCreateSubmit = async (formData: DoctorFormData) => {
    await createDoctorMutation.mutateAsync(formData);
  };

  const handleEditSubmit = async (formData: DoctorFormData) => {
    if (!editingDoctor) return;
    await updateDoctorMutation.mutateAsync({
      id: editingDoctor._id,
      data: formData,
    });
    setEditingDoctor(null);
  };

  const handleDelete = async (id: string) => {
    await deleteDoctorMutation.mutateAsync(id);
  };

  const hasActiveFilters = !!(
    search ||
    specialization ||
    hospital ||
    startDate ||
    endDate ||
    sort !== "newest"
  );

  const headerAction = (
    <Button
      variant="gradient"
      size="sm"
      className="rounded-xl h-9 font-semibold"
      onClick={() => setIsCreateModalOpen(true)}
    >
      <Plus className="h-4 w-4 mr-1.5" />
      Add New Doctor
    </Button>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Doctor Directory"
        description="Search, manage and monitor medical practitioners and their clinical assignments."
        action={headerAction}
      />

      {/* Modern Integrated Search & Filter Toolbar */}
      <div className="rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 space-y-3.5 shadow-sm">
        {/* Main Toolbar Controls Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Flexible Search Bar */}
          <div className="flex-1 min-w-0">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by doctor name, email, hospital, or specialty..."
              className="w-full"
            />
          </div>

          {/* Quick Filter Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
            {/* Specialization Filter */}
            <Select
              value={specialization}
              onChange={(e) => {
                setSpecialization(e.target.value);
                setPage(1);
                updateUrlParams({ specialization: e.target.value, page: 1 });
              }}
              className="h-10 text-xs w-full"
            >
              <option value="">All Specialties</option>
              {filtersData?.specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </Select>

            {/* Hospital Filter */}
            <Select
              value={hospital}
              onChange={(e) => {
                setHospital(e.target.value);
                setPage(1);
                updateUrlParams({ hospital: e.target.value, page: 1 });
              }}
              className="h-10 text-xs w-full"
            >
              <option value="">All Hospitals</option>
              {filtersData?.hospitals.map((hosp) => (
                <option key={hosp} value={hosp}>
                  {hosp}
                </option>
              ))}
            </Select>

            {/* Quick Date Range Preset */}
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
            </Select>
          </div>
        </div>

        {/* Custom Date Inputs (only revealed if 'custom' is selected) */}
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

            {specialization && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 px-2.5 py-1 text-xs font-medium">
                Specialty: {specialization}
                <button
                  type="button"
                  onClick={() => {
                    setSpecialization("");
                    setPage(1);
                    updateUrlParams({ specialization: undefined, page: 1 });
                  }}
                  className="hover:text-destructive cursor-pointer ml-0.5"
                  title="Remove specialization filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {hospital && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 px-2.5 py-1 text-xs font-medium">
                Hospital: {hospital}
                <button
                  type="button"
                  onClick={() => {
                    setHospital("");
                    setPage(1);
                    updateUrlParams({ hospital: undefined, page: 1 });
                  }}
                  className="hover:text-destructive cursor-pointer ml-0.5"
                  title="Remove hospital filter"
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
                Sort: {sort === "oldest" ? "Oldest" : sort === "name_asc" ? "Name (A–Z)" : "Name (Z–A)"}
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

      {/* Doctors Table */}
      <DoctorTable
        doctors={data?.doctors || []}
        isLoading={isLoading}
        onEdit={(doc) => setEditingDoctor(doc)}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      {data?.meta && (
        <Pagination
          meta={data.meta}
          onPageChange={(newPage) => setPage(newPage)}
          isLoading={isLoading}
        />
      )}

      {/* Create Doctor Modal */}
      <DoctorFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={createDoctorMutation.isPending}
      />

      {/* Edit Doctor Modal */}
      <DoctorFormModal
        isOpen={!!editingDoctor}
        onClose={() => setEditingDoctor(null)}
        onSubmit={handleEditSubmit}
        initialData={editingDoctor}
        isLoading={updateDoctorMutation.isPending}
      />
    </div>
  );
}
