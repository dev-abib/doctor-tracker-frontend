"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/shared/Sidebar";
import { Topbar } from "@/components/shared/Topbar";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f4f7fc] dark:bg-[#090d16]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#5046e5] border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500 animate-pulse">
            Connecting Doctor Tracker Portal...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#f4f7fc] dark:bg-[#090d16]">
      {/* Fixed Viewport Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area offset by Sidebar */}
      <div className="flex flex-col min-w-0 lg:pl-72 transition-all">
        <main className="flex-1 px-3 sm:px-6 lg:px-8 pt-2 sm:pt-4 pb-12 w-full max-w-[1600px]">
          <Topbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
          {children}
        </main>
      </div>
    </div>
  );
}
