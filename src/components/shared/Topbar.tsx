"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Menu,
  Search,
  Code2,
  ChevronDown,
  Settings,
  LogOut,
  Stethoscope,
  Users,
  UserCheck,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";
import { QuickSearchModal } from "./QuickSearchModal";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Compute section tag and title based on current path
  const getPageInfo = () => {
    if (pathname === "/") {
      return {
        tag: "OVERVIEW",
        title: "Clinical Dashboard",
        icon: LayoutDashboard,
      };
    }
    if (pathname.startsWith("/doctors/")) {
      return {
        tag: "PRACTITIONER",
        title: "Doctor Profile & Roster",
        icon: UserCheck,
      };
    }
    if (pathname.startsWith("/doctors")) {
      return {
        tag: "MANAGEMENT",
        title: "Doctor Directory",
        icon: Stethoscope,
      };
    }
    if (pathname.startsWith("/patients")) {
      return {
        tag: "RECORDS",
        title: "Patient Management",
        icon: Users,
      };
    }
    if (pathname.startsWith("/settings")) {
      return {
        tag: "ADMINISTRATION",
        title: "Administrator Settings",
        icon: Settings,
      };
    }
    return {
      tag: "PORTAL",
      title: "Doctor Tracker",
      icon: LayoutDashboard,
    };
  };

  const pageInfo = getPageInfo();
  const IconComponent = pageInfo.icon;

  // Global CTRL+K / CMD+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close user dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-2 sm:top-4 z-40 flex items-center justify-between rounded-2xl bg-white dark:bg-slate-900 border border-[#e8eef6] dark:border-slate-800 px-3 sm:px-5 py-2.5 sm:py-3 shadow-[0_4px_25px_-4px_rgba(0,0,0,0.03)] backdrop-blur-md mb-4 sm:mb-5 transition-all">
        {/* Left: Mobile trigger & Page Tracker */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
          <button
            onClick={onToggleSidebar}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden transition-colors cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-[#eff2fc] dark:bg-indigo-950/60 text-[#5046e5] dark:text-indigo-400 shadow-2xs">
              <IconComponent className="h-4 w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 leading-none truncate">
                {pageInfo.tag}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight mt-0.5 truncate">
                {pageInfo.title}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions & User Chip with Dropdown */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile Search Button (Tap to open QuickSearchModal) */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex lg:hidden items-center justify-center h-9 w-9 rounded-xl bg-[#f8fafc] dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-[#e8eef6] dark:border-slate-700/80 shadow-2xs hover:bg-[#eff2fc] hover:text-[#5046e5] dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Search"
            title="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* API & Handoff Button */}
          <a
            href="http://localhost:5000/api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-[#eff2fc] dark:bg-indigo-950/60 px-3.5 py-2 text-xs font-semibold text-[#5046e5] dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-100 dark:border-indigo-800/60 transition-colors shrink-0 whitespace-nowrap"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>API & Handoff</span>
          </a>

          {/* Cloud Status */}
          <div className="hidden md:inline-flex items-center gap-2 rounded-xl bg-[#f8fafc] dark:bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 border border-[#e8eef6] dark:border-slate-700/80 shadow-2xs shrink-0 whitespace-nowrap">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Clinic Cloud: <strong className="font-semibold text-emerald-600 dark:text-emerald-400">Online</strong></span>
          </div>

          {/* Quick Search Button (Clickable + CTRL+K) */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="hidden lg:flex items-center gap-2 rounded-xl bg-[#f8fafc] dark:bg-slate-800/80 px-3.5 py-2 text-xs text-slate-400 border border-[#e8eef6] dark:border-slate-700/80 shadow-2xs w-56 shrink-0 hover:border-indigo-300 hover:bg-[#eff2fc]/50 dark:hover:bg-slate-800 transition-all cursor-pointer text-left"
          >
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate whitespace-nowrap">Quick search...</span>
            <kbd className="ml-auto shrink-0 whitespace-nowrap rounded bg-slate-200/70 dark:bg-slate-700 px-2 py-0.5 text-[9px] font-bold text-slate-600 dark:text-slate-300">
              CTRL K
            </kbd>
          </button>

          {/* User Profile Card & Interactive Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl bg-[#f8fafc] dark:bg-slate-800/80 p-1 sm:pl-1.5 sm:pr-2.5 sm:py-1 border border-[#e8eef6] dark:border-slate-700/80 shadow-2xs shrink-0 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer"
              aria-label="User Profile Menu"
            >
              <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-[#5046e5] text-white font-bold text-xs overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{user?.name ? user.name.charAt(0) : "D"}</span>
                )}
                <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-slate-900" />
              </div>
              <div className="hidden sm:flex flex-col text-left max-w-[150px]">
                <span className="truncate text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {user?.name || "Dr. Administrator"}
                </span>
                <span className="text-[9px] font-semibold text-[#5046e5] dark:text-indigo-400 leading-none">
                  Super Admin
                </span>
              </div>
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 hidden sm:block shrink-0 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180 text-[#5046e5]" : ""
                }`}
              />
            </button>

            {/* User Profile Dropdown Card */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-[#e8eef6] dark:border-slate-800 p-3 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.1)] z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Header Details */}
                <div className="px-1.5 pb-2.5 border-b border-[#f1f5f9] dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {user?.name || "Dr. Administrator"}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {user?.email || "admin@doctortracker.com"}
                  </p>
                </div>

                {/* Menu Actions */}
                <div className="pt-2 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push("/settings");
                    }}
                    className="flex w-full items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-[#eff2fc] hover:text-[#5046e5] dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Settings className="h-4 w-4 text-slate-400" />
                    <span>Account Settings</span>
                  </button>

                  <div className="my-1 border-b border-[#f1f5f9] dark:border-slate-800" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Global Quick Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
