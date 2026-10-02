"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  UserPlus,
  Trash2,
  Phone,
  Mail,
  Users,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchInput } from "@/components/shared/SearchInput";
import { Pagination } from "@/components/shared/Pagination";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { DoctorProfileCard } from "@/features/doctors/components/DoctorProfileCard";
import {
  AddPatientModal,
  AddPatientFormData,
} from "@/features/doctors/components/AddPatientModal";
import {
  useDoctorDetail,
  useDoctorPatients,
  useAddPatientToDoctor,
  useDeletePatientFromDoctor,
} from "@/features/doctors/hooks/useDoctors";
import { formatDate, getConditionBadgeVariant } from "@/lib/utils";
import { Patient } from "@/types/api";

export default function DoctorDetailPage() {
  const params = useParams();
  const doctorId = params?.id as string;

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [selectedPatientForDelete, setSelectedPatientForDelete] = useState<Patient | null>(null);

  // Queries & Mutations
  const { data: doctor, isLoading: isDoctorLoading } = useDoctorDetail(doctorId);
  const { data: patientsData, isLoading: isPatientsLoading } = useDoctorPatients(
    doctorId,
    { page, limit, search }
  );

  const addPatientMutation = useAddPatientToDoctor();
  const deletePatientMutation = useDeletePatientFromDoctor();

  const handleAddPatientSubmit = async (formData: AddPatientFormData) => {
    await addPatientMutation.mutateAsync({
      doctorId,
      data: formData,
    });
  };

  const handleDeletePatientConfirm = async () => {
    if (!selectedPatientForDelete) return;
    await deletePatientMutation.mutateAsync({
      doctorId,
      patientId: selectedPatientForDelete._id,
    });
    setSelectedPatientForDelete(null);
  };

  const router = useRouter();

  if (isDoctorLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="py-12">
        <EmptyState
          title="Doctor not found"
          description="The requested practitioner does not exist or has been removed."
          actionLabel="Back to Doctors"
          onAction={() => router.push("/doctors")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Navigation header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/doctors"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Doctors</span>
        </Link>

        <Button
          variant="default"
          size="sm"
          className="rounded-xl h-9 font-semibold text-xs gap-1.5 shadow-sm w-full sm:w-auto"
          onClick={() => setIsAddPatientModalOpen(true)}
        >
          <UserPlus className="h-4 w-4" />
          <span>Assign Patient</span>
        </Button>
      </div>

      {/* Doctor Profile Header Card */}
      <DoctorProfileCard doctor={doctor} />

      {/* Patients Roster Section */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Assigned Patient Roster</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Patients currently under the care of {doctor.name}
            </p>
          </div>

          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
            placeholder="Search patient or condition..."
            className="w-full sm:max-w-xs"
          />
        </div>

        {/* Patients Table */}
        {isPatientsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/30">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        ) : (patientsData?.patients || []).length === 0 ? (
          <EmptyState
            title="No patients under this doctor"
            description="Assign patients to this doctor to start managing their clinical appointments."
            actionLabel="Add Patient"
            onAction={() => setIsAddPatientModalOpen(true)}
          />
        ) : (
          <div className="w-full">
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
              <Table className="min-w-[750px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Patient Name</TableHead>
                    <TableHead className="whitespace-nowrap">Demographics</TableHead>
                    <TableHead className="whitespace-nowrap">Condition</TableHead>
                    <TableHead className="whitespace-nowrap">Contact Phone</TableHead>
                    <TableHead className="whitespace-nowrap">Visit / Consultation Date</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patientsData?.patients.map((patient) => (
                    <TableRow key={patient._id}>
                      <TableCell className="font-bold text-foreground min-w-[200px]">
                        <div className="flex items-center gap-2.5">
                          {patient.image ? (
                            <img
                              src={patient.image}
                              alt={patient.name}
                              className="h-8 w-8 rounded-lg object-cover border border-border/60 shrink-0"
                            />
                          ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                              {(patient.name || "P").charAt(0)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="block truncate">{patient.name}</span>
                            {patient.email && (
                              <p className="text-[11px] font-normal text-muted-foreground truncate">
                                {patient.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {patient.age} yrs • {patient.gender}
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        <Badge variant={getConditionBadgeVariant(patient.condition)} className="whitespace-nowrap">{patient.condition}</Badge>
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <Phone className="h-3 w-3 shrink-0" />
                          <span className="font-mono whitespace-nowrap">{patient.phone}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(patient.visitDate || patient.createdAt)}
                      </TableCell>

                      <TableCell className="text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                          onClick={() => setSelectedPatientForDelete(patient)}
                          title="Remove from roster"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {patientsData?.patients.map((patient) => (
                <div
                  key={patient._id}
                  className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      {patient.image ? (
                        <img
                          src={patient.image}
                          alt={patient.name}
                          className="h-9 w-9 rounded-lg object-cover border border-border/60 shrink-0"
                        />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                          {(patient.name || "P").charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-sm text-foreground">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {patient.age} yrs • {patient.gender}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getConditionBadgeVariant(patient.condition)} className="text-[11px]">
                      {patient.condition}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                    <span>{patient.phone}</span>
                    <span>{formatDate(patient.visitDate || patient.createdAt)}</span>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-7 text-xs rounded-lg px-2.5"
                      onClick={() => setSelectedPatientForDelete(patient)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {patientsData?.meta && (
          <Pagination
            meta={patientsData.meta}
            onPageChange={(p) => setPage(p)}
            isLoading={isPatientsLoading}
          />
        )}
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        onSubmit={handleAddPatientSubmit}
        doctorName={doctor.name}
        isLoading={addPatientMutation.isPending}
      />

      {/* Delete Patient Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!selectedPatientForDelete}
        onClose={() => setSelectedPatientForDelete(null)}
        onConfirm={handleDeletePatientConfirm}
        title={`Remove ${selectedPatientForDelete?.name}?`}
        description="Are you sure you want to remove this patient from the doctor's roster? This will permanently delete the patient record."
        confirmText="Remove Patient"
        isLoading={deletePatientMutation.isPending}
      />
    </div>
  );
}
