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
    <div className="w-full max-w-4xl overflow-hidden rounded-3xl sm:rounded-4xl md:rounded-[36px] bg-card shadow-[0_20px_70px_-15px_rgba(0,0,0,0.08)] border border-border/80 grid grid-cols-1 md:grid-cols-2">
      {/* Left Form Section */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        <div>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                <Activity className="h-5 w-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                Doctor Tracker
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
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
                  className="w-full h-13 rounded-2xl bg-muted/50 px-4 pr-12 text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none border border-border/60 focus:border-primary focus:bg-background transition-all"
                  {...register("email")}
                />
                <div className="absolute right-3.5 flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold shadow-xs">
                  DT
                </div>
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-destructive font-medium">
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
                  className="w-full h-13 rounded-2xl bg-muted/50 px-4 pr-12 text-sm font-medium text-foreground placeholder:text-muted-foreground tracking-wider outline-none border border-border/60 focus:border-primary focus:bg-background transition-all"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
                <p className="mt-1 text-xs text-destructive font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>


            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-13 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all duration-200 shadow-md shadow-primary/25 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
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
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline transition-all cursor-pointer group"
            >
              <KeyRound className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
              <span>Quick Dev Credentials</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-muted-foreground">
            Protected clinical admin area • Unauthorized access is monitored
          </p>
        </div>
      </div>

      {/* Right Studio Visual Section */}
      <div className="hidden md:block relative w-full h-full min-h-120 bg-muted">
        <img
          src="/images/studio_desk.jpg"
          alt="Studio Workspace"
          className="w-full h-full object-cover object-center"
        />
      </div>
    </div>
  );
};
