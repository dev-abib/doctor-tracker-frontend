"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, Camera, Link as LinkIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Doctor } from "@/types/api";
import { authApi } from "@/features/auth/api/authApi";

const doctorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  specialization: z.string().min(2, "Specialization is required"),
  hospital: z.string().min(2, "Hospital name is required"),
  phone: z.string().min(5, "Valid phone number is required"),
  email: z.string().email("Valid email address is required"),
  image: z.string().optional(),
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

export const DoctorFormModal: React.FC<DoctorFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const isEditing = !!initialData;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: "",
      specialization: "",
      hospital: "",
      phone: "",
      email: "",
      image: "",
    },
  });

  const imageValue = watch("image");

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        specialization: initialData.specialization,
        hospital: initialData.hospital,
        phone: initialData.phone,
        email: initialData.email,
        image: initialData.image || "",
      });
      setPreviewUrl(initialData.image || "");
      setShowUrlInput(!!initialData.image && initialData.image.startsWith("http"));
    } else {
      reset({
        name: "",
        specialization: "",
        hospital: "",
        phone: "",
        email: "",
        image: "",
      });
      setPreviewUrl("");
      setShowUrlInput(false);
    }
  }, [initialData, reset, isOpen]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show temporary instant preview
    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);
    setIsUploadingImage(true);

    try {
      // 1. Stream buffer to Cloudinary via Multer backend endpoint
      const uploadRes = await authApi.uploadImage(file, "doctors");
      if (uploadRes?.url) {
        setValue("image", uploadRes.url, { shouldValidate: true, shouldDirty: true });
        setPreviewUrl(uploadRes.url);
        toast.success("Doctor photo uploaded to Cloudinary");
        return;
      }
    } catch {
      // 2. Graceful offline fallback: local canvas compression
      try {
        const compressed = await compressImage(file);
        setValue("image", compressed, { shouldValidate: true, shouldDirty: true });
        setPreviewUrl(compressed);
      } catch (compressionErr) {
        console.error("Image processing error", compressionErr);
      }
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setValue("image", "", { shouldValidate: true, shouldDirty: true });
    setPreviewUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
        {/* Profile Image Upload Section */}
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Profile Photo
          </label>
          <div className="flex items-center gap-4 p-3 rounded-2xl border border-border/70 bg-muted/20">
            {/* Avatar Preview */}
            <div className="relative shrink-0">
              {previewUrl ? (
                <div className="relative group">
                  <img
                    src={previewUrl}
                    alt="Doctor preview"
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

            {/* Upload Controls */}
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
                  disabled={isUploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 text-xs font-medium rounded-xl gap-1.5"
                >
                  {isUploadingImage ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-3.5 w-3.5" />
                      Upload Photo
                    </>
                  )}
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
                placeholder="https://example.com/doctor-avatar.jpg"
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
