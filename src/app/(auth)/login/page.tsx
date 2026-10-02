import React from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Practitioner Sign In",
  description: "Sign in to DoctorTracker Administrator Portal with secure JWT authentication.",
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#f2f5fa] dark:bg-slate-950">
      <LoginForm />
    </main>
  );
}
