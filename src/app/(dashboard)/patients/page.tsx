"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Plus,
  X,
  Calendar,
  RotateCcw,
  Download,
  Stethoscope,
  User,
  ArrowUpDown,
  Layers,
  LayoutGrid,
  List,
  Users,
  HeartPulse,
  Activity,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { SmartCategoryTabs, CategoryGroup } from "@/components/shared/SmartCategoryTabs";
import { DirectoryKpiStrip } from "@/components/shared/DirectoryKpiStrip";
import { Pagination } from "@/components/shared/Pagination";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PatientTable } from "@/features/patients/components/PatientTable";
import { PatientGrid } from "@/features/patients/components/PatientGrid";
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
import { cn } from "@/lib/utils";

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
  const [limit] = useState(12);
  const [search, setSearch] = useState(searchParam);
  const [condition, setCondition] = useState(conditionParam);
  const [doctor, setDoctor] = useState(doctorParam);
  const [gender, setGender] = useState(genderParam);
  const [startDate, setStartDate] = useState(startDateParam);
  const [endDate, setEndDate] = useState(endDateParam);
  const [sort, setSort] = useState(sortParam);

  // View mode state
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  useEffect(() => {
    const saved = localStorage.getItem("doctor_tracker_patients_view");
    if (saved === "grid" || saved === "table") {
      setViewMode(saved);
    }
  }, []);

  const handleViewModeChange = (mode: "table" | "grid") => {
    setViewMode(mode);
    localStorage.setItem("doctor_tracker_patients_view", mode);
  };

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

  // Sync state with URL params on navigation
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
    limit,
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

  const handleConditionClick = (cond: string) => {
    const newVal = condition === cond ? "" : cond;
    setCondition(newVal);
    setPage(1);
    updateUrlParams({ condition: newVal || undefined, page: 1 });
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

  const handleExportCsv = () => {
    const list = data?.patients || [];
    if (list.length === 0) return;

    const escapeCsv = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`;
    const headers = ["ID", "Name", "Age", "Gender", "Condition", "Doctor", "Phone", "Email", "Visit Date"];
    const rows = list.map((p) => {
      const docName = typeof p.doctor === "object" && p.doctor ? p.doctor.name : String(p.doctor || "N/A");
      return [
        escapeCsv(p._id),
        escapeCsv(p.name),
        p.age,
        escapeCsv(p.gender),
        escapeCsv(p.condition),
        escapeCsv(docName),
        escapeCsv(p.phone),
        escapeCsv(p.email || ""),
        escapeCsv(new Date(p.visitDate || p.createdAt).toLocaleDateString()),
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `patients_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  const activeFiltersCount = [
    Boolean(search),
    Boolean(condition),
    Boolean(doctor),
    Boolean(gender),
    Boolean(startDate || endDate),
    sort !== "newest",
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;
  const selectedDoctorObj = filtersData?.doctors.find((d) => d._id === doctor);

  const headerAction = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="rounded-xl h-9 font-semibold text-xs gap-1.5"
        onClick={handleExportCsv}
        disabled={isLoading || (data?.patients || []).length === 0}
        title="Export filtered patients list to CSV"
      >
        <Download className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="hidden sm:inline">Export CSV</span>
      </Button>
      <Button
        variant="default"
        size="sm"
        className="rounded-xl h-9 font-semibold text-xs gap-1.5 shadow-xs shadow-primary/20"
        onClick={() => setIsCreateModalOpen(true)}
      >
        <Plus className="h-4 w-4" />
        <span>Register Patient</span>
      </Button>
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <PageHeader
        icon={<Users className="h-5 w-5" />}
        title="Patient Management"
        description="Comprehensive patient registry with diagnosis history and doctor allocation."
        badge={
          data?.meta && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {data.meta.total} {data.meta.total === 1 ? "Patient" : "Patients"}
            </span>
          )
        }
        action={headerAction}
      />

      {/* Directory Clinical KPI Metrics Strip */}
      <DirectoryKpiStrip
        metrics={[
          {
            icon: <Users className="h-5 w-5" />,
            label: "Total Patients",
            value: data?.meta?.total ?? 0,
            subtext: "Admitted",
            color: "primary",
          },
          {
            icon: <HeartPulse className="h-5 w-5" />,
            label: "Active Diagnoses",
            value: filtersData?.conditions?.length ?? 0,
            subtext: "Conditions",
            color: "emerald",
          },
          {
            icon: <Stethoscope className="h-5 w-5" />,
            label: "Attending Doctors",
            value: filtersData?.doctors?.length ?? 0,
            subtext: "Specialists",
            color: "indigo",
          },
          {
            icon: <Activity className="h-5 w-5" />,
            label: "Filter Status",
            value: hasActiveFilters ? `${data?.patients?.length ?? 0} Found` : "All Records",
            subtext: hasActiveFilters ? "Filtered" : "Live Roster",
            color: hasActiveFilters ? "amber" : "violet",
          },
        ]}
      />

      {/* Smart Grouped Clinical Category Tabs */}
      <SmartCategoryTabs
        categories={[
          { label: "All Diagnoses", value: "", icon: <Layers className="h-3.5 w-3.5" /> },
          { label: "Hypertension", value: "Hypertension", icon: <HeartPulse className="h-3.5 w-3.5 text-rose-500" /> },
          { label: "Diabetes Type 2", value: "Type 2 Diabetes", icon: <Activity className="h-3.5 w-3.5 text-amber-500" /> },
          { label: "Asthma", value: "Asthma", icon: <Stethoscope className="h-3.5 w-3.5 text-sky-500" /> },
          { label: "Migraine", value: "Migraine", icon: <ShieldCheck className="h-3.5 w-3.5 text-violet-500" /> },
          { label: "Osteoarthritis", value: "Osteoarthritis", icon: <Building2 className="h-3.5 w-3.5 text-emerald-500" /> },
        ]}
        allConditions={filtersData?.conditions || []}
        selectedCondition={condition}
        onSelectCondition={handleConditionClick}
      />

      {/* Unified Command-Bar Filter Row (Single Sleek Bar) */}
      <div className="rounded-2xl border border-border/80 bg-card p-2.5 shadow-xs">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
          {/* Search Bar */}
          <div className="flex-1 min-w-[240px]">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by patient, phone, doctor..."
              className="w-full max-w-none"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              icon={<Activity className="h-3.5 w-3.5" />}
              value={condition}
              onChange={(val) => {
                setCondition(val);
                setPage(1);
                updateUrlParams({ condition: val, page: 1 });
              }}
              options={[
                { label: "All Conditions", value: "" },
                ...(filtersData?.conditions.map((c) => ({ label: c, value: c })) || []),
              ]}
              className="w-auto min-w-[135px]"
            />

            <FilterSelect
              icon={<Stethoscope className="h-3.5 w-3.5" />}
              value={doctor}
              onChange={(val) => {
                setDoctor(val);
                setPage(1);
                updateUrlParams({ doctor: val, page: 1 });
              }}
              options={[
                { label: "All Doctors", value: "" },
                ...(filtersData?.doctors.map((doc) => ({ label: doc.name, value: doc._id })) || []),
              ]}
              className="w-auto min-w-[130px]"
            />

            <FilterSelect
              icon={<User className="h-3.5 w-3.5" />}
              value={gender}
              onChange={(val) => {
                setGender(val);
                setPage(1);
                updateUrlParams({ gender: val, page: 1 });
              }}
              options={[
                { label: "All Genders", value: "" },
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Other", value: "Other" },
              ]}
              className="w-auto min-w-[110px]"
            />

            <FilterSelect
              icon={<Calendar className="h-3.5 w-3.5" />}
              value={datePreset}
              onChange={handleDatePresetChange}
              options={[
                { label: "All Dates", value: "all" },
                { label: "Registered Today", value: "today" },
                { label: "Last 7 Days", value: "last7" },
                { label: "Last 30 Days", value: "last30" },
                { label: "This Month", value: "thisMonth" },
                { label: "Custom Range...", value: "custom" },
              ]}
              className="w-auto min-w-[115px]"
            />

            <FilterSelect
              icon={<ArrowUpDown className="h-3.5 w-3.5" />}
              value={sort}
              onChange={(val) => {
                setSort(val);
                setPage(1);
                updateUrlParams({ sort: val, page: 1 });
              }}
              options={[
                { label: "Newest First", value: "newest" },
                { label: "Oldest First", value: "oldest" },
                { label: "Name (A – Z)", value: "name_asc" },
                { label: "Name (Z – A)", value: "name_desc" },
                { label: "Age (Youngest)", value: "age_asc" },
                { label: "Age (Oldest)", value: "age_desc" },
              ]}
              className="w-auto min-w-[120px]"
            />

            {/* Reset Filters button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 px-2.5 rounded-xl text-xs text-muted-foreground hover:text-foreground gap-1.5"
                title="Reset all filters"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            )}

            {/* View Switcher: Table / Grid */}
            <div className="flex items-center p-0.5 rounded-xl bg-muted/60 border border-border/50 ml-auto lg:ml-0">
              <button
                type="button"
                onClick={() => handleViewModeChange("table")}
                className={cn(
                  "p-1.5 rounded-lg text-xs transition-all cursor-pointer",
                  viewMode === "table"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Table View"
                aria-label="Table View"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleViewModeChange("grid")}
                className={cn(
                  "p-1.5 rounded-lg text-xs transition-all cursor-pointer",
                  viewMode === "grid"
                    ? "bg-card text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
                title="Card Grid View"
                aria-label="Card Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Custom Date Range Picker when selected */}
        {datePreset === "custom" && (
          <div className="flex flex-wrap items-center gap-2 pt-2.5 mt-2.5 border-t border-border/50 text-xs text-muted-foreground animate-in fade-in duration-150">
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

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2.5 mt-2.5 border-t border-border/50 text-xs">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Active Filters:
            </span>

            {search && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-xs font-medium">
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
              <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-xs font-medium">
                Condition: {condition}
                <button
                  type="button"
                  onClick={() => handleConditionClick("")}
                  className="hover:text-destructive cursor-pointer ml-0.5"
                  title="Remove condition filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {doctor && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-xs font-medium">
                Doctor: {selectedDoctorObj?.name || doctor}
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
              <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-xs font-medium">
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
              <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-xs font-medium">
                Date: {startDate || "start"} → {endDate || "today"}
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
              <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-xs font-medium">
                Sort: {sort}
                <button
                  type="button"
                  onClick={() => {
                    setSort("newest");
                    setPage(1);
                    updateUrlParams({ sort: "newest", page: 1 });
                  }}
                  className="hover:text-destructive cursor-pointer ml-0.5"
                  title="Reset sort"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Content: Table or Grid View */}
      {viewMode === "table" ? (
        <PatientTable
          patients={data?.patients || []}
          isLoading={isLoading}
          onEdit={(patient) => setEditingPatient(patient)}
          onDelete={handleDelete}
          sort={sort}
          onSortChange={(newSort) => {
            setSort(newSort);
            setPage(1);
            updateUrlParams({ sort: newSort, page: 1 });
          }}
        />
      ) : (
        <PatientGrid
          patients={data?.patients || []}
          isLoading={isLoading}
          onEdit={(patient) => setEditingPatient(patient)}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination */}
      {data?.meta && (
        <Pagination
          meta={data.meta}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}

      {/* Modals */}
      <PatientFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        doctorsList={filtersData?.doctors || []}
        isLoading={createPatientMutation.isPending}
      />

      <PatientFormModal
        isOpen={!!editingPatient}
        onClose={() => setEditingPatient(null)}
        onSubmit={handleEditSubmit}
        doctorsList={filtersData?.doctors || []}
        initialData={editingPatient}
        isLoading={updatePatientMutation.isPending}
      />
    </div>
  );
}
