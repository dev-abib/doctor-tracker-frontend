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
import { formatDate, cn } from "@/lib/utils";
import { Doctor } from "@/types/api";

interface DoctorTableProps {
  doctors: Doctor[];
  isLoading: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: string) => Promise<any>;
  sort?: string;
  onSortChange?: (newSort: string) => void;
}

export const DoctorTable: React.FC<DoctorTableProps> = ({
  doctors,
  isLoading,
  onEdit,
  onDelete,
  sort,
  onSortChange,
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

  const handleToggleNameSort = () => {
    if (!onSortChange) return;
    if (sort === "name_asc") onSortChange("name_desc");
    else onSortChange("name_asc");
  };

  const handleToggleDateSort = () => {
    if (!onSortChange) return;
    if (sort === "newest") onSortChange("oldest");
    else onSortChange("newest");
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
                <TableHead className="min-w-55">
                  <button
                    type="button"
                    onClick={handleToggleNameSort}
                    className="inline-flex items-center gap-1.5 font-bold hover:text-foreground transition-colors cursor-pointer text-xs"
                    title="Sort by doctor name"
                  >
                    <span>Doctor</span>
                    {sort === "name_asc" ? (
                      <ArrowUp className="h-3.5 w-3.5 text-primary" />
                    ) : sort === "name_desc" ? (
                      <ArrowDown className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <ArrowUpDown className="h-3.5 w-3.5 opacity-40 hover:opacity-100" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="whitespace-nowrap">Specialization</TableHead>
                <TableHead className="min-w-40">Hospital</TableHead>
                <TableHead className="whitespace-nowrap">Contact</TableHead>
                <TableHead className="text-center whitespace-nowrap">Patients</TableHead>
                <TableHead className="whitespace-nowrap">
                  <button
                    type="button"
                    onClick={handleToggleDateSort}
                    className="inline-flex items-center gap-1.5 font-bold hover:text-foreground transition-colors cursor-pointer text-xs"
                    title="Sort by registration date"
                  >
                    <span>Joined</span>
                    {sort === "newest" ? (
                      <ArrowDown className="h-3.5 w-3.5 text-primary" />
                    ) : sort === "oldest" ? (
                      <ArrowUp className="h-3.5 w-3.5 text-primary" />
                    ) : (
                      <ArrowUpDown className="h-3.5 w-3.5 opacity-40 hover:opacity-100" />
                    )}
                  </button>
                </TableHead>
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor._id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell className="min-w-55">
                    <div className="flex items-center gap-3">
                      {doctor.image ? (
                        <img
                          src={doctor.image}
                          alt={doctor.name}
                          className="h-10 w-10 shrink-0 rounded-xl object-cover border border-border/60"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                          {(doctor.name || "D").replace("Dr. ", "").charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <Link
                          href={`/doctors/${doctor._id}`}
                          className="font-bold text-foreground hover:text-primary transition-colors block truncate"
                        >
                          {doctor.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(doctor.email, "Email", `email-${doctor._id}`)}
                          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 truncate text-left cursor-pointer transition-colors group/mail"
                          title="Click to copy email"
                        >
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{doctor.email}</span>
                          {copiedId === `email-${doctor._id}` ? (
                            <Check className="h-2.5 w-2.5 text-emerald-500 shrink-0 ml-0.5" />
                          ) : (
                            <Copy className="h-2.5 w-2.5 opacity-0 group-hover/mail:opacity-100 shrink-0 ml-0.5 transition-opacity" />
                          )}
                        </button>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <Badge variant="default" className="font-medium whitespace-nowrap">
                      <Stethoscope className="h-3 w-3 mr-1 shrink-0" />
                      {doctor.specialization}
                    </Badge>
                  </TableCell>

                  <TableCell className="min-w-40">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate max-w-45">{doctor.hospital}</span>
                    </div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(doctor.phone, "Phone number", `phone-${doctor._id}`)}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors group/ph whitespace-nowrap"
                      title="Click to copy phone number"
                    >
                      <Phone className="h-3 w-3 shrink-0 group-hover/ph:text-primary transition-colors" />
                      <span className="font-mono whitespace-nowrap">{doctor.phone}</span>
                      {copiedId === `phone-${doctor._id}` ? (
                        <Check className="h-2.5 w-2.5 text-emerald-500 shrink-0 ml-0.5" />
                      ) : (
                        <Copy className="h-2.5 w-2.5 opacity-0 group-hover/ph:opacity-100 shrink-0 ml-0.5 transition-opacity" />
                      )}
                    </button>
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
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="h-10 w-10 shrink-0 rounded-xl object-cover border border-border/60"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                      {(doctor.name || "D").replace("Dr. ", "").charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/doctors/${doctor._id}`}
                      className="font-bold text-sm text-foreground hover:text-primary truncate block"
                      title={doctor.name}
                    >
                      {doctor.name}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate" title={doctor.email}>
                      {doctor.email}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="default"
                  className="text-[11px] shrink-0 max-w-32 sm:max-w-36 truncate text-center"
                  title={doctor.specialization}
                >
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
