"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Shield,
  Lock,
  Upload,
  X,
  Camera,
  CheckCircle2,
  Cloud,
  Save,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authApi } from "@/features/auth/api/authApi";

export default function SettingsPage() {
  const { user, updateUser, refreshUser } = useAuth();

  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Sync profile fields from user session
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  // Handle avatar file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size exceeds the 10MB limit");
      return;
    }

    setAvatarFile(file);
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit profile updates
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Administrator name cannot be empty");
      return;
    }
    if (!email.trim()) {
      toast.error("Administrator email cannot be empty");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("phone", phone.trim());

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      } else if (!avatarPreview) {
        formData.append("avatar", "");
      }

      const updatedUser = await authApi.updateProfile(formData);
      updateUser(updatedUser);
      setAvatarFile(null);
      toast.success("Administrator profile updated successfully");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to update profile";
      toast.error(msg);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Submit password updates
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const message = await authApi.updatePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      toast.success(message || "Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to update password";
      toast.error(msg);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#5046e5]/10 via-indigo-500/5 to-transparent border border-indigo-100 dark:border-indigo-900/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Administrator Settings
            </h1>
            <Badge variant="default" className="gap-1 text-[11px] font-bold">
              <Shield className="h-3 w-3" />
              Super Admin
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Manage your personal profile details, security credentials, and Cloudinary media storage.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Profile & Security */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card className="rounded-3xl border-[#e8eef6] dark:border-slate-800 shadow-xs overflow-hidden">
            <CardHeader className="border-b border-[#f1f5f9] dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#5046e5]">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Profile Details</CardTitle>
                  <CardDescription className="text-xs">
                    Your public practitioner and administrator identity information.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSaveProfile} className="space-y-5">
                {/* Avatar Uploader */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-[#f8fafc] dark:bg-slate-800/40 border border-[#e8eef6] dark:border-slate-700/60">
                    <div className="relative shrink-0">
                      {avatarPreview ? (
                        <div className="relative group">
                          <img
                            src={avatarPreview}
                            alt="Admin avatar"
                            className="h-20 w-20 rounded-2xl object-cover border-2 border-[#5046e5]/30 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                            title="Remove photo"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#5046e5] text-white font-extrabold text-2xl shadow-sm">
                          {name ? name.charAt(0) : "A"}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
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
                          className="h-8 text-xs font-semibold rounded-xl gap-1.5"
                        >
                          <Upload className="h-3.5 w-3.5" />
                          Choose New Photo
                        </Button>
                        {avatarPreview && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveAvatar}
                            className="h-8 text-xs font-medium rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Processed via Multer & Cloudinary. Max 10MB (JPEG, PNG, WebP).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dr. John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@doctortracker.com"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Contact Phone Number
                  </label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 019-2834"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    variant="gradient"
                    isLoading={isUpdatingProfile}
                    className="gap-2 rounded-xl"
                  >
                    <Save className="h-4 w-4" />
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Password Security Card */}
          <Card className="rounded-3xl border-[#e8eef6] dark:border-slate-800 shadow-xs overflow-hidden">
            <CardHeader className="border-b border-[#f1f5f9] dark:border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Security Credentials</CardTitle>
                  <CardDescription className="text-xs">
                    Update your password to keep the administration portal protected.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleSavePassword} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Current Password *
                  </label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      New Password *
                    </label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 6 characters"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Confirm New Password *
                    </label>
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    variant="default"
                    isLoading={isUpdatingPassword}
                    className="gap-2 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                  >
                    <KeyRound className="h-4 w-4" />
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 Col): System Integration Info */}
        <div className="space-y-6">
          {/* Cloudinary Integration Status */}
          <Card className="rounded-3xl border-[#e8eef6] dark:border-slate-800 shadow-xs overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600">
                  <Cloud className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold">Cloud Media Storage</CardTitle>
                  <CardDescription className="text-xs">
                    Powered by Multer & Cloudinary
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Cloud Streaming Ready</span>
                </div>
                <p className="text-[11px] text-emerald-700/90 dark:text-emerald-400">
                  Multer buffers images in-memory and pipes them to Cloudinary CDN via streams without disk consumption.
                </p>
              </div>

              <div className="space-y-2 pt-1 border-t border-[#f1f5f9] dark:border-slate-800">
                <div className="flex justify-between py-1 border-b border-[#f1f5f9] dark:border-slate-800/60">
                  <span className="text-slate-500">Root Namespace</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">doctor_tracker/</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9] dark:border-slate-800/60">
                  <span className="text-slate-500">Doctor Avatars</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">/doctors</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#f1f5f9] dark:border-slate-800/60">
                  <span className="text-slate-500">Admin Headshots</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">/adminProfilePic</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Max File Size</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">10 MB Buffer</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Overview Badge */}
          <Card className="rounded-3xl border-[#e8eef6] dark:border-slate-800 shadow-xs p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5046e5] text-white font-bold text-lg shadow-md shadow-indigo-500/20">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-12 w-12 rounded-2xl object-cover"
                  />
                ) : (
                  user?.name?.charAt(0) || "A"
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 dark:text-white truncate">
                  {user?.name || "Administrator"}
                </p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Active Session
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
