"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthContext";
import type { Booking } from "@/types";

/**
 * Post-trip review dialog. Only travellers with a COMPLETED booking can
 * reach this — the server enforces it, this UI just collects
 * name, photos, rating and text.
 */
export function ReviewDialog({
  booking,
  open,
  onClose,
  onSubmitted,
}: {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  // Prefill (and refresh) the traveller name each time the dialog opens.
  useEffect(() => {
    if (open) setName(user?.name ?? "");
  }, [open, user]);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  if (!open || !booking) return null;

  const trip = booking.trip;
  const tripId = typeof trip === "object" ? trip._id : booking.tripId;

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files).slice(0, 5 - images.length)) {
        const { url } = await api.media.upload(file, "reviews");
        uploaded.push(url);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Photo upload failed. Try again.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const submit = async () => {
    if (rating < 1) return setError("Please pick a star rating.");
    if (content.trim().length < 10) return setError("Tell us a little more (at least 10 characters).");
    setSubmitting(true);
    setError("");
    try {
      // Keep the account name in sync if the traveller edited it.
      if (name.trim() && user && name.trim() !== user.name) {
        await api.updateMe({ name: name.trim() });
      }
      await api.reviews.create(tripId, {
        rating,
        title: title.trim() || undefined,
        content: content.trim(),
        images,
        bookingId: booking._id,
      });
      onSubmitted?.();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit your review. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Review your trip"
    >
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl bg-card border border-border shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close review dialog"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            {trip?.coverImage && (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                <Image src={trip.coverImage} alt={trip.title ?? "Trip"} fill sizes="64px" className="object-cover" />
              </div>
            )}
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">How was your trip?</p>
              <h2 className="text-lg font-bold text-foreground leading-tight">
                {trip?.title ?? "Your recent trip"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Booking {booking.bookingNumber} · verified traveller review
              </p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="review-name" className="text-sm font-medium text-foreground">Your name</label>
            <Input
              id="review-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="mt-1.5"
            />
          </div>

          {/* Rating */}
          <div>
            <span className="text-sm font-medium text-foreground">Your rating</span>
            <div className="flex items-center gap-1.5 mt-1.5" role="radiogroup" aria-label="Star rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(n)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      n <= (hovered || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Headline */}
          <div>
            <label htmlFor="review-title" className="text-sm font-medium text-foreground">
              Headline <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sum up your trip in a line"
              maxLength={80}
              className="mt-1.5"
            />
          </div>

          {/* Photos */}
          <div>
            <span className="text-sm font-medium text-foreground">
              Photos <span className="text-muted-foreground font-normal">(up to 5, optional)</span>
            </span>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {images.map((url) => (
                <div key={url} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="Review upload" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={() => setImages((prev) => prev.filter((u) => u !== url))}
                    className="absolute top-0.5 right-0.5 grid h-5 w-5 place-items-center rounded-full bg-black/60 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="w-16 h-16 rounded-lg border border-dashed border-border grid place-items-center text-muted-foreground text-xs hover:border-foreground/30 hover:text-foreground transition disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "+ Add"}
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => uploadImages(e.target.files)}
              />
            </div>
          </div>

          {/* Review text */}
          <div>
            <label htmlFor="review-content" className="text-sm font-medium text-foreground">Your review</label>
            <textarea
              id="review-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What were the highlights? How was the captain, the group, the stays?"
              className="mt-1.5 w-full resize-none rounded-lg border border-border bg-muted/40 px-3.5 py-2.5 text-sm text-foreground
                placeholder:text-muted-foreground/60 outline-none transition hover:border-foreground/20
                focus:border-foreground/50 focus:bg-muted/60 focus:ring-4 focus:ring-foreground/10"
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-red-600">{error}</p>
          )}

          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-muted-foreground">
              Reviews are verified against your booking and appear after a quick moderation check.
            </p>
            <Button onClick={submit} disabled={submitting || rating < 1}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                </>
              ) : (
                "Submit review"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
