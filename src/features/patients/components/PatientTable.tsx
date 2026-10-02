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
  Copy,
  Check,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { toast } from "sonner";
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
import { formatDate, getConditionBadgeVariant, cn } from "@/lib/utils";
import { Patient } from "@/types/api";

interface Props {
  patients: Patient[];
  isLoading: boolean;
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => Promise<any>;
  sort?: string;
  onSortChange?: (newSort: string) => void;
}

export const PatientTable: React.FC<Props> = ({
  patients,
  isLoading,
  onEdit,
  onDelete,
  sort,
  onSortChange,
}) => {
  const [selectedPatientForDelete, setSelectedPatientForDelete] =
    useState<Patient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const copyToClipboard = (text: string, label: string, uniqueKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(uniqueKey);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleNameSort = () => {
    if (!onSortChange) return;
    if (sort === "name_asc") onSortChange("name_desc");
    else onSortChange("name_asc");
  };

  const handleToggleAgeSort = () => {
    if (!onSortChange) return;
    if (sort === "age_asc") onSortChange("age_desc");
    else onSortChange("age_asc");
  };

  const handleToggleDateSort = () => {
    if (!onSortChange) return;
    if (sort === "newest") onSortChange("oldest");
    else onSortChange("newest");
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 py-3 px-2 border-b border-border/40"
          >
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
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs">
          <Table className="min-w-212.5">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-50">
                  <button
                    type="button"
                    onClick={handleToggleNameSort}
                    className="inline-flex items-center gap-1.5 font-bold hover:text-foreground transition-colors cursor-pointer text-xs"
                    title="Sort by patient name"
                  >
                    <span>Patient</span>
                    {sort === "name_asc" ? (
                      <ArrowUp className="h-3.5 w-3.5 text-primary" />
                    ) : sort === "name_desc" ? (
                      <ArrowDown className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <ArrowUpDown className="h-3.5 w-3.5 opacity-40 hover:opacity-100" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="whitespace-nowrap">
                  <button
                    type="button"
                    onClick={handleToggleAgeSort}
                    className="inline-flex items-center gap-1.5 font-bold hover:text-foreground transition-colors cursor-pointer text-xs"
                    title="Sort by patient age"
                  >
                    <span>Demographics</span>
                    {sort === "age_asc" ? (
                      <ArrowUp className="h-3.5 w-3.5 text-primary" />
                    ) : sort === "age_desc" ? (
                      <ArrowDown className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <ArrowUpDown className="h-3.5 w-3.5 opacity-40 hover:opacity-100" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="whitespace-nowrap">Condition</TableHead>
                <TableHead className="min-w-42.5">Attending Doctor</TableHead>
                <TableHead className="whitespace-nowrap">Contact</TableHead>
                <TableHead className="whitespace-nowrap">
                  <button
                    type="button"
                    onClick={handleToggleDateSort}
                    className="inline-flex items-center gap-1.5 font-bold hover:text-foreground transition-colors cursor-pointer text-xs"
                    title="Sort by visit date"
                  >
                    <span>Visit Date</span>
                    {sort === "newest" ? (
                      <ArrowDown className="h-3.5 w-3.5 text-primary" />
                    ) : sort === "oldest" ? (
                      <ArrowUp className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <ArrowUpDown className="h-3.5 w-3.5 opacity-40 hover:opacity-100" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="text-right whitespace-nowrap">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map(patient => {
                const docObj =
                  typeof patient.doctor === "object" ? patient.doctor : null;

                return (
                  <TableRow
                    key={patient._id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="min-w-50">
                      <div className="flex items-center gap-3">
                        {patient.image ? (
                          <img
                            src={patient.image}
                            alt={patient.name}
                            className="h-10 w-10 shrink-0 rounded-xl object-cover border border-border/60"
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                            {(patient.name || "P").charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-bold text-foreground block truncate">
                            {patient.name}
                          </span>
                          {patient.email ? (
                            <button
                              type="button"
                              onClick={() =>
                                copyToClipboard(
                                  patient.email || "",
                                  "Email",
                                  `email-${patient._id}`,
                                )
                              }
                              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 truncate text-left cursor-pointer transition-colors group/mail"
                              title="Click to copy email"
                            >
                              <Mail className="h-3 w-3 shrink-0" />
                              <span className="truncate">{patient.email}</span>
                              {copiedId === `email-${patient._id}` ? (
                                <Check className="h-2.5 w-2.5 text-emerald-500 shrink-0 ml-0.5" />
                              ) : (
                                <Copy className="h-2.5 w-2.5 opacity-0 group-hover/mail:opacity-100 shrink-0 ml-0.5 transition-opacity" />
                              )}
                            </button>
                          ) : (
                            <span className="text-xs text-muted-foreground/60 italic">
                              No email
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                        <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>{patient.age} yrs</span>
                        <span className="text-border mx-0.5">•</span>
                        <span className="text-muted-foreground font-normal">
                          {patient.gender}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <Badge
                        variant={getConditionBadgeVariant(patient.condition)}
                        className="font-medium"
                      >
                        {patient.condition}
                      </Badge>
                    </TableCell>

                    <TableCell className="min-w-44">
                      {docObj ? (
                        <Link
                          href={`/doctors/${docObj._id}`}
                          className="flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors group/doc"
                        >
                          <Stethoscope className="h-3.5 w-3.5 text-primary shrink-0 group-hover/doc:scale-110 transition-transform" />
                          <span className="truncate max-w-40">
                            {docObj.name}
                          </span>
                        </Link>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Stethoscope className="h-3.5 w-3.5 shrink-0 opacity-50" />
                          <span className="truncate max-w-40">
                            {typeof patient.doctor === "string"
                              ? patient.doctor
                              : "Unassigned"}
                          </span>
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            patient.phone,
                            "Phone number",
                            `phone-${patient._id}`,
                          )
                        }
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors group/ph whitespace-nowrap"
                        title="Click to copy phone number"
                      >
                        <Phone className="h-3 w-3 shrink-0 group-hover/ph:text-primary transition-colors" />
                        <span className="font-mono whitespace-nowrap">
                          {patient.phone}
                        </span>
                        {copiedId === `phone-${patient._id}` ? (
                          <Check className="h-2.5 w-2.5 text-emerald-500 shrink-0 ml-0.5" />
                        ) : (
                          <Copy className="h-2.5 w-2.5 opacity-0 group-hover/ph:opacity-100 shrink-0 ml-0.5 transition-opacity" />
                        )}
                      </button>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span>
                          {formatDate(patient.visitDate || patient.createdAt)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
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

        {/* Mobile Cards View */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {patients.map(patient => {
            const docObj =
              typeof patient.doctor === "object" ? patient.doctor : null;

            return (
              <div
                key={patient._id}
                className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {patient.image ? (
                      <img
                        src={patient.image}
                        alt={patient.name}
                        className="h-10 w-10 shrink-0 rounded-xl object-cover border border-border/60"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                        {(patient.name || "P").charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-sm text-foreground">
                        {patient.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {patient.age} yrs • {patient.gender}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={getConditionBadgeVariant(patient.condition)}
                    className="text-[11px]"
                  >
                    {patient.condition}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground space-y-1 pt-1 border-t border-border/40">
                  <div className="flex items-center gap-1.5">
                    <Stethoscope className="h-3.5 w-3.5 text-primary" />
                    <span>
                      Attending:{" "}
                      {docObj
                        ? docObj.name
                        : typeof patient.doctor === "string"
                          ? patient.doctor
                          : "None"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {formatDate(patient.visitDate || patient.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2.5 rounded-lg text-xs"
                    onClick={() => onEdit(patient)}
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 px-2.5 rounded-lg text-xs"
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
        title={`Delete ${selectedPatientForDelete?.name}?`}
        description="Are you sure you want to delete this patient record? This action cannot be undone."
        confirmText="Confirm Delete"
        isLoading={isDeleting}
      />
    </>
  );
};
