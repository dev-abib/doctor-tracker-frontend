import React from "react";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#f2f5fa] dark:bg-slate-950">
      <LoginForm />
    </main>
  );
}
