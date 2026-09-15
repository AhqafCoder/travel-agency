import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  Clock, 
  Users, 
  Shield, 
  Star, 
  ArrowLeft, 
  Check, 
  X, 
  ChevronDown,
  ChevronRight,
  Calendar,
  Mountain,
  Heart,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { ReviewCard } from "@/components/travel/ReviewCard";
import { CaptainCard } from "@/components/travel/CaptainCard";
import { getTripBySlug, getTripReviews, formatPrice } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { DIFFICULTY_COLORS } from "@/lib/constants";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const trip = getTripBySlug(params.slug);
  if (!trip) return { title: "Trip Not Found" };

  return {
    title: trip.title,
    description: trip.metaDescription || trip.shortDescription,
    openGraph: {
      title: trip.metaTitle || trip.title,
      description: trip.metaDescription || trip.shortDescription,
      images: [{ url: trip.ogImage || trip.coverImage }],
    },
  };
}

export default function TripDetailPage({ params }: { params: { slug: string } }) {
  const trip = getTripBySlug(params.slug);

  if (!trip) return notFound();

  const reviews = getTripReviews(trip._id);
  const price = trip.discountedPrice || trip.basePrice;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <Link href="/trips" className="text-muted-foreground hover:text-primary transition-colors">
            Trips
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-foreground font-medium truncate">{trip.title}</span>
        </div>
      </div>

      {/* ============================================================
           TRIP MAIN CONTENT
      ============================================================= */}
      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="secondary" className={cn(DIFFICULTY_COLORS[trip.difficulty])}>
                {trip.difficulty}
              </Badge>
              <Badge variant="outline">{trip.tripType}</Badge>
              {trip.featured && (
                <Badge className="bg-primary text-primary-foreground border-primary">
                  Featured
                </Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              {trip.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                {trip.destination?.name}, {trip.destination?.state}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary" />
                {trip.durationDays} Days / {trip.durationNights} Nights
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-foreground font-semibold">{trip.rating || "New"}</span>
                {(trip.reviewCount ?? 0) > 0 && (
                  <span>({trip.reviewCount} reviews)</span>
                )}
              </span>
            </div>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {/* Main image */}
            <div className="relative md:col-span-2 h-64 md:h-[400px] rounded-2xl overflow-hidden group">
              <Image
                src={trip.coverImage}
                alt={trip.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            {/* Side images */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {trip.gallery.slice(0, 2).map((img, idx) => (
                <div key={idx} className="relative h-32 md:h-[194px] rounded-2xl overflow-hidden group">
                  <Image
                    src={img}
                    alt={`${trip.title} - image ${idx + 2}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ============================================================
               MAIN + SIDEBAR LAYOUT
              ============================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT: Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Overview */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">Trip Overview</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {trip.description}
                </p>

                {/* Quick stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: Clock, label: "Duration", value: `${trip.durationDays}D/${trip.durationNights}N` },
                    { icon: Mountain, label: "Difficulty", value: trip.difficulty },
                    { icon: Users, label: "Group Size", value: `Max ${trip.maxGroupSize}` },
                    { icon: Shield, label: "Min Age", value: `${trip.minAge}+` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="p-4 rounded-xl border border-border/20 bg-background/50">
                      <Icon className="w-5 h-5 text-primary mb-2" />
                      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                      <p className="font-semibold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              {/* Tabs */}
              <section>
                <Tabs defaultValue="itinerary" className="w-full">
                  <TabsList className="w-full justify-start border-b border-border/20 bg-transparent p-0 h-auto space-x-1 overflow-x-auto">
                    <TabsTrigger value="itinerary" className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none border-b-2 border-transparent px-4 py-3">
                      Itinerary
                    </TabsTrigger>
                    <TabsTrigger value="inclusions" className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none border-b-2 border-transparent px-4 py-3">
                      Inclusions
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none border-b-2 border-transparent px-4 py-3">
                      Reviews ({reviews.length})
                    </TabsTrigger>
                    <TabsTrigger value="faqs" className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary rounded-none border-b-2 border-transparent px-4 py-3">
                      FAQs
                    </TabsTrigger>
                  </TabsList>

                  {/* ITINERARY */}
                  <TabsContent value="itinerary" className="pt-6 space-y-6">
                    {trip.itinerary && trip.itinerary.length > 0 ? (
                      <div className="space-y-4">
                        {trip.itinerary.map((day) => (
                          <div key={day._id} className="relative pl-12">
                            {/* Timeline line */}
                            <div className="absolute left-4 top-0 bottom-0 w-px bg-border/40" />
                            {/* Day circle */}
                            <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                              {day.dayNumber}
                            </div>
                            <div className="bg-background/50 border border-border/20 rounded-xl p-5 hover:border-primary/30 transition-colors">
                              <h3 className="font-semibold text-foreground mb-2">{day.title}</h3>
                              <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                                {day.description}
                              </p>
                              {day.activities && day.activities.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {day.activities.map((activity) => (
                                    <span key={activity} className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
                                      {activity}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {(day.meals.length > 0 || day.stay || day.transport) && (
                                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-3 border-t border-border/10">
                                  {day.meals.length > 0 && (
                                    <span>🍽 {day.meals.join(" • ")}</span>
                                  )}
                                  {day.stay && <span>🏠 {day.stay}</span>}
                                  {day.transport && <span>🚌 {day.transport}</span>}
                                  {day.distance && <span>📍 {day.distance}</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Detailed itinerary coming soon.</p>
                    )}
                  </TabsContent>

                  {/* INCLUSIONS */}
                  <TabsContent value="inclusions" className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-semibold text-foreground mb-4">What&apos;s included</h3>
                        <ul className="space-y-3">
                          {trip.inclusions?.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                              <span className="mt-0.5 w-5 h-5 rounded-full bg-teal-muted text-teal flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3" />
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-4">What&apos;s not included</h3>
                        <ul className="space-y-3">
                          {trip.exclusions?.map((item) => (
                            <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                              <span className="mt-0.5 w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                                <X className="w-3 h-3" />
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  {/* REVIEWS */}
                  <TabsContent value="reviews" className="pt-6">
                    {reviews.length === 0 ? (
                      <div className="text-center py-10">
                        <Star className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
                        <p className="text-muted-foreground">No reviews yet. Be the first to review this trip!</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Rating summary */}
                        <div className="flex items-center gap-6 p-6 rounded-xl border border-border/20 bg-muted/20">
                          <div className="text-center">
                            <p className="text-5xl font-bold text-foreground">{trip.rating}</p>
                            <div className="flex gap-0.5 justify-center mt-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "w-4 h-4",
                                    i < Math.round(trip.rating || 0)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "fill-muted text-muted"
                                  )}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Based on {trip.reviewCount || reviews.length} reviews
                            </p>
                          </div>
                          <Separator orientation="vertical" className="h-24" />
                          <div className="text-sm text-muted-foreground">
                            <p>{trip.shortDescription}</p>
                            <p className="mt-2 text-xs">
                              All reviews are from verified travellers.
                            </p>
                          </div>
                        </div>

                        {/* Review cards */}
                        <div className="space-y-4">
                          {reviews.map((review) => (
                            <ReviewCard key={review._id} review={review} />
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  {/* FAQS */}
                  <TabsContent value="faqs" className="pt-6">
                    {trip.faqs && trip.faqs.length > 0 ? (
                      <div className="space-y-3">
                        {trip.faqs.map((faq, idx) => (
                          <details key={idx} className="group">
                            <summary className="flex items-center justify-between cursor-pointer p-4 rounded-xl border border-border/20 bg-background/50 hover:border-primary/30 transition-colors list-none">
                              <span className="font-medium text-foreground pr-4">{faq.question}</span>
                              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="p-4 pt-2 text-sm text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </div>
                          </details>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No frequently asked questions yet. Contact us if you have any questions!</p>
                    )}
                  </TabsContent>
                </Tabs>
              </section>
            </div>

            {/* RIGHT: Sticky Booking Sidebar */}
            <aside className="lg:col-span-1">
              <BookingWidget trip={trip} />
            </aside>
          </div>

          {/* ============================================================
               CAPTAIN SECTION
              ============================================================= */}
          {trip.captain && (
            <section className="mt-16">
              <Separator className="mb-10" />
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Meet Your Trip Captain</h2>
                  <p className="text-muted-foreground mt-1">
                    Trusted guide and companion for this adventure
                  </p>
                </div>
              </div>
              <div className="max-w-xs">
                <CaptainCard captain={trip.captain} />
              </div>
            </section>
          )}

          {/* ============================================================
               RELATED TRIPS PLACEHOLDER
              ============================================================= */}
          {/* <section className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Similar Trips</h2>
                <p className="text-muted-foreground mt-1">Explore more adventures</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/explore">View all trips</Link>
              </Button>
            </div>
          </section> */}
        </div>
      </div>

      {/* Mobile Sticky CTA (only visible on small screens) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border/20 p-4 flex items-center justify-between shadow-lg">
        <div>
          <p className="text-xs text-muted-foreground">From</p>
          <p className="text-lg font-bold text-foreground">{formatPrice(price)}</p>
          <p className="text-xs text-muted-foreground">per person</p>
        </div>
        <Button size="lg" asChild>
          <Link href={`/booking/${trip._id}`}>Book Now</Link>
        </Button>
      </div>
    </div>
  );
}
