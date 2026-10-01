"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, Camera, Link as LinkIcon } from "lucide-react";
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

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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

  const imageValue = watch("image");

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
      setPreviewUrl(initialData.image || "");
      setShowUrlInput(!!initialData.image && initialData.image.startsWith("http"));
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
      setPreviewUrl("");
      setShowUrlInput(false);
    }
  }, [initialData, reset, isOpen, doctorsList, today]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file);
      setValue("image", compressed, { shouldValidate: true, shouldDirty: true });
      setPreviewUrl(compressed);
    } catch (err) {
      console.error("Failed to process patient image", err);
    }
  };

  const handleRemoveImage = () => {
    setValue("image", "", { shouldValidate: true, shouldDirty: true });
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
        {/* Patient Photo Section */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Patient Photo
          </label>
          <div className="flex items-center gap-4 p-3 rounded-2xl border border-border/70 bg-muted/20">
            {/* Avatar Preview */}
            <div className="relative shrink-0">
              {previewUrl ? (
                <div className="relative group">
                  <img
                    src={previewUrl}
                    alt="Patient preview"
                    className="h-16 w-16 rounded-2xl object-cover border-2 border-primary/20 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                    title="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-muted border border-border/80 flex items-center justify-center text-muted-foreground">
                  <Camera className="h-7 w-7 opacity-60" />
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 text-xs font-medium rounded-xl gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload Photo
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="h-8 text-xs font-medium rounded-xl text-muted-foreground gap-1.5"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  {showUrlInput ? "Hide URL" : "Paste URL"}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Supports JPG, PNG, or WebP. Automatically optimized for web performance.
              </p>
            </div>
          </div>

          {/* URL Input Fallback */}
          {showUrlInput && (
            <div className="mt-2">
              <Input
                placeholder="https://example.com/patient-avatar.jpg"
                value={imageValue || ""}
                onChange={(e) => {
                  setValue("image", e.target.value, { shouldValidate: true, shouldDirty: true });
                  setPreviewUrl(e.target.value);
                }}
              />
            </div>
          )}
        </div>

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
