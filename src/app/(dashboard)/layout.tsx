"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isLoading } = useAuth();

  // Load user collapse preference on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("doctor_tracker_sidebar_collapsed");
      if (saved !== null) {
        setIsSidebarCollapsed(saved === "true");
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("doctor_tracker_sidebar_collapsed", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-xs font-semibold text-muted-foreground animate-pulse">
            Connecting Doctor Tracker Portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground flex">
      {/* Synchronized Left Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content Column with Seamless Header Sync */}
      <div
        className={cn(
          "flex flex-col min-w-0 transition-[padding] duration-300 ease-in-out w-full min-h-screen",
          isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
        )}
      >
        {/* Sticky Topbar Header (Flush with screen top, perfectly synchronized with Sidebar h-16) */}
        <Topbar
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* Dynamic Full-Width Page Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
