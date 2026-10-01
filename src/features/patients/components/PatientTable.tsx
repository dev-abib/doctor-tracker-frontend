"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  Stethoscope,
  Pencil,
  Trash2,
  Calendar,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { formatDate } from "@/lib/utils";
import { Patient } from "@/types/api";

interface Props {
  patients: Patient[];
  isLoading: boolean;
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => Promise<any>;
}

export const PatientTable: React.FC<Props> = ({
  patients,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const [selectedPatientForDelete, setSelectedPatientForDelete] = useState<Patient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!selectedPatientForDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(selectedPatientForDelete._id);
      setSelectedPatientForDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-3 px-2 border-b border-border/40">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <EmptyState
        title="No patients found"
        description="No patient records match the applied search keywords and filters."
      />
    );
  }

  return (
    <>
      <div className="w-full">
        {/* Desktop / Tablet Table */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Demographics</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Attending Doctor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Visit Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => {
                const docObj = typeof patient.doctor === "object" ? patient.doctor : null;

                return (
                  <TableRow key={patient._id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                          {patient.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">
                            {patient.name}
                          </span>
                          {patient.email ? (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {patient.email}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">No email</span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs font-medium text-muted-foreground">
                      {patient.age} yrs • {patient.gender}
                    </TableCell>

                    <TableCell>
                      <Badge variant="purple" className="font-semibold">
                        {patient.condition}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {docObj ? (
                        <Link
                          href={`/doctors/${docObj._id}`}
                          className="group/doc inline-flex flex-col"
                        >
                          <span className="text-xs font-bold text-primary group-hover/doc:underline flex items-center gap-1">
                            <Stethoscope className="h-3 w-3 text-primary shrink-0" />
                            {docObj.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {docObj.specialization}
                          </span>
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Assigned ({String(patient.doctor).substring(0, 6)}...)
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3 shrink-0" />
                        <span>{patient.phone}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(patient.visitDate || patient.createdAt)}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          onClick={() => onEdit(patient)}
                          title="Edit Patient"
                        >
                          <Pencil className="h-4 w-4 text-muted-foreground hover:text-amber-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                          onClick={() => setSelectedPatientForDelete(patient)}
                          title="Delete Patient"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {patients.map((patient) => {
            const docObj = typeof patient.doctor === "object" ? patient.doctor : null;

            return (
              <div
                key={patient._id}
                className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                      {patient.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-foreground block">
                        {patient.name}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {patient.age} yrs • {patient.gender}
                      </p>
                    </div>
                  </div>
                  <Badge variant="purple" className="text-[11px]">
                    {patient.condition}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground space-y-1.5 pt-1 border-t border-border/40">
                  {docObj && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Doctor:</span>
                      <Link
                        href={`/doctors/${docObj._id}`}
                        className="font-semibold text-primary"
                      >
                        {docObj.name}
                      </Link>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span className="text-foreground">{patient.phone}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Visit:</span>
                    <span className="text-foreground">
                      {formatDate(patient.visitDate || patient.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-xs rounded-lg"
                    onClick={() => onEdit(patient)}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Edit Record
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 px-3 rounded-lg text-xs"
                    onClick={() => setSelectedPatientForDelete(patient)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!selectedPatientForDelete}
        onClose={() => setSelectedPatientForDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete patient ${selectedPatientForDelete?.name}?`}
        description="Are you sure you want to permanently remove this patient record from the database?"
        confirmText="Confirm Delete"
        isLoading={isDeleting}
      />
    </>
  );
};
