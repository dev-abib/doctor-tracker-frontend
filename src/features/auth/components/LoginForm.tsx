"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Mail, Activity, KeyRound, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    toast.info("Admin demo credentials loaded!");
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-2xl">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white shadow-lg shadow-blue-500/30 mb-4">
          <Activity className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-foreground">
          Doctor Tracker
        </h2>
        <p className="mt-1.5 text-xs text-muted-foreground">
          Secure Administrative Clinical Portal
        </p>
      </div>

      {/* Quick Demo Fill Card */}
      <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-primary shrink-0" />
          <div className="text-left">
            <p className="text-xs font-semibold text-foreground">Demo Admin Account</p>
            <p className="text-[11px] text-muted-foreground">admin@doctortracker.com</p>
          </div>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={fillDemoAdmin}
          className="h-7 rounded-lg text-xs bg-card"
        >
          Auto Fill
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="admin@doctortracker.com"
              className="pl-10"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="••••••••"
              className="pl-10"
              error={errors.password?.message}
              {...register("password")}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="gradient"
          className="w-full h-11 rounded-xl mt-2 font-semibold"
          isLoading={isSubmitting}
        >
          <KeyRound className="h-4 w-4 mr-2" />
          Sign In
        </Button>
      </form>
    </div>
  );
};
