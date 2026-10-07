import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Calendar } from "lucide-react";
import { listDestinationsPublic } from "@/server/services/public.service";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Destinations | EditMyTrips",
  description:
    "Explore India's most spectacular regions — the Himalayas, the beaches, the deserts, and the hidden valleys.",
};

export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const destinations = await listDestinationsPublic();
  const featured = destinations.filter((d) => d.featured);
  const rest = destinations.filter((d) => !d.featured);

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ── Dark Header ─────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(1 0 0/1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0/1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-primary uppercase tracking-[0.2em] font-medium mb-4">
            Across India
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
            Choose Your{" "}
            <span className="brand-gradient-text">Destination Edit</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-sm sm:text-base leading-relaxed">
            From snow-capped Himalayan valleys to golden beaches and lush
            rainforests — every destination, edited to perfection.
          </p>
        </div>
      </section>

      {/* ── Featured Destinations — large grid ───────────────── */}
      {featured.length > 0 && (
        <section className="pb-16 sm:pb-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs text-primary uppercase tracking-[0.2em] font-medium mb-6">
              Most popular
            </p>

            {/* Hero grid: first item large, rest smaller */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Hero card */}
              <Link
                href={`/destinations/${featured[0].slug}`}
                className={cn(
                  "group relative overflow-hidden rounded-2xl lg:col-span-2 lg:row-span-2",
                  "border border-border hover:border-foreground/25 transition-all duration-300",
                  "aspect-[3/2] lg:aspect-auto lg:min-h-[480px]",
                  "shadow-[0_2px_20px_oklch(0_0_0/50%)] hover:shadow-[0_8px_40px_oklch(0_0_0/60%)]"
                )}
              >
                <Image
                  src={featured[0].heroImage}
                  alt={featured[0].name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                {featured[0].featured && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                      Featured
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs text-white/50 uppercase tracking-widest mb-1">
                    {featured[0].state}
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    {featured[0].name} Edit
                  </h2>
                  <p className="text-white/60 text-sm line-clamp-2 mb-4 max-w-lg">
                    {featured[0].description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-white/50 mb-4">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {featured[0].tripCount ?? 0} trips
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {featured[0].bestTime}
                    </span>
                  </div>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-white/70 group-hover:text-primary transition-colors">
                    Explore Trips
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>

              {/* Secondary featured cards */}
              {featured.slice(1, 5).map((dest) => (
                <Link
                  key={dest._id}
                  href={`/destinations/${dest.slug}`}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl",
                    "border border-border hover:border-foreground/25 transition-all duration-300",
                    "aspect-[4/3]",
                    "shadow-[0_2px_16px_oklch(0_0_0/40%)] hover:shadow-[0_6px_32px_oklch(0_0_0/55%)]"
                  )}
                >
                  <Image
                    src={dest.heroImage}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">
                      {dest.state}
                    </p>
                    <h3 className="font-display font-bold text-white text-lg group-hover:text-primary transition-colors">
                      {dest.name} Edit
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" />
                        {dest.tripCount ?? 0} trips
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── All Destinations ─────────────────────────────────── */}
      {rest.length > 0 && (
        <section className="py-14 sm:py-20 bg-[oklch(0.09_0.005_250)] light:bg-muted/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs text-primary uppercase tracking-[0.2em] font-medium mb-6">
              More destinations
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((dest) => (
                <Link
                  key={dest._id}
                  href={`/destinations/${dest.slug}`}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl",
                    "border border-border hover:border-foreground/25 transition-all duration-300",
                    "aspect-[4/3]",
                    "shadow-[0_2px_16px_oklch(0_0_0/40%)]"
                  )}
                >
                  <Image
                    src={dest.heroImage}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">
                      {dest.state}
                    </p>
                    <h3 className="font-display font-bold text-white text-xl mb-2 group-hover:text-primary transition-colors">
                      {dest.name} Edit
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" />
                        {dest.tripCount ?? 0} trips
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {dest.bestTime}
                      </span>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-white/50 group-hover:text-primary transition-colors">
                      Explore
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── All fallback if no split ──────────────────────────── */}
      {featured.length === 0 && (
        <section className="py-14 sm:py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {destinations.map((dest) => (
                <Link
                  key={dest._id}
                  href={`/destinations/${dest.slug}`}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl aspect-[4/3]",
                    "border border-border hover:border-foreground/25 transition-all duration-300"
                  )}
                >
                  <Image
                    src={dest.heroImage}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                  <div className="absolute bottom-0 p-5">
                    <h3 className="font-display font-bold text-white text-xl group-hover:text-primary transition-colors">
                      {dest.name} Edit
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
