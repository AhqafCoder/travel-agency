import Link from "next/link";
import Image from "next/image";
import { Trip } from "@/types";
import { cn } from "@/lib/utils";

interface TripCardProps {
  trip: Trip;
}

function difficultyClasses(difficulty: string) {
  switch (difficulty) {
    case "Easy":
      return "bg-emerald-100 text-emerald-800";
    case "Moderate":
      return "bg-amber-100 text-amber-800";
    case "Challenging":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-red-100 text-red-800";
  }
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Link
      href={`/trips/${trip.slug}`}
      className={cn(
        "group block h-full overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm transition-all",
        "hover:-translate-y-1 hover:shadow-xl"
      )}
    >
      {/* Cover Image */}
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <Image
          src={trip.coverImage}
          alt={trip.title}
          fill
          sizes="(max-width: 640px) 100vw, 400px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={trip.featured}
          loading={trip.featured ? "eager" : "lazy"}
        />

        {/* Badges overlaid on the image */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2">
          {trip.featured && (
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm">
              Featured
            </span>
          )}
          {trip.trending && (
            <span className="rounded-full bg-teal px-2.5 py-0.5 text-xs font-semibold text-teal-foreground shadow-sm">
              Trending
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
          {trip.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {trip.shortDescription}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              difficultyClasses(trip.difficulty)
            )}
          >
            {trip.difficulty}
          </span>
          <span className="text-xs text-muted-foreground">
            {trip.tripType} • {trip.durationDays} days
          </span>
        </div>

        <div className="mt-2 flex items-end justify-between border-t border-border/50 pt-3">
          <div className="text-sm text-muted-foreground">
            From{" "}
            <span className="text-lg font-bold text-foreground">
              ₹{trip.basePrice.toLocaleString("en-IN")}
            </span>
          </div>
          <span className="text-sm font-semibold text-primary">
            View trip →
          </span>
        </div>
      </div>
    </Link>
  );
}
