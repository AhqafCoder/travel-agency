"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface FormPageProps {
  title: string;
  description?: string;
  backHref: string;
  children: React.ReactNode;
  /** Right side of the header — e.g. Save button. */
  actions?: React.ReactNode;
}

/**
 * Shared shell for admin create/edit pages: back link, title, and a dark card
 * that hosts the form. Content pages plug their form in as children.
 */
export function FormPage({
  title,
  description,
  backHref,
  children,
  actions,
}: FormPageProps) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
          <h2 className="mt-1.5 font-display text-xl font-bold text-foreground">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)] md:p-7">
        {children}
      </div>
    </div>
  );
}

/** Consistent label + control wrapper used inside admin forms. */
export function FormField({
  label,
  required,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {required && <span className="ml-0.5 text-orange-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-[11px] text-muted-foreground/80">{hint}</p>
      ) : null}
    </div>
  );
}

/** Shared dark input styling for admin forms. */
export const adminInputClass =
  "w-full rounded-lg border border-border bg-muted/50 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/80 outline-none transition-colors focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 disabled:opacity-50";
