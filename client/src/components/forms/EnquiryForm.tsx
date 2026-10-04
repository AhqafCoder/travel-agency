"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface EnquiryFormProps {
  /** "dark" renders for the dark footer panel, "light" for light pages. */
  variant?: "dark" | "light";
  /** Hide the notes field for ultra-compact placements. */
  showNotes?: boolean;
  className?: string;
}

const inputBase =
  "w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/40 disabled:opacity-60";

export function EnquiryForm({
  variant = "light",
  showNotes = true,
  className,
}: EnquiryFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const inputClass =
    variant === "dark"
      ? cn(inputBase, "bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:border-primary/60")
      : cn(inputBase, "bg-background border border-border text-foreground placeholder:text-muted-foreground/60 focus:border-primary");

  const labelClass =
    variant === "dark"
      ? "block text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 mb-1.5"
      : "block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5";

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    try {
      await api.leads.submit({
        name: String(form.get("name") ?? "").trim(),
        phone: String(form.get("phone") ?? "").trim(),
        email: String(form.get("email") ?? "").trim(),
        destination: String(form.get("destination") ?? "").trim(),
        date: String(form.get("date") ?? ""),
        noOfPeople: Number(form.get("noOfPeople") ?? 1),
        notes: String(form.get("notes") ?? "").trim() || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-xl px-6 py-10 text-center",
          variant === "dark" ? "bg-primary/10 border border-primary/25" : "bg-primary/5 border border-primary/20",
          className
        )}
      >
        <CheckCircle2 className="w-10 h-10 text-primary" />
        <h4 className="font-display text-lg font-bold text-foreground">
          Enquiry received!
        </h4>
        <p className="text-sm text-muted-foreground max-w-xs">
          Our travel experts will reach out to you within 24 hours with a
          customised plan.
        </p>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-2 text-sm font-semibold text-primary hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-4", className)}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="enq-name" className={labelClass}>
            Full Name
          </label>
          <input
            id="enq-name"
            name="name"
            required
            minLength={2}
            placeholder="Your name"
            autoComplete="name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="enq-phone" className={labelClass}>
            Phone
          </label>
          <input
            id="enq-phone"
            name="phone"
            type="tel"
            required
            placeholder="+91 98765 43210"
            autoComplete="tel"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="enq-email" className={labelClass}>
            Email
          </label>
          <input
            id="enq-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="enq-destination" className={labelClass}>
            Destination
          </label>
          <input
            id="enq-destination"
            name="destination"
            required
            placeholder="e.g. Ladakh, Kerala, Goa"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="enq-date" className={labelClass}>
            Travel Date
          </label>
          <input
            id="enq-date"
            name="date"
            type="date"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="enq-people" className={labelClass}>
            Travellers
          </label>
          <input
            id="enq-people"
            name="noOfPeople"
            type="number"
            required
            min={1}
            max={100}
            defaultValue={2}
            className={inputClass}
          />
        </div>
      </div>

      {showNotes && (
        <div>
          <label htmlFor="enq-notes" className={labelClass}>
            Anything else? <span className="font-normal normal-case">(optional)</span>
          </label>
          <textarea
            id="enq-notes"
            name="notes"
            rows={2}
            placeholder="Tell us about your ideal trip — budget, vibe, must-dos…"
            className={cn(inputClass, "resize-none")}
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60 sm:w-auto"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Enquiry
          </>
        )}
      </button>
    </form>
  );
}
