import { Metadata } from "next";
import { TripCard } from "@/components/travel/TripCard";
import { MOCK_TRIPS, getFeaturedTrips } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "All Trips",
  description: "Browse all handcrafted trips and adventures across India. Filter by type, difficulty, and destination.",
};

export default function TripsPage() {
  const allTrips = MOCK_TRIPS.filter(t => t.status === "PUBLISHED");
  const featured = getFeaturedTrips();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground">All Trips</h1>
          <p className="text-muted-foreground mt-2">
            Discover {allTrips.length} handcrafted adventures across India's most spectacular destinations
          </p>
        </div>
      </div>

      {/* Featured Trips Section */}
      {featured.length > 0 && (
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Featured Trips</h2>
                <p className="text-muted-foreground">Our top picks for the season</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.slice(0, 3).map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Trips Grid */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">All Available Trips</h2>
            <p className="text-muted-foreground">{allTrips.length} trips available</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTrips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>

          {allTrips.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No trips available at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}