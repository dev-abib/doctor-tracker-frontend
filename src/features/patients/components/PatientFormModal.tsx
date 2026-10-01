"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Patient } from "@/types/api";

const patientFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  age: z.coerce.number().int().min(0, "Age cannot be negative").max(130),
  gender: z.enum(["Male", "Female", "Other"]),
  phone: z.string().min(5, "Valid phone number is required"),
  email: z.string().email("Valid email").optional().or(z.literal("")),
  image: z.string().optional(),
  condition: z.string().min(2, "Medical condition is required"),
  doctor: z.string().min(1, "Please assign a doctor"),
  visitDate: z.string().optional(),
});

export type PatientFormData = z.infer<typeof patientFormSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PatientFormData) => Promise<void>;
  initialData?: Patient | null;
  doctorsList?: Array<{ _id: string; name: string; specialization: string }>;
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

export const PatientFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  doctorsList = [],
  isLoading = false,
}) => {
  const isEditing = !!initialData;
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: "",
      age: 35,
      gender: "Male",
      phone: "",
      email: "",
      image: "",
      condition: "",
      doctor: "",
      visitDate: today,
    },
  });

  useEffect(() => {
    if (initialData) {
      const docId =
        typeof initialData.doctor === "object"
          ? initialData.doctor._id
          : initialData.doctor;

      let vDate = today;
      if (initialData.visitDate) {
        vDate = new Date(initialData.visitDate).toISOString().split("T")[0];
      }

      reset({
        name: initialData.name,
        age: initialData.age,
        gender: initialData.gender,
        phone: initialData.phone,
        email: initialData.email || "",
        image: initialData.image || "",
        condition: initialData.condition,
        doctor: docId || "",
        visitDate: vDate,
      });
    } else {
      reset({
        name: "",
        age: 35,
        gender: "Male",
        phone: "",
        email: "",
        image: "",
        condition: "",
        doctor: doctorsList[0]?._id || "",
        visitDate: today,
      });
    }
  }, [initialData, reset, isOpen, doctorsList, today]);

  const handleFormSubmit = async (data: PatientFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Patient Record" : "Register New Patient"}
      description={
        isEditing
          ? "Update patient medical history and doctor assignment."
          : "Create a patient profile and assign to an attending physician."
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 pt-2">

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Patient Full Name *
          </label>
          <Input
            placeholder="e.g. Eleanor Vance"
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
              placeholder="e.g. 45"
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

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Assigned Attending Doctor *
          </label>
          <Select error={errors.doctor?.message} {...register("doctor")}>
            <option value="">-- Select Attending Physician --</option>
            {doctorsList.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name} ({doc.specialization})
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Condition / Diagnosis *
            </label>
            <Input
              list="patient-condition-list"
              placeholder="e.g. Type 2 Diabetes"
              error={errors.condition?.message}
              {...register("condition")}
            />
            <datalist id="patient-condition-list">
              {COMMON_CONDITIONS.map((cond) => (
                <option key={cond} value={cond} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Visit / Consultation Date *
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
              Contact Phone *
            </label>
            <Input
              placeholder="e.g. +1 (555) 019-2834"
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
              placeholder="e.g. patient@mail.com"
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
            {isEditing ? "Save Changes" : "Create Patient"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
