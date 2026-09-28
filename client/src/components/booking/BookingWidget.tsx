"use client";

import { useState } from "react";
import Link from "next/link";
import { Trip, TripDeparture } from "@/types";
import { DateSelector } from "@/components/booking/DateSelector";
import { TravellerSelector } from "@/components/booking/TravellerSelector";
import { PriceBreakdown } from "@/components/booking/PriceBreakdown";
import { formatPrice, getTripDepartures } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Clock, Users, Shield, AlertCircle, ArrowRight } from "lucide-react";

interface BookingWidgetProps {
  trip: Trip;
}

export function BookingWidget({ trip }: BookingWidgetProps) {
  const departures = getTripDepartures(trip._id).filter(
    (d) => d.status === "ACTIVE" && d.availableSeats > 0
  );
  const [selectedDeparture, setSelectedDeparture] =
    useState<TripDeparture | null>(departures[0] || null);
  const [travellersCount, setTravellersCount] = useState(1);

  const pricePerPerson =
    selectedDeparture?.price || trip.discountedPrice || trip.basePrice;
  const subtotal = pricePerPerson * travellersCount;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const hasDiscount =
    trip.discountedPrice && trip.discountedPrice < trip.basePrice;
  const discountPct = hasDiscount
    ? Math.round(
        ((trip.basePrice - (trip.discountedPrice ?? 0)) / trip.basePrice) * 100
      )
    : 0;

  return (
    <div
      className={cn(
        "sticky top-20 rounded-2xl overflow-hidden",
        "border border-white/8 bg-card",
        "shadow-[0_4px_32px_oklch(0_0_0/50%)]"
      )}
    >
      {/* Price Header */}
      <div className="p-5 border-b border-white/6">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-bold text-foreground">
            {formatPrice(pricePerPerson)}
          </span>
          <span className="text-sm text-muted-foreground">/ person</span>
        </div>
        {hasDiscount && (
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(trip.basePrice)}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/25 text-emerald-400">
              {discountPct}% OFF
            </span>
          </div>
        )}
        {/* Quick trip meta */}
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            {trip.durationDays}D / {trip.durationNights}N
          </span>
          <span className="w-px h-3 bg-white/10" />
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-primary" />
            Max {trip.maxGroupSize}
          </span>
        </div>
      </div>

      {/* Selectors */}
      <div className="p-5 space-y-0 border-b border-white/6">
        <DateSelector
          departures={departures}
          selected={selectedDeparture}
          onSelect={setSelectedDeparture}
        />
        <TravellerSelector
          count={travellersCount}
          onChange={setTravellersCount}
          max={
            selectedDeparture
              ? selectedDeparture.availableSeats
              : trip.maxGroupSize
          }
          minAge={trip.minAge}
        />
      </div>

      {/* Price breakdown */}
      <div className="p-5 border-b border-white/6">
        <PriceBreakdown
          pricePerPerson={pricePerPerson}
          travellersCount={travellersCount}
          tax={tax}
          total={total}
        />
      </div>

      {/* CTA */}
      <div className="p-5 space-y-3">
        {selectedDeparture ? (
          <Link
            href={`/booking/${trip._id}?departure=${selectedDeparture._id}&count=${travellersCount}`}
            className={cn(
              "flex items-center justify-center gap-2 w-full py-3.5 rounded-xl",
              "bg-primary text-primary-foreground font-semibold text-sm",
              "shadow-[0_4px_20px_oklch(0.72_0.18_55/35%)] hover:shadow-[0_6px_28px_oklch(0.72_0.18_55/50%)]",
              "hover:bg-primary/90 transition-all duration-200"
            )}
          >
            Book This Trip
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            disabled
            className="flex items-center justify-center w-full py-3.5 rounded-xl bg-white/5 border border-white/8 text-muted-foreground text-sm font-medium cursor-not-allowed"
          >
            No Departures Available
          </button>
        )}

        {/* Trust note */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Free cancellation up to 7 days before departure</span>
        </div>

        {/* Urgency */}
        {selectedDeparture &&
          selectedDeparture.availableSeats <= 5 &&
          selectedDeparture.availableSeats > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                Only{" "}
                <strong>{selectedDeparture.availableSeats} seats</strong> left
                on this departure!
              </span>
            </div>
          )}
      </div>
    </div>
  );
}
