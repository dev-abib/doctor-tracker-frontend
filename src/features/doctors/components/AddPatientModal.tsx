"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const addPatientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  age: z.coerce.number().int().min(0, "Age cannot be negative").max(130),
  gender: z.enum(["Male", "Female", "Other"]),
  phone: z.string().min(5, "Valid phone number is required"),
  email: z.string().email("Valid email").optional().or(z.literal("")),
  condition: z.string().min(2, "Medical condition is required"),
  visitDate: z.string().optional(),
});

export type AddPatientFormData = z.infer<typeof addPatientSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddPatientFormData) => Promise<void>;
  doctorName?: string;
  isLoading?: boolean;
}

const COMMON_CONDITIONS = [
  "Hypertension",
  "Type 2 Diabetes",
  "Coronary Artery Disease",
  "Asthma",
  "Migraine",
  "Osteoarthritis",
  "Major Depressive Disorder",
  "Generalized Anxiety",
  "Chronic Bronchitis",
  "Eczema",
  "Hypothyroidism",
  "Gastroesophageal Reflux",
  "Cardiac Arrhythmia",
];

export const AddPatientModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  doctorName,
  isLoading = false,
}) => {
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddPatientFormData>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: {
      name: "",
      age: 35,
      gender: "Male",
      phone: "",
      email: "",
      condition: "",
      visitDate: today,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: "",
        age: 35,
        gender: "Male",
        phone: "",
        email: "",
        condition: "",
        visitDate: today,
      });
    }
  }, [isOpen, reset, today]);

  const handleFormSubmit = async (data: AddPatientFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add Patient to Doctor Roster"
      description={`Register a new consultation under ${doctorName || "this doctor"}.`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Patient Full Name *
          </label>
          <Input
            placeholder="e.g. Johnathan Doe"
            error={errors.name?.message}
            {...register("name")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Age *
            </label>
            <Input
              type="number"
              placeholder="e.g. 42"
              error={errors.age?.message}
              {...register("age")}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Gender *
            </label>
            <Select error={errors.gender?.message} {...register("gender")}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Diagnosis / Medical Condition *
            </label>
            <Input
              list="condition-list"
              placeholder="e.g. Hypertension"
              error={errors.condition?.message}
              {...register("condition")}
            />
            <datalist id="condition-list">
              {COMMON_CONDITIONS.map((cond) => (
                <option key={cond} value={cond} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Consultation / Visit Date *
            </label>
            <Input
              type="date"
              error={errors.visitDate?.message}
              {...register("visitDate")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Phone Number *
            </label>
            <Input
              placeholder="e.g. +1 (555) 345-6789"
              error={errors.phone?.message}
              {...register("phone")}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Email Address (Optional)
            </label>
            <Input
              type="email"
              placeholder="e.g. patient@example.com"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="gradient" isLoading={isLoading}>
            Add Patient
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
