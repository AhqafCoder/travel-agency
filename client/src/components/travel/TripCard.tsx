import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Star } from "lucide-react";
import { Trip } from "@/types";
import { cn } from "@/lib/utils";

interface TripCardProps {
  trip: Trip;
  featured?: boolean;
}

export function TripCard({ trip }: TripCardProps) {
  const price = trip.discountedPrice ?? trip.basePrice;
  const hasDiscount =
    trip.discountedPrice && trip.discountedPrice < trip.basePrice;

  return (
    <Link
      href={`/trips/${trip.slug}`}
      className="group flex flex-col overflow-hidden transition-all duration-300 card-shadow card-shadow-hover"
      style={{
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.07)",
        background: "#1a1a1a",
        textDecoration: "none",
      }}
    >
      {/* Cover image — fixed 16:10 ratio */}
      <div className="relative shrink-0 overflow-hidden" style={{ aspectRatio: "16/10" }}>
        <Image
          src={trip.coverImage}
          alt={trip.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading={trip.featured ? "eager" : "lazy"}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />

        {/* Featured / Trending badge */}
        {(trip.featured || trip.trending) && (
          <div className="absolute top-2.5 left-2.5">
            <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", borderRadius: 9999, padding: "3px 9px", border: "1px solid rgba(255,255,255,0.15)" }}>
              {trip.featured ? "Featured" : "Trending"}
            </span>
          </div>
        )}

        {/* Rating */}
        {trip.rating && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", borderRadius: 9999, padding: "3px 9px", border: "1px solid rgba(255,255,255,0.12)" }}>
            <Star style={{ width: 11, height: 11, fill: "#fff", color: "#fff" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{trip.rating}</span>
            {trip.reviewCount ? (
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>({trip.reviewCount})</span>
            ) : null}
          </div>
        )}

        {/* Discount */}
        {hasDiscount && (
          <div className="absolute top-2.5 right-2.5">
            <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", borderRadius: 9999, padding: "3px 9px", border: "1px solid rgba(255,255,255,0.15)" }}>
              {Math.round(((trip.basePrice - (trip.discountedPrice ?? 0)) / trip.basePrice) * 100)}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1" style={{ padding: "14px 16px 16px" }}>
        {/* Location */}
        <div className="flex items-center gap-1 mb-1.5">
          <MapPin style={{ width: 11, height: 11, color: "#777", flexShrink: 0 }} />
          <span className="truncate" style={{ fontSize: 11, color: "#777" }}>
            {trip.destination?.name ?? "India"}{trip.destination?.state ? `, ${trip.destination.state}` : ""}
          </span>
        </div>

        {/* Title */}
        <h3
          className="line-clamp-2"
          style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 6px", lineHeight: 1.3 }}
        >
          {trip.title}
        </h3>

        {/* Description */}
        <p className="line-clamp-2 flex-1" style={{ fontSize: 12, color: "#777", lineHeight: 1.55, margin: 0 }}>
          {trip.shortDescription}
        </p>

        {/* Tags row */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.50)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9999, padding: "2px 8px" }}>
            {trip.difficulty}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.50)", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9999, padding: "2px 8px" }}>
            {trip.tripType}
          </span>
          <span className="flex items-center gap-1" style={{ fontSize: 11, color: "#666" }}>
            <Clock style={{ width: 11, height: 11 }} />
            {trip.durationDays}D/{trip.durationNights}N
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <p style={{ fontSize: 10, color: "#666", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>From</p>
            <div className="flex items-baseline gap-1">
              <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>
                ₹{price.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <span style={{ fontSize: 11, color: "#555", textDecoration: "line-through" }}>
                  ₹{trip.basePrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <p style={{ fontSize: 10, color: "#666", margin: 0 }}>per person</p>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", opacity: 0.6 }}>
            View Trip →
          </span>
        </div>
      </div>
    </Link>
  );
}
