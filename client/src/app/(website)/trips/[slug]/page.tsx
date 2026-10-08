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
  ChevronRight,
  Check,
  X,
  ChevronDown,
  Mountain,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { CaptainCard } from "@/components/travel/CaptainCard";
import { getTripBySlugOrId, listApprovedReviews, getUpcomingDepartures } from "@/server/services/public.service";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { DIFFICULTY_COLORS, SITE } from "@/lib/constants";

// Live DB data (seats, prices, views) — always render fresh.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTripBySlugOrId(slug);
  if (!trip) return { title: "Trip Not Found" };
  return {
    title: `${trip.title} | EditMyTrips`,
    description: trip.metaDescription || trip.shortDescription,
    openGraph: {
      title: trip.metaTitle || trip.title,
      description: trip.metaDescription || trip.shortDescription,
      images: [{ url: trip.ogImage || trip.coverImage }],
    },
  };
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = await getTripBySlugOrId(slug);
  if (!trip) return notFound();

  const reviews = await listApprovedReviews(trip._id);
  const departures = await getUpcomingDepartures(trip._id);
  const price = trip.discountedPrice || trip.basePrice;
  const hasDiscount =
    trip.discountedPrice && trip.discountedPrice < trip.basePrice;

  return (
    <div className="flex flex-col min-h-screen bg-background">

      {/* ── Breadcrumb ──────────────────────────────────────── */}
      <div className="pt-16 bg-background border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/trips" className="hover:text-foreground transition-colors">Trips</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground/60 truncate max-w-[200px]">{trip.title}</span>
        </div>
      </div>

      {/* ── Hero Gallery ─────────────────────────────────────── */}
      <section className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={cn(
              "px-2.5 py-0.5 rounded-full text-xs font-medium border",
              DIFFICULTY_COLORS[trip.difficulty]
            )}>
              {trip.difficulty}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-foreground/50">
              {trip.tripType}
            </span>
            {trip.featured && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground">
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
            {trip.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            {trip.destination && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                {trip.destination.name}, {trip.destination.state}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              {trip.durationDays} Days / {trip.durationNights} Nights
            </span>
            {trip.rating && (
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-foreground font-semibold">{trip.rating}</span>
                {(trip.reviewCount ?? 0) > 0 && (
                  <span className="text-muted-foreground">
                    ({trip.reviewCount} reviews)
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden">
            {/* Main image */}
            <div className="relative md:col-span-2 aspect-[16/10] md:aspect-auto md:h-[440px] overflow-hidden group">
              <Image
                src={trip.coverImage}
                alt={trip.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
              {/* Price chip on image */}
              <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-xl px-4 py-2.5">
                <p className="text-[10px] text-white/50 uppercase tracking-wide">From</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display text-2xl font-bold text-white">
                    {formatPrice(price)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-white/40 line-through">
                      {formatPrice(trip.basePrice)}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-white/50">per person</p>
              </div>
            </div>

            {/* Side images */}
            <div className="grid grid-rows-2 gap-3">
              {trip.gallery.slice(0, 2).map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[4/3] md:aspect-auto overflow-hidden group"
                >
                  <Image
                    src={img}
                    alt={`${trip.title} — view ${idx + 2}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Layout: Content + Sidebar ───────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ── LEFT: Trip Content ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Quick stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Clock,    label: "Duration",   value: `${trip.durationDays}D / ${trip.durationNights}N` },
                { icon: Mountain, label: "Difficulty", value: trip.difficulty },
                { icon: Users,    label: "Group Size", value: `Max ${trip.maxGroupSize}` },
                { icon: Shield,   label: "Min Age",    value: `${trip.minAge}+ yrs` },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex flex-col gap-2 p-4 rounded-xl border border-white/6 bg-card"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</p>
                  <p className="font-display font-bold text-foreground text-sm">{value}</p>
                </div>
              ))}
            </div>

            {/* Overview */}
            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Trip Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {trip.description}
              </p>
            </section>

            {/* Divider */}
            <div className="section-divider" />

            {/* ── Itinerary ──────────────────────────────── */}
            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Day-Wise Itinerary
              </h2>
              {trip.itinerary && trip.itinerary.length > 0 ? (
                <div className="space-y-3">
                  {trip.itinerary.map((day) => (
                    <details
                      key={day.dayNumber}
                      className="group border border-white/6 rounded-xl bg-card overflow-hidden"
                      open={day.dayNumber === 1}
                    >
                      <summary className="flex items-center gap-4 cursor-pointer px-5 py-4 list-none hover:bg-white/3 transition-colors">
                        {/* Day bubble */}
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/15 text-primary font-display font-bold text-sm shrink-0">
                          {day.dayNumber}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground text-sm">
                            {day.title}
                          </p>
                          {day.distance && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {day.distance}
                            </p>
                          )}
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                      </summary>

                      <div className="px-5 pb-5 pt-2 border-t border-white/4">
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {day.description}
                        </p>

                        {day.activities && day.activities.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {day.activities.map((activity) => (
                              <span
                                key={activity}
                                className="px-2.5 py-1 rounded-full text-xs bg-primary/10 border border-primary/20 text-primary"
                              >
                                {activity}
                              </span>
                            ))}
                          </div>
                        )}

                        {(day.meals.length > 0 || day.stay || day.transport) && (
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-3 border-t border-white/4">
                            {day.meals.length > 0 && (
                              <span className="flex items-center gap-1">
                                🍽 {day.meals.join(" · ")}
                              </span>
                            )}
                            {day.stay && (
                              <span className="flex items-center gap-1">
                                🏠 {day.stay}
                              </span>
                            )}
                            {day.transport && (
                              <span className="flex items-center gap-1">
                                🚌 {day.transport}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </details>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Detailed itinerary coming soon.
                </p>
              )}
            </section>

            {/* Divider */}
            <div className="section-divider" />

            {/* ── Inclusions / Exclusions ────────────────── */}
            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                What&apos;s Included
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Included */}
                <div className="p-5 rounded-2xl border border-emerald-500/15 bg-emerald-500/5">
                  <h3 className="font-semibold text-emerald-400 mb-4 text-sm uppercase tracking-wide">
                    ✓ Included
                  </h3>
                  <ul className="space-y-2.5">
                    {trip.inclusions?.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-foreground/70">
                        <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Excluded */}
                <div className="p-5 rounded-2xl border border-red-500/15 bg-red-500/5">
                  <h3 className="font-semibold text-red-400 mb-4 text-sm uppercase tracking-wide">
                    ✗ Not Included
                  </h3>
                  <ul className="space-y-2.5">
                    {trip.exclusions?.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-foreground/70">
                        <span className="mt-0.5 w-4 h-4 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center shrink-0">
                          <X className="w-2.5 h-2.5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Divider */}
            <div className="section-divider" />

            {/* ── Reviews ────────────────────────────────── */}
            <section>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Traveller Reviews
              </h2>
              {reviews.length === 0 ? (
                <div className="text-center py-10 rounded-2xl border border-white/6 bg-card">
                  <Star className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    No reviews yet. Be the first to share your experience!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Rating summary */}
                  {trip.rating && (
                    <div className="flex items-center gap-5 p-5 rounded-2xl border border-white/6 bg-card mb-6">
                      <div className="text-center shrink-0">
                        <p className="font-display text-5xl font-bold text-foreground">
                          {trip.rating}
                        </p>
                        <div className="flex gap-0.5 justify-center mt-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-4 h-4",
                                i < Math.round(trip.rating ?? 0)
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-white/10 text-white/10"
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">
                          {trip.reviewCount ?? reviews.length} reviews
                        </p>
                      </div>
                      <div className="w-px h-16 bg-white/8 shrink-0" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        All reviews are from verified EditMyTrips travellers who
                        completed this trip.
                      </p>
                    </div>
                  )}

                  {/* Review cards */}
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="p-5 rounded-2xl border border-white/6 bg-card"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                            {review.user?.name?.slice(0, 2).toUpperCase() ?? "?"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              {review.user?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Verified Traveller
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-3.5 h-3.5",
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-white/10 text-white/10"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      {review.title && (
                        <p className="font-semibold text-sm text-foreground mb-1.5">
                          {review.title}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground leading-relaxed italic">
                        &ldquo;{review.content}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Divider */}
            <div className="section-divider" />

            {/* ── FAQs ────────────────────────────────────── */}
            {trip.faqs && trip.faqs.length > 0 && (
              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-2">
                  {trip.faqs.map((faq, idx) => (
                    <details
                      key={idx}
                      className="group border border-white/6 rounded-xl bg-card overflow-hidden"
                    >
                      <summary className="flex items-center justify-between cursor-pointer px-5 py-4 list-none hover:bg-white/3 transition-colors">
                        <span className="font-medium text-foreground text-sm pr-4">
                          {faq.question}
                        </span>
                        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="px-5 pb-4 pt-2 text-sm text-muted-foreground leading-relaxed border-t border-white/4">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* ── Captain ─────────────────────────────────── */}
            {trip.captain && (
              <>
                <div className="section-divider" />
                <section>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Meet Your Trip Captain
                  </h2>
                  <div className="max-w-xs">
                    <CaptainCard captain={trip.captain} />
                  </div>
                </section>
              </>
            )}

            {/* ── Customize CTA ───────────────────────────── */}
            <div className="section-divider" />
            <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[60px] rounded-full pointer-events-none" />
              <div className="relative">
                <p className="text-xs text-primary uppercase tracking-[0.2em] font-medium mb-3">
                  Tailored for you
                </p>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2">
                  This trip doesn&apos;t fit perfectly?{" "}
                  <span className="brand-gradient-text">Edit it.</span>
                </h3>
                <p className="text-muted-foreground text-sm mb-5 leading-relaxed max-w-md">
                  Tell us your group size, preferred dates, and must-haves —
                  we&apos;ll build a custom version of this trip just for you.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/booking/${trip._id}`}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-[0_4px_20px_oklch(0.72_0.18_55/30%)]"
                  >
                    Book This Trip
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <a
                    href={`https://wa.me/${SITE.whatsapp}?text=Hi!%20I'd%20like%20to%20customize%20the%20trip%3A%20${encodeURIComponent(trip.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-foreground/70 font-medium text-sm hover:text-foreground hover:border-white/20 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Customize on WhatsApp
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* ── RIGHT: Sticky Booking Sidebar ──────────────────── */}
          <aside className="lg:col-span-1">
            <BookingWidget trip={trip} departures={departures} />
          </aside>
        </div>
      </div>

      {/* ── Mobile Sticky CTA ─────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-t border-white/8 px-4 py-3 flex items-center justify-between shadow-[0_-4px_24px_oklch(0_0_0/50%)]">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">From</p>
          <p className="font-display text-lg font-bold text-foreground">
            {formatPrice(price)}
          </p>
          <p className="text-[10px] text-muted-foreground">per person</p>
        </div>
        <Link
          href={`/booking/${trip._id}`}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-[0_4px_20px_oklch(0.72_0.18_55/40%)]"
        >
          Book Now
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Mobile bottom padding so sticky CTA doesn't overlap content */}
      <div className="lg:hidden h-20" />
    </div>
  );
}
