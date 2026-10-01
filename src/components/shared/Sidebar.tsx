"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  Code2,
  ExternalLink,
  Activity,
  X,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";

import { ThemeToggle } from "./ThemeToggle";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isNavActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Fixed Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col justify-between bg-white dark:bg-slate-900 border-r border-[#e8eef6] dark:border-slate-800 p-4 transition-transform duration-300 ease-in-out lg:top-4 lg:bottom-4 lg:left-4 lg:h-[calc(100vh-2rem)] lg:translate-x-0 lg:rounded-3xl lg:border lg:border-[#e8eef6] lg:dark:border-slate-800 lg:shadow-[0_4px_25px_-4px_rgba(0,0,0,0.03)]",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:shadow-none"
        )}
      >
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Brand Header */}
          <div className="flex items-center justify-between px-1.5 pt-1 pb-5 shrink-0 border-b border-[#f1f5f9] dark:border-slate-800/80">
            <Link
              href="/"
              className="flex items-center gap-2.5 group min-w-0"
              onClick={onClose}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#5046e5] text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 dark:text-white text-base leading-none whitespace-nowrap">
                    Doctor Tracker
                  </span>
                  <span className="rounded bg-[#eff2fc] dark:bg-indigo-950/60 px-1.5 py-0.5 text-[9px] font-bold text-[#5046e5] dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 shrink-0">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1 whitespace-nowrap">
                  Clinical Control Center
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Connected Application Routes Only */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-5 pt-4">
            {/* Section 1: CLINICAL MODULES */}
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                CLINICAL PORTAL
              </p>
              <nav className="space-y-1">
                <Link
                  href="/"
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors",
                    isNavActive("/")
                      ? "bg-[#eff2fc] dark:bg-indigo-950/60 text-[#5046e5] dark:text-indigo-400 shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </div>
                </Link>

                <Link
                  href="/doctors"
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors",
                    isNavActive("/doctors")
                      ? "bg-[#eff2fc] dark:bg-indigo-950/60 text-[#5046e5] dark:text-indigo-400 font-semibold shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Stethoscope className="h-4 w-4" />
                    <span>Doctors</span>
                  </div>
                  <span className="rounded bg-indigo-50 dark:bg-indigo-950/80 px-1.5 py-0.5 text-[9px] font-bold text-[#5046e5] dark:text-indigo-300">
                    Staff
                  </span>
                </Link>

                <Link
                  href="/patients"
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors",
                    isNavActive("/patients")
                      ? "bg-[#eff2fc] dark:bg-indigo-950/60 text-[#5046e5] dark:text-indigo-400 font-semibold shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4" />
                    <span>Patients</span>
                  </div>
                  <span className="rounded bg-emerald-50 dark:bg-emerald-950/80 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                    Active
                  </span>
                </Link>

                <Link
                  href="/settings"
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium transition-colors",
                    isNavActive("/settings")
                      ? "bg-[#eff2fc] dark:bg-indigo-950/60 text-[#5046e5] dark:text-indigo-400 font-semibold shadow-2xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </div>
                  <span className="rounded bg-violet-50 dark:bg-violet-950/80 px-1.5 py-0.5 text-[9px] font-bold text-violet-600 dark:text-violet-400">
                    Admin
                  </span>
                </Link>
              </nav>
            </div>

            {/* Section 2: DEVELOPER & API */}
            <div>
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                DEVELOPER TOOLS
              </p>
              <nav className="space-y-1">
                <a
                  href="http://localhost:5000/api/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Code2 className="h-4 w-4" />
                    <span>Swagger API Docs</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Profile & Utilities */}
        <div className="border-t border-[#e8eef6] dark:border-slate-800 pt-3 shrink-0 space-y-2">
          <div className="flex items-center justify-between p-2 rounded-2xl bg-[#f8fafc] dark:bg-slate-800/60 border border-[#e8eef6] dark:border-slate-700/60">
            <Link
              href="/settings"
              onClick={onClose}
              className="flex items-center gap-2.5 overflow-hidden min-w-0 hover:opacity-85 transition-opacity"
            >
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#5046e5] text-white font-bold text-xs shadow-xs overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{user?.name ? user.name.charAt(0) : "A"}</span>
                )}
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div className="flex flex-col overflow-hidden text-left min-w-0">
                <span className="truncate text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {user?.name || "Dr. Administrator"}
                </span>
                <span className="text-[9px] font-bold uppercase text-[#5046e5] dark:text-indigo-400 leading-tight mt-0.5">
                  SUPER ADMIN
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-1 shrink-0">
              <ThemeToggle />
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
