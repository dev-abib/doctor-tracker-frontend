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

interface SidebarProps {
  isOpen: boolean; // Mobile drawer state
  onClose: () => void;
  isCollapsed: boolean; // Desktop collapse state
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  isCollapsed,
}) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isNavActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "Doctors",
      href: "/doctors",
      icon: Stethoscope,
      badge: "Staff",
      badgeColor: "bg-indigo-50 dark:bg-indigo-950/80 text-primary dark:text-indigo-300",
    },
    {
      label: "Patients",
      href: "/patients",
      icon: Users,
      badge: "Active",
      badgeColor: "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      badge: "Admin",
      badgeColor: "bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Synchronized Left Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between bg-card border-r border-border/70 transition-all duration-300 ease-in-out h-screen select-none",
          // Mobile responsive drawer
          isOpen ? "translate-x-0 w-72 shadow-2xl" : "-translate-x-full lg:translate-x-0",
          // Desktop collapsed vs expanded width
          isCollapsed ? "lg:w-20" : "lg:w-64"
        )}
      >
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header Brand (Synchronized h-16 with Topbar) */}
          <div
            className={cn(
              "flex items-center h-16 border-b border-border/70 px-4 shrink-0 transition-all",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2.5 group min-w-0 transition-all",
                isCollapsed && "justify-center"
              )}
              onClick={onClose}
              title="Doctor Tracker"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-sm shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Activity className="h-5 w-5" />
              </div>

              {!isCollapsed && (
                <div className="flex flex-col min-w-0 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-foreground text-sm leading-none whitespace-nowrap tracking-tight">
                      Doctor Tracker
                    </span>
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary border border-primary/20 shrink-0">
                      PRO
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground leading-tight mt-0.5 whitespace-nowrap">
                    Clinical Portal
                  </span>
                </div>
              )}
            </Link>

            {/* Mobile Drawer Close Button */}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted lg:hidden cursor-pointer shrink-0"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {/* Clinical Portal Group */}
            <div>
              {!isCollapsed ? (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2">
                  Clinical Portal
                </p>
              ) : (
                <div className="h-1" />
              )}

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      title={isCollapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center rounded-xl text-xs transition-all group relative",
                        isCollapsed
                          ? "justify-center h-10 w-full"
                          : "justify-between px-3 py-2.5 font-medium",
                        active
                          ? "bg-primary/10 text-primary font-semibold shadow-2xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                      )}
                    >
                      <div className={cn("flex items-center gap-3 min-w-0", isCollapsed && "justify-center")}>
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                            active ? "text-primary font-bold" : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isCollapsed && item.badge && (
                        <span className={cn("rounded px-1.5 py-0.5 text-[9px] font-bold shrink-0", item.badgeColor)}>
                          {item.badge}
                        </span>
                      )}

                      {/* Collapsed Active State Indicator */}
                      {isCollapsed && active && (
                        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Developer Section */}
            <div>
              {!isCollapsed ? (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 mb-2">
                  Developer Tools
                </p>
              ) : (
                <div className="h-px bg-border/40 my-2 mx-1" />
              )}

              <nav className="space-y-1">
                <a
                  href="http://localhost:5000/api/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  title={isCollapsed ? "Swagger API Docs" : undefined}
                  className={cn(
                    "flex items-center rounded-xl text-xs transition-all text-muted-foreground hover:text-foreground hover:bg-muted/60",
                    isCollapsed
                      ? "justify-center h-10 w-full"
                      : "justify-between px-3 py-2.5 font-medium"
                  )}
                >
                  <div className={cn("flex items-center gap-3 min-w-0", isCollapsed && "justify-center")}>
                    <Code2 className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                    {!isCollapsed && <span className="truncate">Swagger API Docs</span>}
                  </div>
                  {!isCollapsed && <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />}
                </a>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Profile & Utilities */}
        <div className="border-t border-border/70 p-3 shrink-0 bg-card/60">
          {!isCollapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border/60">
              <Link
                href="/settings"
                onClick={onClose}
                className="flex items-center gap-2.5 overflow-hidden min-w-0 hover:opacity-85 transition-opacity"
              >
                <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs overflow-hidden">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>{user?.name ? user.name.charAt(0) : "A"}</span>
                  )}
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-card" />
                </div>
                <div className="flex flex-col overflow-hidden text-left min-w-0">
                  <span className="truncate text-xs font-bold text-foreground leading-tight">
                    {user?.name || "Dr. Administrator"}
                  </span>
                  <span className="text-[9px] font-bold uppercase text-primary leading-tight mt-0.5">
                    SUPER ADMIN
                  </span>
                </div>
              </Link>

              <button
                onClick={logout}
                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer shrink-0 ml-1"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-1">
              <Link
                href="/settings"
                onClick={onClose}
                title={user?.name || "Dr. Administrator"}
                className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-xs overflow-hidden hover:scale-105 transition-transform"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{user?.name ? user.name.charAt(0) : "A"}</span>
                )}
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-card" />
              </Link>

              <button
                onClick={logout}
                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
