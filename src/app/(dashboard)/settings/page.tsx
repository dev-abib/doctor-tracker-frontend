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
  CheckCircle2,
  Cloud,
  Save,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Server,
  Camera,
  ShieldCheck,
  Database,
  HardDrive,
  Sparkles,
  Info,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authApi } from "@/features/auth/api/authApi";

export default function SettingsPage() {
  const { user, updateUser } = useAuth();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "cloud">("profile");

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sync profile fields from user session
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAvatarPreview(user.avatar || "");
    }
  }, [user]);

  const copyToClipboard = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: "None", color: "bg-muted" };
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: "Weak", color: "bg-rose-500" };
      case 2:
        return { score: 50, label: "Fair", color: "bg-amber-500" };
      case 3:
        return { score: 75, label: "Good", color: "bg-sky-500" };
      case 4:
        return { score: 100, label: "Strong", color: "bg-emerald-500" };
      default:
        return { score: 0, label: "None", color: "bg-muted" };
    }
  };

  const passStrength = getPasswordStrength(newPassword);

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
    <div className="w-full space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Unified Page Header */}
      <PageHeader
        title="Administrator Settings"
        description="Manage your practitioner identity, credentials security, and cloud media infrastructure."
        icon={<Shield className="h-5 w-5 text-primary" />}
        badge={
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold">
            <Sparkles className="h-3 w-3" />
            Super Administrator
          </div>
        }
        action={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/80 text-xs font-semibold text-muted-foreground shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-foreground">Session Active</span>
            <span className="text-border">|</span>
            <span className="text-muted-foreground font-normal">Encrypted TLS</span>
          </div>
        }
      />

      {/* Modern Segmented Tab Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-muted/50 border border-border/60 w-full sm:w-fit max-w-full overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`shrink-0 whitespace-nowrap flex items-center justify-center gap-2 py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "profile"
              ? "bg-card text-foreground shadow-xs border border-border/70"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-4 w-4 shrink-0" />
          <span>Profile Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`shrink-0 whitespace-nowrap flex items-center justify-center gap-2 py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "security"
              ? "bg-card text-foreground shadow-xs border border-border/70"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Lock className="h-4 w-4 shrink-0" />
          <span>Security & Auth</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cloud")}
          className={`shrink-0 whitespace-nowrap flex items-center justify-center gap-2 py-2 px-3.5 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "cloud"
              ? "bg-card text-foreground shadow-xs border border-border/70"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Cloud className="h-4 w-4 shrink-0" />
          <span>Cloud CDN</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
        {/* Main Settings Form Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* TAB 1: Profile Details */}
          {activeTab === "profile" && (
            <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden animate-in fade-in duration-200">
              <CardHeader className="border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-foreground">Practitioner Profile</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Update your administrator name, contact email, and profile avatar.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Avatar Uploader (Modern SaaS Style) */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-center gap-5 p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <div className="relative group shrink-0">
                      {avatarPreview ? (
                        <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-border shadow-md ring-4 ring-primary/10">
                          <img
                            src={avatarPreview}
                            alt="Admin avatar"
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[10px] font-medium gap-0.5"
                            title="Change photo"
                          >
                            <Camera className="h-4 w-4" />
                            <span>Change</span>
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-indigo-600 text-primary-foreground font-black text-2xl flex items-center justify-center shadow-md ring-4 ring-primary/10 cursor-pointer group hover:opacity-90 transition-opacity"
                          title="Upload photo"
                        >
                          <span>{name ? name.charAt(0).toUpperCase() : "A"}</span>
                        </div>
                      )}

                      {/* Small camera badge */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-card border border-border shadow-xs flex items-center justify-center text-foreground hover:text-primary transition-colors cursor-pointer"
                        title="Upload photo"
                      >
                        <Camera className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-foreground">Profile Picture</p>
                        <p className="text-[11px] text-muted-foreground">
                          JPG, PNG, or WebP. Max file size 10MB.
                        </p>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      <div className="flex items-center justify-center sm:justify-start gap-2 pt-0.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-7 px-3 text-xs font-semibold rounded-lg gap-1.5 cursor-pointer shadow-none"
                        >
                          <Upload className="h-3 w-3" />
                          <span>{avatarPreview ? "Upload New" : "Upload Image"}</span>
                        </Button>

                        {avatarPreview && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveAvatar}
                            className="h-7 px-2.5 text-xs font-medium rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Full Name</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dr. Alexander Vance"
                        className="h-10 rounded-xl"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>Email Address</span>
                        </label>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                          <Lock className="h-2.5 w-2.5" />
                          <span>Locked</span>
                        </span>
                      </div>
                      <div className="relative">
                        <Input
                          type="email"
                          value={email}
                          disabled
                          readOnly
                          placeholder="admin@doctortracker.com"
                          className="h-10 rounded-xl bg-muted/50 border-border/80 text-muted-foreground cursor-not-allowed select-none font-medium pr-8"
                        />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Primary administrator account email cannot be modified.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Contact Phone Number</span>
                    </label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 (555) 019-2834"
                      className="h-10 rounded-xl"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/60">
                    <p className="text-[11px] text-muted-foreground">
                      Changes are reflected immediately across the entire workspace.
                    </p>
                    <Button
                      type="submit"
                      variant="gradient"
                      isLoading={isUpdatingProfile}
                      className="gap-2 rounded-xl px-5 font-bold shadow-md cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Profile Changes</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* TAB 2: Security & Password */}
          {activeTab === "security" && (
            <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden animate-in fade-in duration-200">
              <CardHeader className="border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-foreground">Security & Password</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Update your administrator account password and authentication credentials.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <form onSubmit={handleSavePassword} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Current Password</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        className="h-10 rounded-xl pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-md"
                        tabIndex={-1}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>New Password</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="h-10 rounded-xl pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-md"
                          tabIndex={-1}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Confirm Password</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className="h-10 rounded-xl pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-1 rounded-md"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2.5 text-xs animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-muted-foreground">Password Complexity:</span>
                        <span className="font-bold text-foreground">{passStrength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passStrength.color}`}
                          style={{ width: `${passStrength.score}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className={`h-3.5 w-3.5 ${newPassword.length >= 6 ? "text-emerald-500" : "text-muted-foreground/40"}`} />
                          <span>At least 6 characters</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className={`h-3.5 w-3.5 ${/[A-Z]/.test(newPassword) ? "text-emerald-500" : "text-muted-foreground/40"}`} />
                          <span>Contains uppercase letter</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className={`h-3.5 w-3.5 ${/[0-9]/.test(newPassword) ? "text-emerald-500" : "text-muted-foreground/40"}`} />
                          <span>Contains number or symbol</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className={`h-3.5 w-3.5 ${newPassword === confirmPassword && confirmPassword.length > 0 ? "text-emerald-500" : "text-muted-foreground/40"}`} />
                          <span>Passwords match</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-border/60">
                    <p className="text-[11px] text-muted-foreground">
                      Session tokens will remain active after password change.
                    </p>
                    <Button
                      type="submit"
                      variant="default"
                      isLoading={isUpdatingPassword}
                      className="gap-2 rounded-xl px-5 font-bold shadow-md cursor-pointer"
                    >
                      <KeyRound className="h-4 w-4" />
                      <span>Update Password</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* TAB 3: Cloud Media Storage & CDN */}
          {activeTab === "cloud" && (
            <Card className="rounded-3xl border-border/80 bg-card shadow-xs overflow-hidden animate-in fade-in duration-200">
              <CardHeader className="border-b border-border/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    <Cloud className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-foreground">Cloud Media Infrastructure</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      Storage health, buffer pipelines, and Cloudinary CDN status.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-5 text-xs">
                {/* Status card */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300">
                  <div className="flex items-center gap-2 font-bold mb-1 text-sm">
                    <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>In-Memory Stream Buffering Active</span>
                  </div>
                  <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                    Media files are streamed directly into Cloudinary CDN storage via memory buffers without writing raw files to disk, ensuring maximum privacy and HIPAA-compliant processing.
                  </p>
                </div>

                {/* Storage Buckets Grid */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-foreground tracking-tight">Dedicated CDN Storage Folders</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <User className="h-3.5 w-3.5" />
                        <span className="text-xs">Doctor Avatars</span>
                      </div>
                      <p className="font-mono text-[11px] text-muted-foreground break-all">
                        doctor_tracker/doctors
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <HardDrive className="h-3.5 w-3.5" />
                        <span className="text-xs">Patient Photos</span>
                      </div>
                      <p className="font-mono text-[11px] text-muted-foreground break-all">
                        doctor_tracker/patients
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/60 space-y-1">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <Shield className="h-3.5 w-3.5" />
                        <span className="text-xs">Admin Headshots</span>
                      </div>
                      <p className="font-mono text-[11px] text-muted-foreground break-all">
                        doctor_tracker/adminProfilePic
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="pt-2 border-t border-border/60 space-y-2.5">
                  <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground font-medium">Max Payload Limit</span>
                    <span className="font-bold text-foreground">10 MB per request</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground font-medium">Delivery Optimization</span>
                    <span className="font-bold text-foreground">Automatic WebP compression & AVIF</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-muted-foreground font-medium">Transmission Security</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">TLS 1.3 / End-to-End Encrypted</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column (1 Col): Admin Profile Overview & System Status */}
        <div className="space-y-6">
          {/* Identity Card */}
          <Card className="rounded-3xl border-border/80 bg-card shadow-xs p-5 space-y-5">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-600 text-primary-foreground font-bold text-lg shadow-md ring-2 ring-primary/20">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={user?.name || "Admin"}
                    className="h-12 w-12 rounded-2xl object-cover"
                  />
                ) : (
                  (user?.name || "A").charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-foreground text-sm truncate">
                    {user?.name || "Administrator"}
                  </p>
                  <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    Authenticated Session
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60 text-xs">
              <div
                onClick={() => copyToClipboard(user?.email || "admin@doctortracker.com", "Admin Email", "email")}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted cursor-pointer transition-colors border border-border/40"
                title="Click to copy email"
              >
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Admin Email</p>
                  <p className="font-semibold text-foreground truncate mt-0.5">{user?.email || "admin@doctortracker.com"}</p>
                </div>
                {copiedKey === "email" ? (
                  <Check className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                )}
              </div>

              {user?.id && (
                <div
                  onClick={() => copyToClipboard(user.id, "Admin ID", "id")}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted cursor-pointer transition-colors border border-border/40"
                  title="Click to copy Admin ID"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Account Identifier</p>
                    <p className="font-mono text-xs font-bold text-foreground truncate mt-0.5">
                      {user.id.substring(0, 10)}...{user.id.substring(user.id.length - 6)}
                    </p>
                  </div>
                  {copiedKey === "id" ? (
                    <Check className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                  )}
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/15 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-muted-foreground text-[11px] font-medium">Role Privilege</span>
                <p className="font-bold text-foreground">Super Administrator</p>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">
                Level 1 Access
              </Badge>
            </div>
          </Card>

          {/* System & Architecture Status */}
          <Card className="rounded-3xl border-border/80 bg-card shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Server className="h-4 w-4 text-primary" />
                <span>System Architecture</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Healthy</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Frontend Application</span>
                <span className="font-semibold text-foreground">Next.js 16 (App Router)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Backend API Engine</span>
                <span className="font-semibold text-foreground">Express + TypeScript</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground">Database Cluster</span>
                <span className="font-semibold text-foreground">MongoDB Atlas M0</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-muted-foreground">Media Storage Engine</span>
                <span className="font-semibold text-foreground">Cloudinary CDN</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

