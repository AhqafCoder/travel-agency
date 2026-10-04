import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Clock,
  Globe2,
  Heart,
  Laptop,
  MapPin,
  PartyPopper,
  Wallet,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Careers | EditMyTrips",
  description:
    "Join the EditMyTrips crew — help craft unforgettable journeys across India.",
};

const PERKS = [
  {
    icon: Globe2,
    title: "Travel the map",
    description:
      "Familiarisation trips to our destinations — because you can't sell what you haven't seen.",
  },
  {
    icon: Laptop,
    title: "Flexible & remote-friendly",
    description:
      "Work from our Mumbai office or wherever you do your best work.",
  },
  {
    icon: Wallet,
    title: "Competitive pay",
    description:
      "Salary benchmarked to the top of the travel industry, plus trip discounts for family.",
  },
  {
    icon: Clock,
    title: "Real work-life balance",
    description:
      "Unlimited leave policy with a minimum 15 days enforced — we mean it.",
  },
  {
    icon: Heart,
    title: "Health covered",
    description: "Comprehensive health insurance for you and your dependents.",
  },
  {
    icon: PartyPopper,
    title: "Small team, big ownership",
    description:
      "Your work ships. No layers of approval, no invisible contributions.",
  },
];

const OPENINGS = [
  {
    title: "Senior Trip Designer",
    type: "Full-time",
    location: "Mumbai / Remote",
    team: "Product",
    description:
      "Own end-to-end itinerary design for our Himalayan destinations — research, route planning, stay curation and pricing.",
  },
  {
    title: "Trip Captain (Himachal & Uttarakhand)",
    type: "Seasonal",
    location: "On the road",
    team: "Operations",
    description:
      "Lead group departures, manage on-ground logistics and keep our travellers safe and smiling. First-aid certification preferred.",
  },
  {
    title: "Growth Marketing Lead",
    type: "Full-time",
    location: "Mumbai",
    team: "Marketing",
    description:
      "Own our acquisition funnel across performance marketing and community. You'll have a real budget and real autonomy.",
  },
  {
    title: "Customer Experience Associate",
    type: "Full-time",
    location: "Remote (IST overlap)",
    team: "Support",
    description:
      "Be the friendly voice of EditMyTrips — pre-sale queries, on-trip support and turning problems into praise.",
  },
  {
    title: "Full-stack Engineer (Next.js / Node)",
    type: "Full-time",
    location: "Remote (India)",
    team: "Engineering",
    description:
      "Build the platform that powers custom itineraries, bookings and our captain network. TypeScript across the stack.",
  },
];

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted/30 pt-28 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Briefcase className="w-3.5 h-3.5" />
            We&apos;re hiring
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Work where wanderlust is the job description
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            We&apos;re a small, obsessed team crafting India&apos;s most
            personalised trips. If you love travel and hate busywork, you&apos;ll
            fit right in.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground">
            Why you&apos;ll love it here
          </h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERKS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-border/60 bg-card p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="py-14 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground">Open roles</h2>
          <p className="mt-3 text-muted-foreground">
            Don&apos;t see your role? Write to us anyway — we hire great people
            when we find them.
          </p>
          <div className="mt-8 space-y-4">
            {OPENINGS.map((job) => (
              <div
                key={job.title}
                className="group rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <h3 className="text-lg font-semibold text-foreground">
                      {job.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                      {job.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-muted-foreground">
                        <Briefcase className="w-3 h-3" />
                        {job.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-muted-foreground">
                        {job.team}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/contact?role=${encodeURIComponent(job.title)}`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  >
                    Apply
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
