import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TripCard } from "@/components/travel/TripCard";
import { getDestinationBySlug, MOCK_TRIPS } from "@/lib/mock-data";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) return { title: "Destination Not Found" };
  return {
    title: `${dest.name}, ${dest.state} | editmytrips`,
    description: dest.description,
    openGraph: {
      title: dest.name,
      description: dest.description,
      images: [{ url: dest.heroImage }],
    },
  };
}

export default async function DestinationDetailPage({ params }: Params) {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) return notFound();

  const trips = MOCK_TRIPS.filter((t) => t.destinationId === dest._id);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[420px] md:h-[480px] overflow-hidden">
        <Image
          src={dest.heroImage}
          alt={dest.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <Badge className="bg-teal text-teal-foreground mb-3">
              <MapPin className="w-3 h-3 mr-1" />
              {dest.state}, {dest.country}
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              {dest.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-white/90 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Best time: {dest.bestTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {trips.length} trips from here
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {/* About */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            About {dest.name}
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            {dest.description}
          </p>
        </section>

        {/* Gallery */}
        {dest.gallery.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-foreground mb-4">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {dest.gallery.map((img, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src={img}
                    alt={`${dest.name} gallery ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trips from here */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              Trips from {dest.name}
            </h2>
            <Link
              href="/trips"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              View all trips <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {trips.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-2xl text-muted-foreground">
              New trips here are being crafted. Check back soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          )}

          </section>
      </div>
    </div>
  );
}