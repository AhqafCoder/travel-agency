import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
  name: string;
  slug: string;
  state: string;
  image: string;
  count?: number;
  description?: string;
  bestTime?: string;
  featured?: boolean;
  editLabel?: string;
  size?: "default" | "large";
}

export function DestinationCard({
  name,
  slug,
  state,
  image,
  count,
  editLabel,
  size = "default",
}: DestinationCardProps) {
  const label = editLabel ?? name;

  return (
    <Link
      href={`/destinations/${slug}`}
      className={cn(
        "group relative overflow-hidden block transition-all duration-300",
        "card-shadow card-shadow-hover"
      )}
      style={{
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.07)",
        /* uniform aspect — large card is taller */
        aspectRatio: size === "large" ? "3/4" : "4/3",
        textDecoration: "none",
      }}
    >
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
        className="object-cover transition-transform duration-700 group-hover:scale-108"
      />

      {/* Gradient */}
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.30) 55%, transparent 100%)" }} />

      {/* Trip count */}
      {count !== undefined && (
        <div className="absolute top-2.5 right-2.5">
          <span className="flex items-center gap-1" style={{ fontSize: 10, fontWeight: 600, color: "#fff", background: "rgba(0,0,0,0.50)", backdropFilter: "blur(6px)", borderRadius: 9999, padding: "3px 9px", border: "1px solid rgba(255,255,255,0.12)" }}>
            <MapPin style={{ width: 10, height: 10 }} />
            {count} trips
          </span>
        </div>
      )}

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0" style={{ padding: "14px 16px" }}>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 4px" }}>
          {state}
        </p>
        <h3 style={{ fontSize: size === "large" ? 20 : 16, fontWeight: 700, color: "#fff", margin: "0 0 8px", lineHeight: 1.2 }}>
          {label}
        </h3>
        <div className="flex items-center gap-1" style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.55)" }}>
          Explore <ArrowRight style={{ width: 13, height: 13 }} className="transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}
