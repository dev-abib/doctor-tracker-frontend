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
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { formatDate, getConditionBadgeVariant } from "@/lib/utils";
import { Patient } from "@/types/api";

interface PatientGridProps {
  patients: Patient[];
  isLoading: boolean;
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => Promise<any>;
}

export const PatientGrid: React.FC<PatientGridProps> = ({
  patients,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const [selectedPatientForDelete, setSelectedPatientForDelete] =
    useState<Patient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string, uniqueKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(uniqueKey);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {patients.map(patient => {
          const doctorObj =
            typeof patient.doctor === "object" && patient.doctor !== null
              ? patient.doctor
              : null;
          const doctorName = doctorObj
            ? doctorObj.name
            : typeof patient.doctor === "string"
              ? patient.doctor
              : null;

          return (
            <div
              key={patient._id}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-border"
            >
              <div className="space-y-3">
                {/* Header: Avatar, Name & Condition */}
                <div className="flex items-start gap-3">
                  {patient.image ? (
                    <img
                      src={patient.image}
                      alt={patient.name}
                      className="h-12 w-12 shrink-0 rounded-xl object-cover border border-border/60 shadow-xs"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-base shadow-xs">
                      {patient.name.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h4
                      className="font-bold text-sm text-foreground transition-colors block truncate"
                      title={patient.name}
                    >
                      {patient.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs text-muted-foreground font-medium">
                        {patient.age} yrs • {patient.gender}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Condition Badge & Doctor */}
                <div className="space-y-2 pt-1">
                  <div>
                    <Badge
                      variant={getConditionBadgeVariant(patient.condition)}
                      className="text-[11px] font-medium py-0 px-2 h-5 max-w-full inline-flex items-center"
                      title={patient.condition}
                    >
                      <span className="truncate max-w-44">{patient.condition}</span>
                    </Badge>
                  </div>

                  {doctorName && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Stethoscope className="h-3.5 w-3.5 shrink-0 text-primary" />
                      {doctorObj ? (
                        <Link
                          href={`/doctors/${doctorObj._id}`}
                          className="truncate font-semibold text-foreground hover:text-primary transition-colors"
                          title={doctorName}
                        >
                          {doctorName}
                        </Link>
                      ) : (
                        <span className="truncate font-medium text-foreground">
                          {doctorName}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Contact info */}
                  <div className="space-y-1 text-xs text-muted-foreground pt-1 border-t border-border/40">
                    <div className="flex items-center justify-between">
                      {patient.email ? (
                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              patient.email || "",
                              "Email",
                              `mail-${patient._id}`,
                            )
                          }
                          className="flex items-center gap-1 hover:text-primary transition-colors truncate max-w-35 cursor-pointer group/item"
                          title="Click to copy email"
                        >
                          <Mail className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{patient.email}</span>
                          {copiedId === `mail-${patient._id}` ? (
                            <Check className="h-2.5 w-2.5 text-emerald-500 shrink-0" />
                          ) : (
                            <Copy className="h-2.5 w-2.5 opacity-0 group-hover/item:opacity-100 shrink-0 transition-opacity" />
                          )}
                        </button>
                      ) : (
                        <span className="text-muted-foreground/60 italic text-[11px]">
                          No email
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            patient.phone,
                            "Phone",
                            `phone-${patient._id}`,
                          )
                        }
                        className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer group/item text-right font-mono"
                        title="Click to copy phone"
                      >
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span>{patient.phone}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Joined Date & Action buttons */}
              <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                <span className="text-[11px] text-muted-foreground">
                  Reg: {formatDate(patient.createdAt)}
                </span>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-amber-500"
                    onClick={() => onEdit(patient)}
                    title="Edit Patient"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setSelectedPatientForDelete(patient)}
                    title="Delete Patient"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={!!selectedPatientForDelete}
        onClose={() => setSelectedPatientForDelete(null)}
        onConfirm={handleDeleteConfirm}
        title={`Delete ${selectedPatientForDelete?.name}?`}
        description="Are you sure you want to delete this patient record? This action cannot be undone."
        confirmText="Confirm Delete"
        isLoading={isDeleting}
      />
    </>
  );
};
