"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Building2,
  Phone,
  Mail,
  Users,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
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
import { Doctor } from "@/types/api";

interface DoctorTableProps {
  doctors: Doctor[];
  isLoading: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: string) => Promise<any>;
}

export const DoctorTable: React.FC<DoctorTableProps> = ({
  doctors,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const [selectedDoctorForDelete, setSelectedDoctorForDelete] = useState<Doctor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!selectedDoctorForDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(selectedDoctorForDelete._id);
      setSelectedDoctorForDelete(null);
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
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <EmptyState
        title="No doctors found"
        description="No medical practitioners match the selected search and filter criteria."
      />
    );
  }

  return (
    <>
      <div className="w-full">
        {/* Desktop / Tablet Table */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
          <Table className="min-w-[850px]">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[220px]">Doctor</TableHead>
                <TableHead className="whitespace-nowrap">Specialization</TableHead>
                <TableHead className="min-w-[160px]">Hospital</TableHead>
                <TableHead className="whitespace-nowrap">Contact</TableHead>
                <TableHead className="text-center whitespace-nowrap">Patients</TableHead>
                <TableHead className="whitespace-nowrap">Joined</TableHead>
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor._id} className="group">
                  <TableCell className="min-w-[220px]">
                    <div className="flex items-center gap-3">
                      {doctor.image ? (
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="h-10 w-10 shrink-0 rounded-xl object-cover border border-border/60"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                          {doctor.name.replace("Dr. ", "").charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <Link
                          href={`/doctors/${doctor._id}`}
                          className="font-bold text-foreground hover:text-primary transition-colors block truncate"
                        >
                          {doctor.name}
                        </Link>
                        <span className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{doctor.email}</span>
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <Badge variant="default" className="font-medium whitespace-nowrap">
                      <Stethoscope className="h-3 w-3 mr-1 shrink-0" />
                      {doctor.specialization}
                    </Badge>
                  </TableCell>

                  <TableCell className="min-w-[160px]">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate max-w-[180px]">{doctor.hospital}</span>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
                      <Phone className="h-3 w-3 shrink-0" />
                      <span className="font-mono whitespace-nowrap">{doctor.phone}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-0.5 text-xs font-semibold text-foreground whitespace-nowrap">
                      <Users className="h-3 w-3 text-muted-foreground shrink-0" />
                      {doctor.patientCount ?? 0}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(doctor.createdAt)}
                  </TableCell>

                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                      <Link href={`/doctors/${doctor._id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg"
                          title="View Profile"
                        >
                          <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => onEdit(doctor)}
                        title="Edit Doctor"
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground hover:text-amber-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10"
                        onClick={() => setSelectedDoctorForDelete(doctor)}
                        title="Delete Doctor"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Cards View */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="h-10 w-10 shrink-0 rounded-xl object-cover border border-border/60"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-sm">
                      {doctor.name.replace("Dr. ", "").charAt(0)}
                    </div>
                  )}
                  <div>
                    <Link
                      href={`/doctors/${doctor._id}`}
                      className="font-bold text-sm text-foreground hover:text-primary"
                    >
                      {doctor.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{doctor.email}</p>
                  </div>
                </div>
                <Badge variant="default" className="text-[11px]">
                  {doctor.specialization}
                </Badge>
              </div>

              <div className="text-xs text-muted-foreground space-y-1 pt-1 border-t border-border/40">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{doctor.hospital}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{doctor.phone}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-foreground">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <span>{doctor.patientCount ?? 0} Patients</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                <Link href={`/doctors/${doctor._id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs rounded-lg">
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    View Details
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 rounded-lg text-xs"
                  onClick={() => onEdit(doctor)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 px-2.5 rounded-lg text-xs"
                  onClick={() => setSelectedDoctorForDelete(doctor)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!selectedDoctorForDelete}
        onClose={() => setSelectedDoctorForDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${selectedDoctorForDelete?.name}?`}
        description="Are you sure? This will remove this doctor from the system and cascade-delete all assigned patient records to maintain data integrity."
        confirmText="Confirm Delete"
        isLoading={isDeleting}
      />
    </>
  );
};
