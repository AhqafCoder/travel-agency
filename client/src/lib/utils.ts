import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** ₹ formatting used across booking UIs (moved from mock-data during the backend merge). */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

/** Staff roles that see the admin dashboard. */
export const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "OPERATIONS", "EDITOR"] as const;

export function isAdminRole(role?: string | null): boolean {
  return !!role && (ADMIN_ROLES as readonly string[]).includes(role);
}
