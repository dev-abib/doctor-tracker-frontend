"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Stethoscope,
  Building2,
  Phone,
  Mail,
  Users,
  Pencil,
  Trash2,
  Eye,
  Copy,
  Check,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { formatDate } from "@/lib/utils";
import { Doctor } from "@/types/api";

interface DoctorGridProps {
  doctors: Doctor[];
  isLoading: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: string) => Promise<any>;
}

export const DoctorGrid: React.FC<DoctorGridProps> = ({
  doctors,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const [selectedDoctorForDelete, setSelectedDoctorForDelete] = useState<Doctor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string, uniqueKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(uniqueKey);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/70 bg-card p-4 space-y-3.5 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="pt-2 border-t border-border/40 flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {doctors.map((doctor) => (
          <div
            key={doctor._id}
            className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-border"
          >
            <div className="space-y-3">
              {/* Header: Avatar, Name & Specialty */}
              <div className="flex items-start gap-3">
                {doctor.image ? (
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-12 w-12 shrink-0 rounded-xl object-cover border border-border/60 shadow-xs"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base shadow-xs">
                    {(doctor.name || "D").replace("Dr. ", "").charAt(0)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/doctors/${doctor._id}`}
                    className="font-bold text-sm text-foreground hover:text-primary transition-colors block truncate group-hover:text-primary"
                    title={doctor.name}
                  >
                    {doctor.name}
                  </Link>
                  <div className="mt-0.5">
                    <Badge
                      variant="secondary"
                      className="inline-flex items-center gap-1 text-[11px] font-medium py-0 px-2 h-5"
                    >
                      <Stethoscope className="h-2.5 w-2.5 shrink-0" />
                      <span className="truncate max-w-[120px]">{doctor.specialization}</span>
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Hospital & Contact info */}
              <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                  <span className="truncate font-medium text-foreground/80">{doctor.hospital}</span>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(doctor.email, "Email", `mail-${doctor._id}`)}
                    className="flex items-center gap-1 hover:text-primary transition-colors truncate max-w-[150px] cursor-pointer group/item"
                    title="Click to copy email"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{doctor.email}</span>
                    {copiedId === `mail-${doctor._id}` ? (
                      <Check className="h-2.5 w-2.5 text-emerald-500 shrink-0" />
                    ) : (
                      <Copy className="h-2.5 w-2.5 opacity-0 group-hover/item:opacity-100 shrink-0 transition-opacity" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(doctor.phone, "Phone", `phone-${doctor._id}`)}
                    className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer group/item text-right font-mono"
                    title="Click to copy phone"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{doctor.phone}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card Footer: Patient stats & Action buttons */}
            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-muted/70 px-2.5 py-0.5 text-[11px] font-semibold text-foreground">
                <Users className="h-3 w-3 text-muted-foreground shrink-0" />
                <span>{doctor.patientCount ?? 0} Patients</span>
              </span>

              <div className="flex items-center gap-1">
                <Link href={`/doctors/${doctor._id}`}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-primary"
                    title="View Profile"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg text-muted-foreground hover:text-amber-500"
                  onClick={() => onEdit(doctor)}
                  title="Edit Doctor"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setSelectedDoctorForDelete(doctor)}
                  title="Delete Doctor"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
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
