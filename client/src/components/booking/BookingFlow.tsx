"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  CreditCard,
  ListChecks,
  Shield,
  ArrowLeft,
  ArrowRight,
  Tag,
  Users,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DateSelector } from "@/components/booking/DateSelector";
import { PriceBreakdown } from "@/components/booking/PriceBreakdown";
import {
  formatPrice,
  getTripDepartures,
  MOCK_COUPONS,
} from "@/lib/mock-data";
import type {
  Trip,
  TripDeparture,
  BookingTraveller,
  Coupon,
} from "@/types";

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface BookingFlowProps {
  trip: Trip;
  presetDepartureId?: string;
  presetCount?: number;
}

/* ------------------------------------------------------------------ */
/*  Step indicator                                                     */
/* ------------------------------------------------------------------ */

const STEPS = [
  { label: "Select Departure", icon: Calendar },
  { label: "Traveller Details", icon: Users },
  { label: "Review & Pay", icon: CreditCard },
];

function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-1 w-full mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center flex-1">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-colors ${
              i < current
                ? "bg-teal text-white"
                : i === current
                  ? "bg-brand text-white"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {i < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </div>
          {i < total - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 transition-colors ${
                i < current ? "bg-teal" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Traveller form helpers                                             */
/* ------------------------------------------------------------------ */

function emptyTraveller(): Omit<BookingTraveller, "_id" | "bookingId"> {
  return {
    fullName: "",
    age: 18,
    gender: "Male",
    phone: "",
    email: "",
    emergencyContact: "",
    emergencyPhone: "",
  };
}

function TravellerForm({
  index,
  traveller,
  onChange,
}: {
  index: number;
  traveller: Omit<BookingTraveller, "_id" | "bookingId">;
  onChange: (
    value: Omit<BookingTraveller, "_id" | "bookingId">
  ) => void;
}) {
  const update = (field: string, value: string | number) =>
    onChange({ ...traveller, [field]: value });

  return (
    <div className="rounded-xl border border-border/30 bg-card p-5 space-y-4">
      <h4 className="font-semibold text-foreground text-sm">
        Traveller {index + 1}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Full Name *</Label>
          <Input
            placeholder="As per ID proof"
            value={traveller.fullName}
            onChange={(e) => update("fullName", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Age *</Label>
          <Input
            type="number"
            min={1}
            max={99}
            value={traveller.age}
            onChange={(e) => update("age", Number(e.target.value) || 1)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Gender *</Label>
          <select
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm"
            value={traveller.gender}
            onChange={(e) => update("gender", e.target.value)}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Phone *</Label>
          <Input
            placeholder="+91 98765 43210"
            value={traveller.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Email *</Label>
          <Input
            type="email"
            placeholder="you@email.com"
            value={traveller.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Emergency Contact Name *</Label>
          <Input
            placeholder="Full name"
            value={traveller.emergencyContact}
            onChange={(e) => update("emergencyContact", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Emergency Contact Phone *</Label>
          <Input
            placeholder="+91 98765 00001"
            value={traveller.emergencyPhone}
            onChange={(e) => update("emergencyPhone", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function BookingFlow({
  trip,
  presetDepartureId,
  presetCount,
}: BookingFlowProps) {
  const departures = getTripDepartures(trip._id).filter(
    (d) => d.status === "ACTIVE" && d.availableSeats > 0
  );

  const [step, setStep] = useState(1);
  const [selectedDeparture, setSelectedDeparture] =
    useState<TripDeparture | null>(
      departures.find((d) => d._id === presetDepartureId) || departures[0] || null
    );
  const [travellersCount, setTravellersCount] = useState(presetCount || 1);
  const [travellers, setTravellers] = useState<
    Omit<BookingTraveller, "_id" | "bookingId">[]
  >(Array.from({ length: presetCount || 1 }, emptyTraveller));
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);

  /* Derived price values */
  const pricePerPerson =
    selectedDeparture?.price || trip.discountedPrice || trip.basePrice;
  const subtotal = pricePerPerson * travellersCount;

  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "FIXED") return Math.min(appliedCoupon.value, subtotal);
    const pct = (appliedCoupon.value / 100) * subtotal;
    return Math.min(pct, appliedCoupon.maximumDiscount ?? pct);
  }, [appliedCoupon, subtotal]);

  const tax = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + tax;

  /* Coupon application */
  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    const coupon = MOCK_COUPONS.find(
      (c) => c.code === code && c.active && subtotal >= c.minimumAmount
    );
    if (!coupon) {
      setCouponError("Invalid coupon or minimum amount not met.");
      setAppliedCoupon(null);
      return;
    }
    setCouponError("");
    setAppliedCoupon(coupon);
  };

  /* Traveller list sync with count */
  const updateTravellersCount = (newCount: number) => {
    setTravellersCount(newCount);
    setTravellers((prev) => {
      if (newCount > prev.length) {
        return [...prev, ...Array.from({ length: newCount - prev.length }, emptyTraveller)];
      }
      return prev.slice(0, newCount);
    });
  };

  const updateTraveller = (
    idx: number,
    value: Omit<BookingTraveller, "_id" | "bookingId">
  ) => {
    setTravellers((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  /* Validate step */
  const validateStep1 = () => !!selectedDeparture && travellersCount >= 1;
  const validateStep2 = () =>
    travellers.every(
      (t) =>
        t.fullName.trim().length >= 2 &&
        t.age >= 1 &&
        t.phone.trim().length >= 6 &&
        t.email.includes("@") &&
        t.emergencyContact.trim().length >= 2 &&
        t.emergencyPhone.trim().length >= 6
    );

  /* Confirmation */
  const confirmBooking = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setBookingConfirmed(true);
    }, 2000);
  };

  /* ── Confirmation screen ──────────────────────────── */

  if (bookingConfirmed) {
    const bookingNumber = `EMT${10000 + Math.floor(Math.random() * 1000)}`;
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="flex-1 flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-teal-muted flex items-center justify-center mx-auto">
              <PartyPopper className="w-10 h-10 text-teal" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground">
              Your adventure is booked. We&apos;ve sent a confirmation email
              with all the details.
            </p>
            <div className="bg-muted/40 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Booking ID</span>
                <span className="font-mono font-semibold text-foreground">
                  {bookingNumber}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Trip</span>
                <span className="font-medium text-foreground text-right">
                  {trip.title}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Travellers</span>
                <span className="text-foreground">{travellersCount}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Paid</span>
                <span className="text-teal">{formatPrice(total)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild size="lg">
                <Link href="/profile">View my bookings</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/trips">Browse more trips</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main booking UI ──────────────────────────────── */

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Back + header */}
      <div className="bg-muted/30 border-b border-border/20 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/trips/${trip.slug}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to trip
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Book your trip</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column – steps */}
          <div className="lg:col-span-2 space-y-6">
            <StepIndicator current={step} total={STEPS.length} />

            {/* ── Step 1: Departure ────────────────── */}
            {step === 1 && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    Choose your departure
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Select a date and how many people are joining.
                  </p>
                </div>

                {departures.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-10 text-center">
                    <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No upcoming departures for this trip. Check back soon!
                    </p>
                  </div>
                ) : (
                  <>
                    <DateSelector
                      departures={departures}
                      selected={selectedDeparture}
                      onSelect={setSelectedDeparture}
                    />

                    {/* Traveller count */}
                    <div className="rounded-xl border border-border/30 bg-card p-5">
                      <Label className="text-sm font-medium mb-2 block">
                        Number of travellers
                      </Label>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-9 h-9 p-0"
                          disabled={travellersCount <= 1}
                          onClick={() =>
                            updateTravellersCount(
                              Math.max(1, travellersCount - 1)
                            )
                          }
                        >
                          −
                        </Button>
                        <span className="text-lg font-semibold w-8 text-center text-foreground">
                          {travellersCount}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-9 h-9 p-0"
                          disabled={
                            travellersCount >=
                            (selectedDeparture?.availableSeats || trip.maxGroupSize)
                          }
                          onClick={() =>
                            updateTravellersCount(
                              Math.min(
                                travellersCount + 1,
                                selectedDeparture?.availableSeats ||
                                  trip.maxGroupSize
                              )
                            )
                          }
                        >
                          +
                        </Button>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({selectedDeparture?.availableSeats || 0} seats
                          available)
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </section>
            )}

            {/* ── Step 2: Traveller details ────────── */}
            {step === 2 && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    Traveller details
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Fill in details for all {travellersCount} traveller
                    {travellersCount !== 1 ? "s" : ""}.
                  </p>
                </div>
                <div className="space-y-4">
                  {travellers.map((traveller, idx) => (
                    <TravellerForm
                      key={idx}
                      index={idx}
                      traveller={traveller}
                      onChange={(val) => updateTraveller(idx, val)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ── Step 3: Review + Pay ─────────────── */}
            {step === 3 && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    Review & complete payment
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Verify your booking details and pay to confirm.
                  </p>
                </div>

                {/* Traveller summary */}
                <div className="rounded-xl border border-border/30 bg-card p-5">
                  <h3 className="font-semibold text-foreground mb-3">
                    Travellers
                  </h3>
                  <div className="space-y-2">
                    {travellers.map((t, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-foreground">
                          {i + 1}. {t.fullName}
                        </span>
                        <span className="text-muted-foreground">
                          {t.age} yrs · {t.gender}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Coupon */}
                <div className="rounded-xl border border-border/30 bg-card p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground text-sm">
                      Have a coupon?
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      disabled={!!appliedCoupon}
                      className="flex-1"
                    />
                    {appliedCoupon ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setAppliedCoupon(null);
                          setCouponCode("");
                        }}
                        size="sm"
                      >
                        Remove
                      </Button>
                    ) : (
                      <Button onClick={applyCoupon} size="sm">
                        Apply
                      </Button>
                    )}
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-600 mt-2">{couponError}</p>
                  )}
                  {appliedCoupon && (
                    <p className="text-xs text-teal mt-2 font-medium">
                      ✓ {appliedCoupon.code} applied —
                      {appliedCoupon.type === "FIXED"
                        ? ` ₹${appliedCoupon.value} off`
                        : ` ${appliedCoupon.value}% off (max ₹${appliedCoupon.maximumDiscount})`}
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Try: WELCOME500 · ADVENTURE10 · MONSOON2026
                  </p>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3 rounded-xl border border-border/30 bg-card p-5">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 accent-brand"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <span className="font-medium text-foreground cursor-pointer">
                      Terms &amp; Conditions
                    </span>{" "}
                    and{" "}
                    <span className="font-medium text-foreground cursor-pointer">
                      Cancellation Policy
                    </span>
                    . I understand that free cancellation is available up to 7
                    days before departure.
                  </label>
                </div>

                {/* Payment placeholder */}
                <div className="rounded-xl border border-dashed border-border/50 bg-muted/30 p-8 text-center">
                  <CreditCard className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Razorpay payment integration will be enabled once the backend
                    is live.
                  </p>
                  <Button
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={
                      !agreedToTerms || confirming || total <= 0
                    }
                    onClick={confirmBooking}
                  >
                    {confirming
                      ? "Confirming booking…"
                      : `Pay ${formatPrice(total)}`}
                  </Button>
                </div>
              </section>
            )}

            {/* Navigation buttons */}
            {step < 3 && (
              <div className="flex justify-between pt-4">
                <Button
                  variant="ghost"
                  disabled={step === 1}
                  onClick={() => setStep((s) => s - 1)}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  disabled={
                    (step === 1 && !validateStep1()) ||
                    (step === 2 && !validateStep2())
                  }
                  onClick={() => setStep((s) => s + 1)}
                >
                  Continue <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>

          {/* Right column – Booking Summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              {selectedDeparture && (
                <div className="bg-background border border-border/20 rounded-2xl shadow-lg p-6 space-y-5">
                  <h3 className="font-semibold text-foreground">
                    Booking Summary
                  </h3>

                  {/* Trip mini card */}
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={trip.coverImage}
                        alt={trip.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground text-sm leading-tight truncate">
                        {trip.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {trip.durationDays}D / {trip.durationNights}N
                      </p>
                    </div>
                  </div>

                  <Separator />

                  {/* Departure info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(selectedDeparture.startDate).toLocaleDateString(
                          "en-IN",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          }
                        )}{" "}
                        →{" "}
                        {new Date(selectedDeparture.endDate).toLocaleDateString(
                          "en-IN",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{selectedDeparture.meetingPoint}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{selectedDeparture.meetingTime}</span>
                    </div>
                  </div>

                  <Separator />

                  <PriceBreakdown
                    pricePerPerson={pricePerPerson}
                    travellersCount={travellersCount}
                    discount={discount}
                    couponCode={appliedCoupon?.code}
                    tax={tax}
                    total={total}
                  />

                  {/* Low seats */}
                  {selectedDeparture.availableSeats <= 5 &&
                    selectedDeparture.availableSeats > 0 && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Only{" "}
                        <strong>
                          {selectedDeparture.availableSeats} seats
                        </strong>{" "}
                        left!
                      </div>
                    )}

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                    <Shield className="w-3.5 h-3.5 text-teal" />
                    Free cancellation up to 7 days before departure
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}