"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Stethoscope,
  Users,
  LayoutDashboard,
  Code2,
  ArrowRight,
  ExternalLink,
  User,
  Settings,
} from "lucide-react";
import { useDoctorsList } from "@/features/doctors/hooks/useDoctors";
import { usePatientsList } from "@/features/patients/hooks/usePatients";

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch doctors & patients matching query
  const { data: doctorsData, isLoading: isDoctorsLoading } = useDoctorsList({
    search: query.trim(),
    limit: 4,
  });

  const { data: patientsData, isLoading: isPatientsLoading } = usePatientsList({
    search: query.trim(),
    limit: 4,
  });

  const doctors = doctorsData?.doctors || [];
  const patients = patientsData?.patients || [];

  const [selectedIndex, setSelectedIndex] = useState(0);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const pages = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Doctors Directory", href: "/doctors", icon: Stethoscope },
    { label: "Patient Records", href: "/patients", icon: Users },
    { label: "Admin Settings", href: "/settings", icon: Settings },
  ].filter((p) =>
    query ? p.label.toLowerCase().includes(query.toLowerCase()) : true
  );

  // Flatten searchable list for unified keyboard navigation
  const allItems = [
    ...doctors.map((d) => ({
      type: "doctor" as const,
      id: d._id,
      title: d.name,
      subtitle: `${d.specialization} • ${d.patientCount ?? 0} patients`,
      href: `/doctors/${d._id}`,
      image: d.image,
      icon: Stethoscope,
    })),
    ...patients.map((p) => {
      const docObj = typeof p.doctor === "object" ? p.doctor : null;
      return {
        type: "patient" as const,
        id: p._id,
        title: p.name,
        subtitle: `${p.age} yrs • ${p.gender} • ${p.condition}`,
        extra: docObj?.name ? `Dr. ${docObj.name.replace("Dr. ", "")}` : "",
        href: `/patients?search=${encodeURIComponent(p.name)}`,
        image: p.image,
        icon: User,
      };
    }),
    ...pages.map((pg) => ({
      type: "page" as const,
      id: pg.href,
      title: pg.label,
      subtitle: pg.href,
      href: pg.href,
      image: undefined,
      icon: pg.icon,
    })),
  ];

  // Handle keyboard navigation (Escape, ArrowUp, ArrowDown, Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (allItems.length ? (prev + 1) % allItems.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (allItems.length ? (prev - 1 + allItems.length) % allItems.length : 0));
      } else if (e.key === "Enter" && allItems.length > 0) {
        e.preventDefault();
        const selected = allItems[selectedIndex];
        if (selected) {
          navigateTo(selected.href);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, allItems, selectedIndex]);

  // Reset selectedIndex on query change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!isOpen) return null;

  const navigateTo = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-20">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Container */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-[#e8eef6] dark:border-slate-800 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.15)] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]">
        {/* Search Input Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#e8eef6] dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-850">
          <Search className="h-5 w-5 text-[#5046e5] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search doctors, patients, diagnosis, departments..."
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[10px] font-bold text-slate-500 shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Search Results Area */}
        <div className="overflow-y-auto p-3 space-y-4 flex-1">
          {/* Doctors Section */}
          {doctors.length > 0 && (
            <div>
              <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Doctors ({doctors.length})
              </p>
              <div className="space-y-1">
                {doctors.map((doc) => {
                  const globalIdx = allItems.findIndex((item) => item.id === doc._id);
                  const isSelected = globalIdx === selectedIndex;
                  return (
                    <button
                      key={doc._id}
                      onClick={() => navigateTo(`/doctors/${doc._id}`)}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex w-full items-center justify-between p-2.5 rounded-xl transition-all text-left group cursor-pointer ${
                        isSelected
                          ? "bg-[#eff2fc] dark:bg-slate-800 border border-indigo-200 dark:border-slate-700"
                          : "hover:bg-[#eff2fc]/60 dark:hover:bg-slate-800/60 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {doc.image ? (
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="h-8 w-8 shrink-0 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                          />
                        ) : (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5046e5]">
                            <Stethoscope className="h-4 w-4" />
                          </div>
                        )}
                        <div className="truncate">
                          <p className={`text-xs font-bold transition-colors ${isSelected ? "text-[#5046e5] dark:text-indigo-400" : "text-slate-900 dark:text-white"}`}>
                            {doc.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {doc.specialization} • {doc.patientCount ?? 0} patients
                          </p>
                        </div>
                      </div>
                      <ArrowRight className={`h-4 w-4 text-slate-400 transition-all shrink-0 ${isSelected ? "opacity-100 translate-x-0.5 text-[#5046e5]" : "opacity-0"}`} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Patients Section */}
          {patients.length > 0 && (
            <div>
              <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Patients ({patients.length})
              </p>
              <div className="space-y-1">
                {patients.map((patient) => {
                  const docObj =
                    typeof patient.doctor === "object" ? patient.doctor : null;
                  const globalIdx = allItems.findIndex((item) => item.id === patient._id);
                  const isSelected = globalIdx === selectedIndex;
                  return (
                    <button
                      key={patient._id}
                      onClick={() =>
                        navigateTo(`/patients?search=${encodeURIComponent(patient.name)}`)
                      }
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex w-full items-center justify-between p-2.5 rounded-xl transition-all text-left group cursor-pointer ${
                        isSelected
                          ? "bg-[#eff2fc] dark:bg-slate-800 border border-indigo-200 dark:border-slate-700"
                          : "hover:bg-[#eff2fc]/60 dark:hover:bg-slate-800/60 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {patient.image ? (
                          <img
                            src={patient.image}
                            alt={patient.name}
                            className="h-8 w-8 shrink-0 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                          />
                        ) : (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                        <div className="truncate">
                          <p className={`text-xs font-bold transition-colors ${isSelected ? "text-[#5046e5] dark:text-indigo-400" : "text-slate-900 dark:text-white"}`}>
                            {patient.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {patient.age} yrs • {patient.gender} • Condition:{" "}
                            <span className="font-semibold text-slate-600 dark:text-slate-300">
                              {patient.condition}
                            </span>
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 shrink-0">
                        {docObj?.name ? `Dr. ${docObj.name.replace("Dr. ", "")}` : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Pages Navigation */}
          {pages.length > 0 && (
            <div>
              <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Navigation
              </p>
              <div className="space-y-1">
                {pages.map((p) => {
                  const Icon = p.icon;
                  const globalIdx = allItems.findIndex((item) => item.id === p.href);
                  const isSelected = globalIdx === selectedIndex;
                  return (
                    <button
                      key={p.href}
                      onClick={() => navigateTo(p.href)}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`flex w-full items-center justify-between p-2.5 rounded-xl transition-all text-left group cursor-pointer ${
                        isSelected
                          ? "bg-[#eff2fc] dark:bg-slate-800 border border-indigo-200 dark:border-slate-700"
                          : "hover:bg-[#eff2fc]/60 dark:hover:bg-slate-800/60 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className={`text-xs font-semibold transition-colors ${isSelected ? "text-[#5046e5] dark:text-indigo-400" : "text-slate-800 dark:text-slate-200"}`}>
                          {p.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {p.href}
                      </span>
                    </button>
                  );
                })}

                <a
                  href="http://localhost:5000/api/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-between p-2.5 rounded-xl hover:bg-[#eff2fc] dark:hover:bg-slate-800 transition-colors text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Code2 className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-[#5046e5] transition-colors">
                      Swagger API Documentation
                    </span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          )}

          {/* Empty State when searching */}
          {query.trim() &&
            !isDoctorsLoading &&
            !isPatientsLoading &&
            doctors.length === 0 &&
            patients.length === 0 &&
            pages.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  No matches found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Try searching by doctor name, medical specialty, or patient diagnosis.
                </p>
              </div>
            )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-[#e8eef6] dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-850 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded bg-slate-200/80 dark:bg-slate-700 px-1 py-0.5 text-[9px] font-bold">
                ↑↓
              </kbd>{" "}
              to navigate
            </span>
            <span>
              <kbd className="rounded bg-slate-200/80 dark:bg-slate-700 px-1 py-0.5 text-[9px] font-bold">
                ↵
              </kbd>{" "}
              to select
            </span>
            <span>
              <kbd className="rounded bg-slate-200/80 dark:bg-slate-700 px-1 py-0.5 text-[9px] font-bold">
                ESC
              </kbd>{" "}
              to close
            </span>
          </div>
          <span className="font-medium text-[#5046e5]">Doctor Tracker Core</span>
        </div>
      </div>
    </div>
  );
};
