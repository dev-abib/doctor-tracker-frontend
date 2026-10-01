"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, KeyRound, Activity } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await login(data);
      toast.success("Welcome back! Signed in successfully.");
    } catch (err: any) {
      toast.error(err.customMessage || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAdmin = () => {
    setValue("email", "admin@doctortracker.com", { shouldValidate: true });
    setValue("password", "Admin@123456", { shouldValidate: true });
    toast.info("Admin credentials loaded!");
  };

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-[24px] sm:rounded-[32px] md:rounded-[36px] bg-white dark:bg-slate-900 shadow-[0_20px_70px_-15px_rgba(0,0,0,0.08)] border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2">
      {/* Left Form Section */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        <div>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5046e5] text-white shadow-sm">
                <Activity className="h-5 w-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Doctor Tracker
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Sign in to access your clinical dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div>
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="admin@doctortracker.com"
                  className="w-full h-[52px] rounded-2xl bg-[#eff2fc] dark:bg-slate-800/90 px-4 pr-12 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none border border-transparent focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 transition-all"
                  {...register("email")}
                />
                <div className="absolute right-3.5 flex h-7 w-7 items-center justify-center rounded-lg bg-[#5046e5] text-white text-xs font-bold shadow-sm">
                  DT
                </div>
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  className="w-full h-[52px] rounded-2xl bg-[#eff2fc] dark:bg-slate-800/90 px-4 pr-12 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 tracking-wider outline-none border border-transparent focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-800 transition-all"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500 font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                className="text-xs font-medium text-[#5046e5] hover:text-[#4338ca] dark:text-indigo-400 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[52px] rounded-2xl bg-[#5046e5] hover:bg-[#4338ca] text-white font-medium text-sm transition-all duration-200 shadow-sm active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Quick Dev Credentials */}
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5046e5] hover:text-[#4338ca] dark:text-indigo-400 transition-colors cursor-pointer group"
            >
              <KeyRound className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
              <span>Quick Dev Credentials</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Protected clinical admin area • Unauthorized access is monitored
          </p>
        </div>
      </div>

      {/* Right Studio Visual Section */}
      <div className="hidden md:block relative w-full h-full min-h-[480px] bg-slate-100 dark:bg-slate-800">
        <img
          src="/images/studio_desk.jpg"
          alt="Studio Workspace"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
};
