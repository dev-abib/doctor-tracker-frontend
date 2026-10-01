"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  LogOut,
  Activity,
  X,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Doctors",
    href: "/doctors",
    icon: Stethoscope,
  },
  {
    label: "Patients",
    href: "/patients",
    icon: Users,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-border/80 bg-card/95 backdrop-blur-md px-4 py-6 transition-transform duration-300 ease-in-out md:static md:translate-x-0",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:shadow-none"
        )}
      >
        <div className="flex flex-col space-y-6">
          {/* Logo & Close button on mobile */}
          <div className="flex items-center justify-between px-3">
            <Link
              href="/"
              className="flex items-center gap-3 font-bold text-lg tracking-tight group"
              onClick={onClose}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
                <Activity className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-foreground leading-tight">
                  Doctor Tracker
                </span>
                <span className="text-[11px] font-medium text-primary">
                  Clinical Portal
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent md:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1.5 pt-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm shadow-blue-500/25"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-current" : "text-muted-foreground")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="border-t border-border/70 pt-4 space-y-3">
          {user && (
            <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3 border border-border/50">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="flex flex-col overflow-hidden text-left">
                <span className="truncate text-xs font-semibold text-foreground">
                  {user.name}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {user.email}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
