"use client";

import { cn } from "@/lib/utils";

type StatusVariant =
  | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "REFUNDED"
  | "DRAFT" | "PUBLISHED" | "ARCHIVED"
  | "ACTIVE" | "INACTIVE" | "CLOSED"
  | "APPROVED" | "REJECTED"
  | "PAID" | "FAILED";

const statusMap: Record<StatusVariant, { label: string; className: string }> = {
  // Booking
  PENDING:   { label: "Pending",   className: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20" },
  CONFIRMED: { label: "Confirmed", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  CANCELLED: { label: "Cancelled", className: "bg-red-500/15 text-red-400 border-red-500/20" },
  COMPLETED: { label: "Completed", className: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  REFUNDED:  { label: "Refunded",  className: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
  // Trip
  DRAFT:     { label: "Draft",     className: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  PUBLISHED: { label: "Published", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  ARCHIVED:  { label: "Archived",  className: "bg-slate-500/15 text-slate-500 border-slate-500/20" },
  // Departure
  ACTIVE:    { label: "Active",    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  INACTIVE:  { label: "Inactive",  className: "bg-slate-500/15 text-slate-400 border-slate-500/20" },
  CLOSED:    { label: "Closed",    className: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
  // Review
  APPROVED:  { label: "Approved",  className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  REJECTED:  { label: "Rejected",  className: "bg-red-500/15 text-red-400 border-red-500/20" },
  // Payment
  PAID:      { label: "Paid",      className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  FAILED:    { label: "Failed",    className: "bg-red-500/15 text-red-400 border-red-500/20" },
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusMap[status as StatusVariant] ?? {
    label: status,
    className: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
