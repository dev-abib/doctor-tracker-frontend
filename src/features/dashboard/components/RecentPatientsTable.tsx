"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, User } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils";
import { Patient } from "@/types/api";

interface Props {
  patients?: Patient[];
  isLoading?: boolean;
}

export const RecentPatientsTable: React.FC<Props> = ({ patients = [], isLoading }) => {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between pb-5 border-b border-border/60 mb-4">
        <div>
          <h2 className="text-base font-bold text-foreground">Recent Patient Admissions</h2>
          <p className="text-xs text-muted-foreground">Latest registered medical consultations</p>
        </div>
        <Link
          href="/patients"
          className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <span>View All Patients</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      ) : patients.length === 0 ? (
        <EmptyState
          title="No recent admissions"
          description="New patient admissions will appear here."
        />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Demographics</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Assigned Doctor</TableHead>
                <TableHead>Visit Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => {
                const docObj = typeof patient.doctor === "object" ? patient.doctor : null;

                return (
                  <TableRow key={patient._id}>
                    <TableCell className="font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <span>{patient.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {patient.age} yrs • {patient.gender}
                    </TableCell>
                    <TableCell>
                      <Badge variant="purple">{patient.condition}</Badge>
                    </TableCell>
                    <TableCell>
                      {docObj ? (
                        <Link
                          href={`/doctors/${docObj._id}`}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          {docObj.name}
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">Assigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(patient.visitDate || patient.createdAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
