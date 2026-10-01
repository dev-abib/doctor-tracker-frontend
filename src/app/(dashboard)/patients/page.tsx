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
  const [showFilters, setShowFilters] = useState(
    !!(conditionParam || doctorParam || genderParam || startDateParam || endDateParam)
  );

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

  const handleResetFilters = () => {
    setSearch("");
    setCondition("");
    setDoctor("");
    setGender("");
    setStartDate("");
    setEndDate("");
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

  const activeFilterCount =
    (condition ? 1 : 0) +
    (doctor ? 1 : 0) +
    (gender ? 1 : 0) +
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

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-border/80 bg-card p-3.5 sm:p-4 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by patient name, condition, or phone..."
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

        {/* Collapsible Filter Dropdowns */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-border/50 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Medical Condition
              </label>
              <Select
                value={condition}
                onChange={(e) => {
                  const val = e.target.value;
                  setCondition(val);
                  setPage(1);
                  updateUrlParams({ condition: val, page: 1 });
                }}
              >
                <option value="">All Conditions</option>
                {filtersData?.conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Attending Doctor
              </label>
              <Select
                value={doctor}
                onChange={(e) => {
                  const val = e.target.value;
                  setDoctor(val);
                  setPage(1);
                  updateUrlParams({ doctor: val, page: 1 });
                }}
              >
                <option value="">All Doctors</option>
                {filtersData?.doctors.map((doc) => (
                  <option key={doc._id} value={doc._id}>
                    {doc.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Gender
              </label>
              <Select
                value={gender}
                onChange={(e) => {
                  const val = e.target.value;
                  setGender(val);
                  setPage(1);
                  updateUrlParams({ gender: val, page: 1 });
                }}
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Sort Order
              </label>
              <Select
                value={sort}
                onChange={(e) => {
                  const val = e.target.value;
                  setSort(val);
                  setPage(1);
                  updateUrlParams({ sort: val, page: 1 });
                }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name_asc">Name (A – Z)</option>
                <option value="name_desc">Name (Z – A)</option>
                <option value="age_asc">Age (Low to High)</option>
                <option value="age_desc">Age (High to Low)</option>
              </Select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                Date Range
              </label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStartDate(val);
                    setPage(1);
                    updateUrlParams({ startDate: val, page: 1 });
                  }}
                  className="h-10 text-xs px-2 min-w-0 flex-1"
                />
                <span className="text-muted-foreground shrink-0">–</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEndDate(val);
                    setPage(1);
                    updateUrlParams({ endDate: val, page: 1 });
                  }}
                  className="h-10 text-xs px-2 min-w-0 flex-1"
                />
              </div>
            </div>
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
