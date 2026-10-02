import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return "0";
  return new Intl.NumberFormat("en-US").format(num);
}

export function formatDate(dateString: string | Date | undefined): string {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
}

export function formatDateTime(dateString: string | Date | undefined): string {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "N/A";
  }
}

export function getConditionBadgeVariant(condition: string): "default" | "destructive" | "warning" | "success" | "purple" | "info" {
  const lower = condition.toLowerCase();
  if (lower.includes("cardiac") || lower.includes("artery") || lower.includes("hypertension")) {
    return "destructive";
  }
  if (lower.includes("asthma") || lower.includes("bronchitis") || lower.includes("pulmon")) {
    return "info";
  }
  if (lower.includes("diabetes") || lower.includes("thyroid") || lower.includes("reflux")) {
    return "warning";
  }
  if (lower.includes("migraine") || lower.includes("depress") || lower.includes("anxiety")) {
    return "purple";
  }
  if (lower.includes("eczema") || lower.includes("osteo") || lower.includes("arthrit")) {
    return "success";
  }
  return "default";
}

export const SWAGGER_DOCS_URL =
  process.env.NEXT_PUBLIC_API_DOCS_URL ||
  (process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "/api/docs")
    : "https://doctor-tracker-server-pearl.vercel.app/api/docs");
