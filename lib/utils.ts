import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ExpiryStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function getStatusColor(status: ExpiryStatus): string {
  switch (status) {
    case "fresh": return "text-green-600 bg-green-50 border-green-200";
    case "soon": return "text-amber-600 bg-amber-50 border-amber-200";
    case "urgent": return "text-rose-600 bg-rose-50 border-rose-200";
    case "expired": return "text-stone-500 bg-stone-100 border-stone-200";
  }
}

export function getStatusDot(status: ExpiryStatus): string {
  switch (status) {
    case "fresh": return "bg-green-500";
    case "soon": return "bg-amber-500";
    case "urgent": return "bg-rose-500";
    case "expired": return "bg-stone-400";
  }
}

export function getStatusLabel(status: ExpiryStatus): string {
  switch (status) {
    case "fresh": return "Fresh";
    case "soon": return "Use Soon";
    case "urgent": return "Urgent";
    case "expired": return "Expired";
  }
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
