"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Doctor } from "@/types/api";

const doctorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  specialization: z.string().min(2, "Specialization is required"),
  hospital: z.string().min(2, "Hospital name is required"),
  phone: z.string().min(5, "Valid phone number is required"),
  email: z.string().email("Valid email address is required"),
});

export type DoctorFormData = z.infer<typeof doctorFormSchema>;

interface DoctorFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DoctorFormData) => Promise<void>;
  initialData?: Doctor | null;
  isLoading?: boolean;
}

const COMMON_SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Dermatology",
  "Oncology",
  "Endocrinology",
  "Gastroenterology",
  "Psychiatry",
  "Pulmonology",
  "General Surgery",
  "Ophthalmology",
];

export const DoctorFormModal: React.FC<DoctorFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      specialization: "",
      hospital: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        specialization: initialData.specialization,
        hospital: initialData.hospital,
        phone: initialData.phone,
        email: initialData.email,
      });
    } else {
      reset({
        name: "",
        specialization: "",
        hospital: "",
        phone: "",
        email: "",
      });
    }
  }, [initialData, reset, isOpen]);

  const handleFormSubmit = async (data: DoctorFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Doctor Profile" : "Register New Doctor"}
      description={
        isEditing
          ? "Update practitioner contact and hospital affiliation details."
          : "Add a certified medical practitioner to the system."
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Full Name (with Dr. prefix) *
          </label>
          <Input
            placeholder="e.g. Dr. Emily Watson"
            error={errors.name?.message}
            {...register("name")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Medical Specialization *
            </label>
            <Input
              list="specialization-list"
              placeholder="e.g. Cardiology"
              error={errors.specialization?.message}
              {...register("specialization")}
            />
            <datalist id="specialization-list">
              {COMMON_SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Hospital Affiliation *
            </label>
            <Input
              placeholder="e.g. Johns Hopkins Medical Center"
              error={errors.hospital?.message}
              {...register("hospital")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Official Email Address *
            </label>
            <Input
              type="email"
              placeholder="e.g. dr.watson@hospital.org"
              error={errors.email?.message}
              {...register("email")}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Contact Phone *
            </label>
            <Input
              placeholder="e.g. +1 (555) 234-5678"
              error={errors.phone?.message}
              {...register("phone")}
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
            {isEditing ? "Save Changes" : "Create Doctor"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
