"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Plus, Filter, RotateCcw } from "lucide-react";
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
  const [showFilters, setShowFilters] = useState(
    !!(specializationParam || hospitalParam || startDateParam || endDateParam)
  );

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

  const handleResetFilters = () => {
    setSearch("");
    setSpecialization("");
    setHospital("");
    setStartDate("");
    setEndDate("");
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

  const activeFilterCount =
    (specialization ? 1 : 0) +
    (hospital ? 1 : 0) +
    (startDate ? 1 : 0) +
    (endDate ? 1 : 0) +
    (sort !== "newest" ? 1 : 0);

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

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by doctor name, email, hospital, or specialty..."
            className="w-full sm:max-w-md"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              variant={showFilters ? "secondary" : "outline"}
              size="sm"
              className="rounded-xl text-xs h-9 flex-1 sm:flex-none justify-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-3.5 w-3.5 mr-1.5" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-1.5 rounded-full bg-primary text-primary-foreground px-1.5 py-0.2 text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl text-xs h-9 text-muted-foreground hover:text-foreground"
                onClick={handleResetFilters}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Collapsible Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-border/50 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Medical Specialization
              </label>
              <Select
                value={specialization}
                onChange={(e) => {
                  setSpecialization(e.target.value);
                  setPage(1);
                  updateUrlParams({ specialization: e.target.value, page: 1 });
                }}
              >
                <option value="">All Specializations</option>
                {filtersData?.specializations.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Hospital Affiliation
              </label>
              <Select
                value={hospital}
                onChange={(e) => {
                  setHospital(e.target.value);
                  setPage(1);
                  updateUrlParams({ hospital: e.target.value, page: 1 });
                }}
              >
                <option value="">All Hospitals</option>
                {filtersData?.hospitals.map((hosp) => (
                  <option key={hosp} value={hosp}>
                    {hosp}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Sort Order
              </label>
              <Select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                  updateUrlParams({ sort: e.target.value, page: 1 });
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name_asc">Name (A – Z)</option>
                <option value="name_desc">Name (Z – A)</option>
              </Select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Joined Date Range
              </label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                    updateUrlParams({ startDate: e.target.value, page: 1 });
                  }}
                  className="h-10 text-xs px-2 min-w-0 flex-1"
                />
                <span className="text-muted-foreground shrink-0">–</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                    updateUrlParams({ endDate: e.target.value, page: 1 });
                  }}
                  className="h-10 text-xs px-2 min-w-0 flex-1"
                />
              </div>
            </div>
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
