"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthContext";
import { ReviewDialog } from "./ReviewDialog";
import type { Booking } from "@/types";

const shownThisSession = (bookingId: string) => `emt_review_shown_${bookingId}`;
const doneForever = (bookingId: string) => `emt_review_done_${bookingId}`;

/**
 * Global post-trip review prompt.
 *
 * Eligibility is always checked fresh against the server (completed booking
 * without a review), but the dialog itself only pops ONCE per browser
 * session per booking — a couple of seconds after landing, then never again
 * during that session no matter how many pages or refreshes. A brand-new
 * session pops it again until the traveller submits; after submitting it
 * never pops at all. Profile → Past trips always offers "Write review".
 */
export function ReviewPrompt() {
  const { status } = useAuth();
  const queryClient = useQueryClient();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [armed, setArmed] = useState(false);

  const { data: pending = [] } = useQuery({
    queryKey: ["pending-reviews"],
    queryFn: () => api.reviews.pending(),
    enabled: status === "authenticated",
    staleTime: 30_000,
  });

  // Let the page settle before popping anything.
  useEffect(() => {
    if (status !== "authenticated") return;
    const t = window.setTimeout(() => setArmed(true), 2500);
    return () => window.clearTimeout(t);
  }, [status]);

  useEffect(() => {
    if (!armed || booking || pending.length === 0) return;
    const next = pending.find(
      (b) =>
        !localStorage.getItem(doneForever(b._id)) &&
        !sessionStorage.getItem(shownThisSession(b._id))
    );
    if (next) {
      // Mark immediately so refreshes/navigation this session stay quiet.
      sessionStorage.setItem(shownThisSession(next._id), "1");
      setBooking(next);
    }
  }, [armed, booking, pending]);

  const close = () => setBooking(null);

  const submitted = () => {
    if (booking) localStorage.setItem(doneForever(booking._id), "1");
    setBooking(null);
    toast.success("Thanks for sharing! Your review will appear after moderation.");
    queryClient.invalidateQueries({ queryKey: ["pending-reviews"] });
    queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
  };

  return (
    <ReviewDialog
      booking={booking}
      open={!!booking}
      onClose={close}
      onSubmitted={submitted}
    />
  );
}
