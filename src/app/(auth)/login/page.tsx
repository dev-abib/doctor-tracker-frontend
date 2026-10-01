import React from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4 bg-gradient-to-br from-blue-50/50 via-background to-indigo-50/50 dark:from-slate-950 dark:via-background dark:to-slate-900 overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 -z-10 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl" />

      <LoginForm />
    </div>
  );
}
