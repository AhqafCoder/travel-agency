import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { MapPin, ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MOCK_DESTINATIONS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Destinations | editmytrips",
  description:
    "Explore India's most spectacular regions — the Himalayas, the beaches, the deserts, and the hidden valleys.",
};

export default function DestinationsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted/30 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Badge className="bg-brand-muted text-brand mb-4">
            <MapPin className="w-3 h-3 mr-1" /> Across India
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            Destinations
          </h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl">
            From snow-capped Himalayan valleys to golden beaches — discover the
            regions where we run our handcrafted trips.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_DESTINATIONS.map((dest) => (
            <Link
              key={dest._id}
              href={`/destinations/${dest.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-border/30 bg-card shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={dest.heroImage}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {dest.featured && (
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h2 className="text-2xl font-bold text-white">
                    {dest.name}
                  </h2>
                  <p className="text-sm text-white/80">
                    {dest.state}, {dest.country}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-5 py-4 bg-card">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary" />
                    {dest.tripCount ?? 0} trips
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-teal" />
                    {dest.bestTime}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  Explore{" "}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}