import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  Shield,
  Users,
  Award,
  ChevronDown,
  Check,
  MessageCircle,
} from "lucide-react";
import { TripCard } from "@/components/travel/TripCard";
import { HeroSearchBar } from "@/components/travel/HeroSearchBar";
import { DestinationCard } from "@/components/travel/DestinationCard";
import {
  getFeaturedTripsPublic,
  getTrendingTripsPublic,
  listRecentApprovedReviews,
  listStoriesPublic,
} from "@/server/services/public.service";
import { DESTINATION_EDITS, HOMEPAGE_FAQS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

const HERO_CATEGORIES = [
  { icon: "⭐", label: "All" },
  { icon: "⛰️", label: "Mountain" },
  { icon: "🌀", label: "Offbeat" },
  { icon: "💼", label: "Workation" },
  { icon: "🌅", label: "Weekend" },
  { icon: "🧗", label: "Adventure" },
  { icon: "🥾", label: "Hike" },
  { icon: "🏖️", label: "Beach" },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredTrips = (await getFeaturedTripsPublic(3)).slice(0, 3);
  const trendingTrips = (await getTrendingTripsPublic(6)).slice(0, 6);
  const reviews       = (await listRecentApprovedReviews(4)).slice(0, 4);
  const stories       = (await listStoriesPublic({ featured: "true" })).slice(0, 3);

  return (
    <div className="flex flex-col" style={{ background: "var(--background)", paddingTop: "64px" }}>

      {/* ══════════════════════════════════════════
           HERO
      ══════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: 560, maxHeight: 860 }}>

        {/* BG image */}
        <div className="absolute inset-0">
          <Image
            src="/hero1.jpg"
            alt="Himalayan adventure"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Centered content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4" style={{ paddingBottom: "6rem" }}>
          <h1
            className="text-center text-white font-bold leading-tight mb-7 text-balance"
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontSize: "clamp(2.2rem, 6vw, 5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              textShadow: "0 2px 32px rgba(0,0,0,0.45)",
            }}
          >
            Edit My Trips.
            <br />
            <span style={{ fontStyle: "italic", fontWeight: 800 }}>Live it. Now.</span>
          </h1>

          <HeroSearchBar />
        </div>

        {/* Category pills — bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #111 0%, rgba(17,17,17,0.7) 60%, transparent 100%)" }} />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 pt-10">
            <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {HERO_CATEGORIES.map((cat) => (
                <Link
                  key={cat.label}
                  href={cat.label === "All" ? "/trips" : `/explore?type=${encodeURIComponent(cat.label)}`}
                  className="flex items-center gap-1.5 shrink-0 transition-all duration-150"
                  style={{
                    padding: "6px 14px",
                    borderRadius: 9999,
                    border: "1px solid rgba(255,255,255,0.20)",
                    background: "rgba(17,17,17,0.60)",
                    backdropFilter: "blur(12px)",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           DESTINATION EDITS
      ══════════════════════════════════════════ */}
      <section style={{ padding: "72px 0", background: "var(--background)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-end justify-between mb-8">
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>
                Where do you want to go?
              </p>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                Choose Your Edit
              </h2>
            </div>
            <Link href="/destinations" className="flex items-center gap-1" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", opacity: 0.7, textDecoration: "none" }}>
              All Destinations <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>

          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {/* Tall first card */}
            <div style={{ gridRow: "span 2" }}>
              <DestinationCard
                name={DESTINATION_EDITS[0].label}
                slug={DESTINATION_EDITS[0].slug}
                state={DESTINATION_EDITS[0].state}
                image={DESTINATION_EDITS[0].image}
                count={DESTINATION_EDITS[0].count}
                editLabel={DESTINATION_EDITS[0].label}
                size="large"
                featured
              />
            </div>
            {DESTINATION_EDITS.slice(1, 7).map((dest) => (
              <DestinationCard
                key={dest.slug}
                name={dest.label}
                slug={dest.slug}
                state={dest.state}
                image={dest.image}
                count={dest.count}
                editLabel={dest.label}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           BANNER 1 — adventure lifestyle
      ══════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden" style={{ height: 260 }}>
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80"
          alt="Mountain adventure"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(17,17,17,0.85) 0%, rgba(17,17,17,0.30) 50%, rgba(17,17,17,0.55) 100%)" }} />
        <div className="absolute inset-0 flex items-center" style={{ paddingLeft: "clamp(1.5rem, 6vw, 5rem)" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>
              50+ handcrafted trips
            </p>
            <h3 style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)", fontWeight: 700, color: "#fff", margin: "0 0 16px", lineHeight: 1.15 }}>
              Adventures built<br />around you.
            </h3>
            <Link
              href="/trips"
              className="inline-flex items-center gap-2"
              style={{ fontSize: 13, fontWeight: 700, color: "#fff", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 9999, padding: "8px 20px", textDecoration: "none", backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.08)" }}
            >
              Explore All Trips <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
           FEATURED TRIPS
      ══════════════════════════════════════════ */}
      <section style={{ padding: "72px 0", background: "var(--surface)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>
                Handpicked for you
              </p>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                Featured Trips
              </h2>
            </div>
            <Link href="/trips" className="flex items-center gap-1" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", opacity: 0.7, textDecoration: "none" }}>
              View All <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredTrips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           TRENDING TRIPS
      ══════════════════════════════════════════ */}
      <section style={{ padding: "72px 0", background: "var(--background)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>
                Popular right now
              </p>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                Trending This Season
              </h2>
            </div>
            <Link href="/trips" className="flex items-center gap-1" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", opacity: 0.7, textDecoration: "none" }}>
              Browse All <ArrowRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingTrips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           BANNER 2 — community / people
      ══════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden" style={{ height: 260 }}>
        <Image
          src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=1600&q=80"
          alt="Travellers"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0" style={{ background: "rgba(17,17,17,0.60)" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 8 }}>
            10,000+ happy travellers
          </p>
          <h3 style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)", fontWeight: 700, color: "#fff", margin: "0 0 16px", lineHeight: 1.15 }}>
            Real people. Real experiences.
          </h3>
          <Link
            href="/stories"
            className="inline-flex items-center gap-2"
            style={{ fontSize: 13, fontWeight: 700, color: "#fff", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 9999, padding: "8px 20px", textDecoration: "none", backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.08)" }}
          >
            Read Stories <ArrowRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════════
           WHY EDITMYTRIPS
      ══════════════════════════════════════════ */}
      <section style={{ padding: "72px 0", background: "var(--surface)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 10 }}>
                Why EditMyTrips?
              </p>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 700, color: "var(--foreground)", marginBottom: 16, lineHeight: 1.2 }}>
                We don&apos;t just sell trips.<br />
                We create experiences.
              </h2>
              <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.7, marginBottom: 24 }}>
                Every trip on EditMyTrips is handcrafted, not templated. We obsess over the
                details — from where you stay to the route you take to the moments that become stories.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  "Every itinerary built around you, not a template",
                  "Verified trip captains with 5+ years of experience",
                  "Small groups — never overcrowded",
                  "Transparent pricing, no hidden costs ever",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="flex items-center justify-center shrink-0" style={{ width: 18, height: 18, borderRadius: "50%", border: "1px solid var(--border)", marginTop: 2 }}>
                      <Check style={{ width: 10, height: 10, color: "var(--foreground)" }} />
                    </span>
                    <span style={{ fontSize: 13, color: "var(--foreground)" }}>{point}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/trips"
                className="inline-flex items-center gap-2"
                style={{ fontSize: 13, fontWeight: 700, color: "var(--primary-foreground)", background: "var(--primary)", borderRadius: 10, padding: "10px 22px", textDecoration: "none" }}
              >
                Explore Trips <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Users,  value: "10,000+", label: "Happy Travellers",  sub: "Across India" },
                { icon: Star,   value: "4.9 / 5",  label: "Average Rating",    sub: "1,200+ reviews" },
                { icon: Shield, value: "100%",      label: "Verified Captains", sub: "Background-checked" },
                { icon: Award,  value: "50+",       label: "Curated Trips",     sub: "Handcrafted" },
              ].map(({ icon: Icon, value, label, sub }) => (
                <div
                  key={label}
                  style={{ padding: "20px", borderRadius: 14, border: "1px solid var(--border)", background: "var(--card)" }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <Icon style={{ width: 18, height: 18, color: "var(--foreground)" }} />
                  </div>
                  <p style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>{value}</p>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", margin: "2px 0 0" }}>{label}</p>
                  <p style={{ fontSize: 11, color: "var(--muted-foreground)", margin: 0 }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           PAST TRIPS / STORIES
      ══════════════════════════════════════════ */}
      {stories.length > 0 && (
        <section style={{ padding: "72px 0", background: "var(--background)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>
                  Real moments
                </p>
                <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                  We&apos;ve Been Here Before.
                </h2>
              </div>
              <Link href="/stories" className="flex items-center gap-1" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", opacity: 0.7, textDecoration: "none" }}>
                All Stories <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stories.map((story, i) => (
                <Link
                  key={story._id}
                  href={`/stories/${story.slug}`}
                  className={cn("group relative overflow-hidden card-shadow card-shadow-hover transition-all duration-300", i === 0 ? "md:row-span-2" : "")}
                  style={{ borderRadius: 16, border: "1px solid var(--border)", display: "block", textDecoration: "none" }}
                >
                  <div className={cn("relative w-full", i === 0 ? "aspect-[3/4] md:h-full" : "aspect-[16/10]")} style={i === 0 ? { minHeight: 400 } : {}}>
                    <Image src={story.coverImage} alt={story.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 card-gradient" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0" style={{ padding: "16px 18px" }}>
                    <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.60)", background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 9999, padding: "2px 10px", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {story.category}
                    </span>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.3 }} className="line-clamp-2">
                      {story.title}
                    </h3>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.40)", marginTop: 4 }}>
                      {story.readTime} min read · {story.views.toLocaleString()} views
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
           REVIEWS
      ══════════════════════════════════════════ */}
      {reviews.length > 0 && (
        <section style={{ padding: "72px 0", background: "var(--surface)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>
                Real voices
              </p>
              <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
                What Travellers Say
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="flex flex-col"
                  style={{ padding: "18px", borderRadius: 14, border: "1px solid var(--border)", background: "var(--card)" }}
                >
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} style={{ width: 12, height: 12, fill: i < review.rating ? "var(--foreground)" : "var(--border)", color: i < review.rating ? "var(--foreground)" : "var(--border)" }} />
                    ))}
                  </div>
                  <p className="flex-1 line-clamp-4" style={{ fontSize: 13, color: "var(--foreground)", fontStyle: "italic", lineHeight: 1.6, margin: 0 }}>
                    &ldquo;{review.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-2" style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                    <div className="flex items-center justify-center shrink-0" style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--muted)", fontSize: 11, fontWeight: 700, color: "var(--foreground)" }}>
                      {review.user?.name?.slice(0, 2).toUpperCase() ?? "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)", margin: 0 }}>
                        {review.user?.name ?? "Traveller"}
                      </p>
                      {review.trip?.title && (
                        <p className="truncate" style={{ fontSize: 11, color: "var(--muted-foreground)", margin: 0 }}>{review.trip.title}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
           BANNER 3 — customize CTA
      ══════════════════════════════════════════ */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 340 }}>
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80"
          alt="Mountain"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(17,17,17,0.92) 0%, rgba(17,17,17,0.55) 55%, rgba(17,17,17,0.30) 100%)" }} />
        <div className="absolute inset-0 flex items-center" style={{ paddingLeft: "clamp(1.5rem, 6vw, 5rem)" }}>
          <div style={{ maxWidth: 480 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.50)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 10 }}>
              Tailored for you
            </p>
            <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)", fontWeight: 700, color: "#fff", margin: "0 0 12px", lineHeight: 1.2 }}>
              This trip doesn&apos;t fit you?<br />
              <span style={{ fontStyle: "italic" }}>Edit it.</span>
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, marginBottom: 22 }}>
              Tell us your dates, group size, and must-haves. We&apos;ll build a trip
              that fits around your life — not the other way around.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/trips"
                className="inline-flex items-center gap-2"
                style={{ fontSize: 13, fontWeight: 700, color: "#111", background: "#fff", borderRadius: 10, padding: "10px 22px", textDecoration: "none" }}
              >
                Customize Your Trip <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
                style={{ fontSize: 13, fontWeight: 600, color: "#fff", border: "1px solid rgba(255,255,255,0.30)", borderRadius: 10, padding: "10px 22px", textDecoration: "none", backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.08)" }}
              >
                <MessageCircle style={{ width: 14, height: 14 }} /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
           FAQ
      ══════════════════════════════════════════ */}
      <section style={{ padding: "72px 0", background: "var(--surface)" }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>
              Got questions?
            </p>
            <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)", fontWeight: 700, color: "var(--foreground)", margin: 0 }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {HOMEPAGE_FAQS.map((faq, i) => (
              <details
                key={i}
                className="group"
                style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)", overflow: "hidden" }}
              >
                <summary className="flex items-center justify-between cursor-pointer" style={{ padding: "14px 18px", listStyle: "none" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--foreground)", paddingRight: 12 }}>{faq.q}</span>
                  <ChevronDown style={{ width: 16, height: 16, color: "var(--muted-foreground)", flexShrink: 0, transition: "transform 0.2s" }} className="group-open:rotate-180" />
                </summary>
                <div style={{ padding: "0 18px 14px", fontSize: 13, color: "var(--muted-foreground)", lineHeight: 1.65, borderTop: "1px solid var(--border)" }}>
                  <div style={{ paddingTop: 12 }}>{faq.a}</div>
                </div>
              </details>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
              style={{ fontSize: 13, fontWeight: 600, color: "var(--muted-foreground)", textDecoration: "none" }}
            >
              <MessageCircle style={{ width: 14, height: 14 }} /> Ask us on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
           FINAL CTA
      ══════════════════════════════════════════ */}
      <section style={{ padding: "80px 0", background: "var(--background)" }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 10 }}>
            Your next adventure
          </p>
          <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, color: "var(--foreground)", margin: "0 0 14px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Where will your story begin?
          </h2>
          <p style={{ fontSize: 14, color: "var(--muted-foreground)", lineHeight: 1.65, marginBottom: 28, maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
            Thousands of travellers have already edited their trips with us. Yours is next.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/trips"
              className="inline-flex items-center justify-center gap-2"
              style={{ fontSize: 14, fontWeight: 700, color: "var(--primary-foreground)", background: "var(--primary)", borderRadius: 12, padding: "12px 28px", textDecoration: "none" }}
            >
              Explore All Trips <ArrowRight style={{ width: 15, height: 15 }} />
            </Link>
            <Link
              href="/destinations"
              className="inline-flex items-center justify-center gap-2"
              style={{ fontSize: 14, fontWeight: 600, color: "var(--muted-foreground)", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 28px", textDecoration: "none" }}
            >
              Browse Destinations
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
