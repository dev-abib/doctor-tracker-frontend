"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Plus,
  RotateCcw,
  X,
  Calendar,
  Download,
  Stethoscope,
  Users,
  Building2,
  Activity,
  Award,
  ArrowUpDown,
  Layers,
  LayoutGrid,
  List,
  HeartPulse,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchInput } from "@/components/shared/SearchInput";
import { SmartCategoryTabs } from "@/components/shared/SmartCategoryTabs";
import { DirectoryKpiStrip } from "@/components/shared/DirectoryKpiStrip";
import { Pagination } from "@/components/shared/Pagination";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DoctorTable } from "@/features/doctors/components/DoctorTable";
import { DoctorGrid } from "@/features/doctors/components/DoctorGrid";
import { DoctorFormModal, DoctorFormData } from "@/features/doctors/components/DoctorFormModal";
import {
  useDoctorsList,
  useDoctorFilters,
  useCreateDoctor,
  useUpdateDoctor,
  useDeleteDoctor,
} from "@/features/doctors/hooks/useDoctors";
import { Doctor } from "@/types/api";
import { cn } from "@/lib/utils";

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
  const [limit] = useState(12);
  const [search, setSearch] = useState(searchParam);
  const [specialization, setSpecialization] = useState(specializationParam);
  const [hospital, setHospital] = useState(hospitalParam);
  const [startDate, setStartDate] = useState(startDateParam);
  const [endDate, setEndDate] = useState(endDateParam);
  const [datePreset, setDatePreset] = useState("all");
  const [sort, setSort] = useState(sortParam);

  // View mode: table or grid (persisted in localStorage)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  useEffect(() => {
    const saved = localStorage.getItem("doctor_tracker_doctors_view");
    if (saved === "grid" || saved === "table") {
      setViewMode(saved);
    }
  }, []);

  const handleViewModeChange = (mode: "table" | "grid") => {
    setViewMode(mode);
    localStorage.setItem("doctor_tracker_doctors_view", mode);
  };

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

  // Sync state with URL params on navigation
  useEffect(() => {
    setPage(pageParam);
    setSearch(searchParam);
    setSpecialization(specializationParam);
    setHospital(hospitalParam);
    setStartDate(startDateParam);
    setEndDate(endDateParam);
    setSort(sortParam);
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

  const handleSpecialtyClick = (spec: string) => {
    const newVal = specialization === spec ? "" : spec;
    setSpecialization(newVal);
    setPage(1);
    updateUrlParams({ specialization: newVal || undefined, page: 1 });
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
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        .toISOString()
        .split("T")[0];
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
    await createDoctorMutation.mutateAsync({
      name: formData.name,
      specialization: formData.specialization,
      hospital: formData.hospital,
      phone: formData.phone,
      email: formData.email,
      image: formData.image || undefined,
    });
  };

  const handleEditSubmit = async (formData: DoctorFormData) => {
    if (!editingDoctor) return;
    await updateDoctorMutation.mutateAsync({
      id: editingDoctor._id,
      data: {
        name: formData.name,
        specialization: formData.specialization,
        hospital: formData.hospital,
        phone: formData.phone,
        email: formData.email,
        image: formData.image || undefined,
      },
    });
    setEditingDoctor(null);
  };

  const handleDelete = async (id: string) => {
    await deleteDoctorMutation.mutateAsync(id);
  };

  const handleExportCsv = () => {
    const list = data?.doctors || [];
    if (list.length === 0) return;

    const escapeCsv = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`;
    const headers = ["ID", "Name", "Specialization", "Hospital", "Phone", "Email", "Patients Count", "Joined Date"];
    const rows = list.map((d) => [
      escapeCsv(d._id),
      escapeCsv(d.name),
      escapeCsv(d.specialization),
      escapeCsv(d.hospital),
      escapeCsv(d.phone),
      escapeCsv(d.email),
      d.patientCount ?? 0,
      escapeCsv(new Date(d.createdAt).toLocaleDateString()),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `doctors_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeFiltersCount = [
    Boolean(search),
    Boolean(specialization),
    Boolean(hospital),
    Boolean(startDate || endDate),
    sort !== "newest",
  ].filter(Boolean).length;

  const hasActiveFilters = activeFiltersCount > 0;

  const headerAction = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="rounded-xl h-9 font-semibold text-xs gap-1.5"
        onClick={handleExportCsv}
        disabled={isLoading || (data?.doctors || []).length === 0}
        title="Export filtered doctors list to CSV"
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
        <span>Add Doctor</span>
      </Button>
    </div>
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <PageHeader
        icon={<Stethoscope className="h-5 w-5" />}
        title="Doctor Directory"
        description="Search, manage and monitor medical practitioners and their clinical assignments."
        badge={
          data?.meta && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {data.meta.total} {data.meta.total === 1 ? "Doctor" : "Doctors"}
            </span>
          )
        }
        action={headerAction}
      />

      {/* Directory Clinical KPI Metrics Strip */}
      <DirectoryKpiStrip
        metrics={[
          {
            icon: <Stethoscope className="h-5 w-5" />,
            label: "Total Doctors",
            value: data?.meta?.total ?? 0,
            subtext: "Licensed",
            color: "primary",
          },
          {
            icon: <Award className="h-5 w-5" />,
            label: "Specialties",
            value: filtersData?.specializations?.length ?? 0,
            subtext: "Fields",
            color: "indigo",
          },
          {
            icon: <Building2 className="h-5 w-5" />,
            label: "Hospitals",
            value: filtersData?.hospitals?.length ?? 0,
            subtext: "Affiliated",
            color: "emerald",
          },
          {
            icon: <Activity className="h-5 w-5" />,
            label: "Filter Status",
            value: hasActiveFilters ? `${data?.doctors?.length ?? 0} Found` : "All Doctors",
            subtext: hasActiveFilters ? "Filtered" : "Live Roster",
            color: hasActiveFilters ? "amber" : "violet",
          },
        ]}
      />

      {/* Smart Grouped Specialty Category Tabs */}
      <SmartCategoryTabs
        categories={[
          { label: "All Specialties", value: "", icon: <Layers className="h-3.5 w-3.5" /> },
          { label: "Cardiology", value: "Cardiology", icon: <HeartPulse className="h-3.5 w-3.5 text-rose-500" /> },
          { label: "Neurology", value: "Neurology", icon: <Activity className="h-3.5 w-3.5 text-indigo-500" /> },
          { label: "Pediatrics", value: "Pediatrics", icon: <Users className="h-3.5 w-3.5 text-emerald-500" /> },
          { label: "Orthopedics", value: "Orthopedics", icon: <Award className="h-3.5 w-3.5 text-amber-500" /> },
          { label: "Dermatology", value: "Dermatology", icon: <Building2 className="h-3.5 w-3.5 text-sky-500" /> },
        ]}
        allConditions={filtersData?.specializations || []}
        selectedCondition={specialization}
        onSelectCondition={handleSpecialtyClick}
      />

      {/* Unified Command-Bar Filter Row (Single Sleek Bar) */}
      <div className="rounded-2xl border border-border/80 bg-card p-2.5 shadow-xs">
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-2">
          {/* Search Bar */}
          <div className="flex-1 min-w-[240px]">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by doctor, email, hospital..."
              className="w-full max-w-none"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              icon={<Stethoscope className="h-3.5 w-3.5" />}
              value={specialization}
              onChange={(val) => {
                setSpecialization(val);
                setPage(1);
                updateUrlParams({ specialization: val, page: 1 });
              }}
              options={[
                { label: "All Specialties", value: "" },
                ...(filtersData?.specializations.map((spec) => ({ label: spec, value: spec })) || []),
              ]}
              className="w-auto min-w-[135px]"
            />

            <FilterSelect
              icon={<Building2 className="h-3.5 w-3.5" />}
              value={hospital}
              onChange={(val) => {
                setHospital(val);
                setPage(1);
                updateUrlParams({ hospital: val, page: 1 });
              }}
              options={[
                { label: "All Hospitals", value: "" },
                ...(filtersData?.hospitals.map((hosp) => ({ label: hosp, value: hosp })) || []),
              ]}
              className="w-auto min-w-[130px]"
            />

            <FilterSelect
              icon={<Calendar className="h-3.5 w-3.5" />}
              value={datePreset}
              onChange={handleDatePresetChange}
              options={[
                { label: "All Dates", value: "all" },
                { label: "Joined Today", value: "today" },
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

            {specialization && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-xs font-medium">
                Specialty: {specialization}
                <button
                  type="button"
                  onClick={() => handleSpecialtyClick("")}
                  className="hover:text-destructive cursor-pointer ml-0.5"
                  title="Remove specialty filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {hospital && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 text-xs font-medium">
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
                Sort: {sort === "oldest" ? "Oldest" : sort === "name_asc" ? "Name (A-Z)" : "Name (Z-A)"}
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
        <DoctorTable
          doctors={data?.doctors || []}
          isLoading={isLoading}
          onEdit={(doc) => setEditingDoctor(doc)}
          onDelete={handleDelete}
          sort={sort}
          onSortChange={(newSort) => {
            setSort(newSort);
            setPage(1);
            updateUrlParams({ sort: newSort, page: 1 });
          }}
        />
      ) : (
        <DoctorGrid
          doctors={data?.doctors || []}
          isLoading={isLoading}
          onEdit={(doc) => setEditingDoctor(doc)}
          onDelete={handleDelete}
        />
      )}

      {/* Pagination Controls */}
      {data?.meta && (
        <Pagination
          meta={data.meta}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}

      {/* Doctor Modals */}
      <DoctorFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        isLoading={createDoctorMutation.isPending}
      />

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
