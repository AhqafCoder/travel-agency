"use client";

import { useState } from "react";
import Link from "next/link";
import { Trip, TripDeparture } from "@/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DateSelector } from "@/components/booking/DateSelector";
import { TravellerSelector } from "@/components/booking/TravellerSelector";
import { PriceBreakdown } from "@/components/booking/PriceBreakdown";
import { formatPrice, getTripDepartures } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Calendar, Users, Shield, Clock, AlertCircle } from "lucide-react";

interface BookingWidgetProps {
  trip: Trip;
}

export function BookingWidget({ trip }: BookingWidgetProps) {
  const departures = getTripDepartures(trip._id).filter(d => d.status === "ACTIVE" && d.availableSeats > 0);
  const [selectedDeparture, setSelectedDeparture] = useState<TripDeparture | null>(departures[0] || null);
  const [travellersCount, setTravellersCount] = useState(1);

  const pricePerPerson = selectedDeparture?.price || trip.discountedPrice || trip.basePrice;
  const subtotal = pricePerPerson * travellersCount;
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const total = subtotal + tax;

  return (
    <div className="bg-background border border-border/20 rounded-2xl shadow-lg p-6 sticky top-24">
      {/* Price Header */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-foreground">{formatPrice(pricePerPerson)}</span>
          <span className="text-sm text-muted-foreground">/ person</span>
        </div>
        {trip.discountedPrice && trip.discountedPrice < trip.basePrice && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground line-through">{formatPrice(trip.basePrice)}</span>
            <span className="text-xs font-semibold text-teal bg-teal-muted px-2 py-0.5 rounded-full">
              {Math.round(((trip.basePrice - trip.discountedPrice) / trip.basePrice) * 100)}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Trip Quick Info */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {trip.durationDays}D / {trip.durationNights}N
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          Max {trip.maxGroupSize}
        </span>
      </div>

      <Separator className="mb-6" />

      {/* Date Selector */}
      <DateSelector
        departures={departures}
        selected={selectedDeparture}
        onSelect={setSelectedDeparture}
      />

      {/* Traveller Selector */}
      <TravellerSelector
        count={travellersCount}
        onChange={setTravellersCount}
        max={selectedDeparture ? selectedDeparture.availableSeats : trip.maxGroupSize}
        minAge={trip.minAge}
      />

      <Separator className="my-6" />

      {/* Price Breakdown */}
      <PriceBreakdown
        pricePerPerson={pricePerPerson}
        travellersCount={travellersCount}
        tax={tax}
        total={total}
      />

      {/* CTA */}
      <Button
        className="w-full py-3 text-lg font-semibold mt-6"
        size="lg"
        disabled={!selectedDeparture || selectedDeparture.availableSeats === 0}
        asChild
      >
        <Link href={`/booking/${trip._id}${selectedDeparture ? `?departure=${selectedDeparture._id}&count=${travellersCount}` : ""}`}>
          {selectedDeparture?.availableSeats === 0 ? "Sold Out" : "Book Now"}
        </Link>
      </Button>

      {/* Safety Badge */}
      <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
        <Shield className="w-3.5 h-3.5 text-teal" />
        <span>Free cancellation up to 7 days before departure</span>
      </div>

      {/* Urgency */}
      {selectedDeparture && selectedDeparture.availableSeats <= 5 && selectedDeparture.availableSeats > 0 && (
        <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Only <strong>{selectedDeparture.availableSeats} seats</strong> left on this departure!</span>
        </div>
      )}
    </div>
  );
}
