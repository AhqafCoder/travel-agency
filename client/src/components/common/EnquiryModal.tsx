"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  Minus,
  Plus,
  CheckCircle2,
  Loader2,
  Route,
  BadgeCheck,
  Headset,
  Award,
} from "lucide-react";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: string;
}

const inputBase =
  "w-full rounded-lg bg-white/[0.04] border border-white/10 py-2.5 pl-10 pr-3 text-sm text-white " +
  "placeholder:text-white/30 outline-none transition " +
  "hover:border-white/20 focus:border-white/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-white/10";

const iconBase =
  "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40";

const labelBase = "mb-1 block text-xs font-medium text-white/70";

export function EnquiryModal({
  isOpen,
  onClose,
  defaultDestination = "",
}: EnquiryModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [destination, setDestination] = useState(defaultDestination);
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(2);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  const firstFieldRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];

  // Reset form + play enter animation each time the modal opens
  useEffect(() => {
    if (!isOpen) {
      setShow(false);
      return;
    }
    setName("");
    setPhone("");
    setEmail("");
    setDestination(defaultDestination);
    setDate("");
    setPeople(2);
    setNotes("");
    setLoading(false);
    setSubmitted(false);
    setError("");

    const raf = requestAnimationFrame(() => {
      setShow(true);
      firstFieldRef.current?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, [isOpen, defaultDestination]);

  // Escape to close + lock page scroll
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim() || !email.trim() || !destination.trim() || !date) {
      setError("Please fill in all the required fields.");
      return;
    }
    try {
      setLoading(true);
      await api.leads.submit({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        destination: destination.trim(),
        date,
        noOfPeople: Number(people),
        notes,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "We couldn't send your enquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 motion-reduce:transition-none
        bg-black/20 backdrop-blur-sm ${show ? "opacity-100" : "opacity-0"}`}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-title"
    >
      <div
        className={`relative grid w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#111] text-white
          border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] md:grid-cols-[15rem_1fr]
          transition-all duration-300 ease-out motion-reduce:transition-none
          ${show ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-[0.97] opacity-0"}`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close enquiry form"
          className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full text-white/50 transition
            hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ---------- Left info panel ---------- */}
        <aside className="flex flex-col justify-between gap-6 border-b border-white/10 bg-white/[0.03] p-6 md:border-b-0 md:border-r">
          <div>
            <h2 id="enquiry-title" className="text-xl font-semibold leading-tight tracking-tight">
              Plan your trip with us
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              Tell us where and when. We'll send back a plan built around you.
            </p>
          </div>

          <div className="hidden md:block">
            <p className="mb-3 text-xs font-medium text-white/45">Why choose us</p>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-3">
                <Route className="h-4 w-4 shrink-0 text-white/50" />
                Custom itinerary
              </li>
              <li className="flex items-center gap-3">
                <BadgeCheck className="h-4 w-4 shrink-0 text-white/50" />
                Government approved
              </li>
              <li className="flex items-center gap-3">
                <Headset className="h-4 w-4 shrink-0 text-white/50" />
                24/7 concierge
              </li>
              <li className="flex items-center gap-3">
                <Award className="h-4 w-4 shrink-0 text-white/50" />
                Trusted since 2016
              </li>
            </ul>
          </div>
        </aside>

        {/* ---------- Right side ---------- */}
        {submitted ? (
          <div className="flex min-h-[20rem] flex-col items-center justify-center px-8 py-10 text-center">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/15">
              <CheckCircle2 className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight">Enquiry sent</h3>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/60">
              Thanks, {name.split(" ")[0]}. Our team will contact you about {destination} shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-lg bg-white px-7 py-2.5 text-sm font-semibold text-black transition
                hover:bg-white/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div
                role="alert"
                className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-300"
              >
                {error}
              </div>
            )}

            <div className="grid gap-x-3 gap-y-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="enq-name" className={labelBase}>Full name</label>
                <div className="relative">
                  <User className={iconBase} />
                  <input
                    ref={firstFieldRef}
                    id="enq-name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="enq-phone" className={labelBase}>Phone</label>
                <div className="relative">
                  <Phone className={iconBase} />
                  <input
                    id="enq-phone"
                    type="tel"
                    inputMode="tel"
                    required
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="enq-email" className={labelBase}>Email</label>
                <div className="relative">
                  <Mail className={iconBase} />
                  <input
                    id="enq-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="enq-dest" className={labelBase}>Destination</label>
                <div className="relative">
                  <MapPin className={iconBase} />
                  <input
                    id="enq-dest"
                    type="text"
                    required
                    placeholder="Meghalaya, Manali..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="enq-date" className={labelBase}>Travel date</label>
                <div className="relative">
                  <CalendarDays className={iconBase} />
                  <input
                    id="enq-date"
                    type="date"
                    required
                    min={today}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`${inputBase} [color-scheme:dark]`}
                  />
                </div>
              </div>

              <div>
                <span className={labelBase}>Travellers</span>
                <div className="flex h-[42px] items-center justify-between rounded-lg border border-white/10 bg-white/[0.04] px-1">
                  <button
                    type="button"
                    aria-label="Decrease travellers"
                    onClick={() => setPeople((p) => Math.max(1, p - 1))}
                    disabled={people <= 1}
                    className="grid h-8 w-8 place-items-center rounded-md text-white/70 transition hover:bg-white/10 hover:text-white
                      disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-[2ch] text-center text-sm font-medium tabular-nums" aria-live="polite">
                    {people}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase travellers"
                    onClick={() => setPeople((p) => Math.min(50, p + 1))}
                    className="grid h-8 w-8 place-items-center rounded-md text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="enq-notes" className={labelBase}>
                  Special requests <span className="font-normal text-white/40">(optional)</span>
                </label>
                <textarea
                  id="enq-notes"
                  rows={2}
                  placeholder="Budget, hotel preferences, activities..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white
                    placeholder:text-white/30 outline-none transition hover:border-white/20
                    focus:border-white/50 focus:bg-white/[0.06] focus:ring-4 focus:ring-white/10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-semibold text-black
                transition hover:bg-white/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70
                focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send enquiry"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}