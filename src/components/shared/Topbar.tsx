"use client";

import React from "react";
import { Menu, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface TopbarProps {
  onToggleSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/70 bg-card/70 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-xl p-2 text-muted-foreground hover:bg-accent md:hidden transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Doctor Tracker</span>
          <span>/</span>
          <span className="capitalize text-primary font-medium">Administration</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin Portal</span>
          </div>
        )}

        <ThemeToggle />
      </div>
    </header>
  );
};
