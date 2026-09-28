import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { TripCard } from "@/components/travel/TripCard";
import { MOCK_TRIPS, getFeaturedTrips } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All Trips | EditMyTrips",
  description:
    "Browse all handcrafted trips and adventures across India. Filter by type, difficulty, and destination.",
};

export default function TripsPage() {
  const allTrips = MOCK_TRIPS.filter((t) => t.status === "PUBLISHED");
  const featured = getFeaturedTrips();
  const trending = allTrips.filter((t) => t.trending && !t.featured);

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ── Dark Cinematic Header ─────────────────────────────── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0/1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0/1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Amber glow top-right */}
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-primary uppercase tracking-[0.2em] font-medium mb-4">
            {allTrips.length} trips available
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
            Every Trip,{" "}
            <span className="brand-gradient-text">Handcrafted.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-sm sm:text-base leading-relaxed mb-8">
            From Himalayan treks to coastal escapes — discover adventures built
            around your kind of travel.
          </p>

          {/* Quick filter pills */}
          <div className="flex flex-wrap gap-2">
            {["All", "Adventure", "Trek", "Road Trip", "Backpacking", "Cultural", "Beach"].map(
              (type) => (
                <Link
                  key={type}
                  href={type === "All" ? "/trips" : `/explore?type=${encodeURIComponent(type)}`}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-medium border transition-all",
                    type === "All"
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-white/10 text-foreground/50 hover:text-foreground hover:border-white/20 bg-card"
                  )}
                >
                  {type}
                </Link>
              )
            )}
            <Link
              href="/explore"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium border border-white/10 text-foreground/50 hover:text-primary hover:border-primary/30 bg-card transition-all"
            >
              <SlidersHorizontal className="w-3 h-3" />
              Advanced Filters
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Trips ───────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="py-14 sm:py-20 bg-[oklch(0.09_0.005_250)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs text-primary uppercase tracking-[0.2em] font-medium mb-2">
                  Handpicked
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  Featured Trips
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.slice(0, 3).map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── All Trips ─────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs text-primary uppercase tracking-[0.2em] font-medium mb-2">
                Explore all
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                All Available Trips
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {allTrips.length} trips across India
              </p>
            </div>
            <Link
              href="/explore"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              Filter & Search
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {allTrips.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-white/6 bg-card">
              <p className="text-muted-foreground">
                No trips available at the moment. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {allTrips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA strip ─────────────────────────────────────────── */}
      <section className="py-14 bg-[oklch(0.09_0.005_250)] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Tell us your dates, group size, and interests — we&apos;ll build a trip
            around you.
          </p>
          <Link
            href="/explore"
            className={cn(
              "inline-flex items-center gap-2 px-7 py-3.5 rounded-xl",
              "bg-primary text-primary-foreground font-semibold text-sm",
              "shadow-[0_4px_24px_oklch(0.72_0.18_55/30%)] hover:bg-primary/90 transition-colors"
            )}
          >
            Customize Your Trip
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
