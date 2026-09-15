import Link from "next/link";
import Image from "next/image";
import { Destination } from "@/types";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
  destination: Destination;
}

export function DestinationCard({ destination }: DestinationCardProps) {
  return (
    <Link 
      href={`/destinations/${destination.slug}`}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-border/20 bg-background/50 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105"
      )}
    >
      {/* Hero Image */}
      <div className="relative w-full h-48 mb-4">
        <Image
          src={destination.heroImage}
          alt={destination.name}
          fill
          sizes="(max-width: 640px) 100vw, 25vw"
          className="absolute inset-0 object-cover rounded-t-lg"
          priority
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-foreground mb-2">{destination.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{destination.state}</p>
        <p className="text-sm text-muted-foreground">{destination.description.slice(0, 120)}...</p>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>{destination.tripCount || 0} trips available</span>
          </div>
          <span className="text-sm font-medium text-primary">Explore →</span>
        </div>
      </div>
    </Link>
  );
}