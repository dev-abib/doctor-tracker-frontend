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
import { formatDate, getConditionBadgeVariant } from "@/lib/utils";
import { Patient } from "@/types/api";

interface Props {
  patients?: Patient[];
  isLoading?: boolean;
}

export const RecentPatientsTable: React.FC<Props> = ({ patients = [], isLoading }) => {
  return (
    <div className="rounded-2xl border border-[#e8eef6] dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pb-4 border-b border-[#e8eef6] dark:border-slate-800 mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
            Recent Patient Admissions
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Latest registered medical consultations & triage entries
          </p>
        </div>
        <Link
          href="/patients"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5046e5] dark:text-indigo-400 hover:underline shrink-0"
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
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-[#f1f5f9] dark:border-slate-800 hover:bg-transparent">
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Patient Name</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Demographics</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Condition</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned Doctor</TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Visit Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => {
                  const docObj = typeof patient.doctor === "object" ? patient.doctor : null;

                  return (
                    <TableRow key={patient._id} className="border-b border-[#f8fafc] dark:border-slate-800/60 hover:bg-[#f8fafc] dark:hover:bg-slate-800/40 transition-colors">
                      <TableCell className="font-semibold text-slate-900 dark:text-white py-3.5">
                        <div className="flex items-center gap-2.5">
                          {patient.image ? (
                            <img
                              src={patient.image}
                              alt={patient.name}
                              className="h-7 w-7 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eff2fc] dark:bg-indigo-950/60 text-[#5046e5] dark:text-indigo-400">
                              <User className="h-3.5 w-3.5" />
                            </div>
                          )}
                          <span className="text-xs font-semibold">{patient.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 dark:text-slate-400 py-3.5">
                        {patient.age} yrs • {patient.gender}
                      </TableCell>
                      <TableCell className="py-3.5">
                        <Badge variant={getConditionBadgeVariant(patient.condition)}>{patient.condition}</Badge>
                      </TableCell>
                      <TableCell className="py-3.5">
                        {docObj ? (
                          <Link
                            href={`/doctors/${docObj._id}`}
                            className="text-xs font-semibold text-[#5046e5] dark:text-indigo-400 hover:underline"
                          >
                            {docObj.name}
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-400">Assigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap py-3.5">
                        {formatDate(patient.visitDate || patient.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card List View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {patients.map((patient) => {
              const docObj = typeof patient.doctor === "object" ? patient.doctor : null;

              return (
                <div
                  key={patient._id}
                  className="rounded-xl border border-[#e8eef6] dark:border-slate-800 bg-[#f8fafc]/50 dark:bg-slate-800/40 p-3.5 space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {patient.image ? (
                        <img
                          src={patient.image}
                          alt={patient.name}
                          className="h-7 w-7 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#eff2fc] dark:bg-indigo-950/60 text-[#5046e5] dark:text-indigo-400">
                          <User className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {patient.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {patient.age} yrs • {patient.gender}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={getConditionBadgeVariant(patient.condition)}
                      className="text-[10px] shrink-0 max-w-28 sm:max-w-32 truncate"
                      title={patient.condition}
                    >
                      {patient.condition}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="truncate">
                      {docObj ? (
                        <span className="text-slate-500 dark:text-slate-400">
                          Doctor: <strong className="text-[#5046e5] dark:text-indigo-400 font-semibold">{docObj.name}</strong>
                        </span>
                      ) : (
                        <span>Assigned</span>
                      )}
                    </div>
                    <span className="shrink-0 text-slate-400">
                      {formatDate(patient.visitDate || patient.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
