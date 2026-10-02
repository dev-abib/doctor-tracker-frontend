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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { QuickSearchModal } from "./QuickSearchModal";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SWAGGER_DOCS_URL } from "@/lib/utils";

interface TopbarProps {
  onToggleMobileSidebar: () => void;
  isSidebarCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileSidebar,
  isSidebarCollapsed = false,
  onToggleCollapse,
}) => {
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
        setIsSearchOpen(prev => !prev);
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
      <header className="sticky top-0 z-40 h-16 flex items-center justify-between border-b border-border/70 bg-card/85 backdrop-blur-md px-4 sm:px-6 lg:px-8 transition-all w-full select-none">
        {/* Left: Mobile Trigger & Sidebar Collapse Toggle + Page Info */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
          {/* Mobile Drawer Trigger */}
          <button
            onClick={onToggleMobileSidebar}
            className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-muted lg:hidden transition-colors cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Desktop Sidebar Toggle Button */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label="Toggle sidebar"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          )}

          {/* Vertical Separator */}
          <div className="hidden lg:block h-5 w-px bg-border/60 shrink-0" />

          {/* Page Title & Breadcrumb Indicator */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-2xs">
              <IconComponent className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-none truncate">
                {pageInfo.tag}
              </span>
              <span className="text-xs sm:text-sm font-bold text-foreground leading-tight mt-0.5 truncate">
                {pageInfo.title}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Actions, Search, Live Cloud Status, User Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Quick Search Button */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex lg:hidden items-center justify-center h-8 w-8 rounded-lg bg-muted/60 text-muted-foreground border border-border/60 hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Search"
            title="Search"
          >
            <Search className="h-3.5 w-3.5" />
          </button>

          {/* Desktop Global Search Bar */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="hidden lg:flex items-center gap-2.5 rounded-xl bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground border border-border/60 shadow-2xs w-56 hover:border-primary/40 hover:bg-muted/80 transition-all cursor-pointer text-left"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className="truncate whitespace-nowrap">Quick search...</span>
            <kbd className="ml-auto shrink-0 whitespace-nowrap rounded bg-background px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground border border-border/60">
              CTRL K
            </kbd>
          </button>

          {/* Swagger API & Handoff Link */}
          <a
            href={SWAGGER_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/15 border border-primary/20 transition-colors shrink-0 whitespace-nowrap"
          >
            <Code2 className="h-3.5 w-3.5" />
            <span>API Docs</span>
          </a>

          {/* User Profile Pill & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(prev => !prev)}
              className="flex items-center gap-2 rounded-xl bg-muted/50 p-1 sm:pl-1.5 sm:pr-2.5 sm:py-1 border border-border/60 shadow-2xs shrink-0 hover:border-primary/40 transition-all cursor-pointer"
              aria-label="User Profile Menu"
            >
              <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs overflow-hidden shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{user?.name ? user.name.charAt(0) : "D"}</span>
                )}
                <span className="absolute bottom-0 right-0 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-1 ring-card" />
              </div>
              <div className="hidden sm:flex flex-col text-left max-w-36">
                <span className="truncate text-xs font-bold text-foreground leading-tight">
                  {user?.name || "Dr. Administrator"}
                </span>
                <span className="text-[9px] font-semibold text-primary leading-none">
                  Super Admin
                </span>
              </div>
              <ChevronDown
                className={`h-3 w-3 text-muted-foreground hidden sm:block shrink-0 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-card border border-border/80 p-2.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-2 py-1.5 border-b border-border/60">
                  <p className="text-xs font-bold text-foreground truncate">
                    {user?.name || "Dr. Administrator"}
                  </p>
                  <p className="text-[11px] font-mono text-muted-foreground truncate mt-0.5">
                    {user?.email || "admin@doctortracker.com"}
                  </p>
                </div>

                <div className="pt-1.5 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push("/settings");
                    }}
                    className="flex w-full items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span>Account Settings</span>
                  </button>

                  <div className="my-1 border-b border-border/60" />

                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
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

      {/* Global Quick Search Command Palette */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
