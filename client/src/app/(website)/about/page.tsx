import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Compass,
  HeartHandshake,
  Mountain,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us | EditMyTrips",
  description:
    "Learn about EditMyTrips — how we craft personalised adventures across India's most spectacular landscapes.",
};

const STATS = [
  { value: "25,000+", label: "Happy travellers" },
  { value: "120+", label: "Curated itineraries" },
  { value: "28", label: "States explored" },
  { value: "4.9★", label: "Average rating" },
];

const VALUES = [
  {
    icon: Compass,
    title: "Crafted, not copied",
    description:
      "Every itinerary is edited around you — your pace, your budget, your vibe. No two EditMyTrips journeys are the same.",
  },
  {
    icon: ShieldCheck,
    title: "Safety first",
    description:
      "Vetted captains, verified stays and 24×7 on-trip support. Adventure should feel thrilling, never risky.",
  },
  {
    icon: HeartHandshake,
    title: "Local everywhere",
    description:
      "We work with local captains, homestays and guides in every region — so your money supports the places you visit.",
  },
  {
    icon: Sparkles,
    title: "Obsessive detail",
    description:
      "From the morning chai stop to the sunset viewpoint, we sweat the small stuff so you don't have to.",
  },
];

const TEAM = [
  {
    name: "Aarav Mehta",
    role: "Founder & Chief Trip Editor",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Zoya Khan",
    role: "Head of Experiences",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    name: "Rohan Iyer",
    role: "Lead Captain, Himalayas",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
  {
    name: "Meera Nair",
    role: "Community & Support",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted/30 pt-28 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Mountain className="w-3.5 h-3.5" />
            Since 2021
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Travel, edited your way
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {SITE.description}
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Our story</h2>
            <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                EditMyTrips started with a simple frustration: group tours
                that cram 40 strangers into a rigid schedule, and &ldquo;custom
                trips&rdquo; that are anything but. We believed travel in India
                deserved an editor — someone who cuts the filler and keeps the
                magic.
              </p>
              <p>
                So we built a team of travellers, captains and storytellers
                who design every trip from a blank page. You tell us the who,
                when and how much — we handle the where and the wow.
              </p>
              <p>
                Today, thousands of travellers have hiked with us in Himachal,
                camped under Ladakh&apos;s stars and sunbathed on Goa&apos;s quietest
                beaches — each trip edited to fit them perfectly.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border/60 bg-card px-4 py-3 text-center"
                >
                  <p className="text-xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Image
              src="https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=800&q=80"
              alt="Travellers on a Himalayan trail"
              width={600}
              height={750}
              className="rounded-2xl object-cover aspect-[4/5] w-full"
            />
            <Image
              src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80"
              alt="Group of friends travelling together"
              width={600}
              height={750}
              className="rounded-2xl object-cover aspect-[4/5] w-full mt-8"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center">
            What we stand for
          </h2>
          <p className="mt-3 text-muted-foreground text-center max-w-xl mx-auto">
            Four principles guide every itinerary we edit.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, description }) => (
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

      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Meet the crew</h2>
          </div>
          <p className="mt-3 text-muted-foreground max-w-xl">
            The people who plan, lead and obsess over your trips.
          </p>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-primary px-8 py-12 text-center text-primary-foreground">
            <h2 className="text-3xl font-bold">Ready for your edit?</h2>
            <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">
              Browse our curated trips or tell us your dream destination —
              we&apos;ll take it from there.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/trips"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#111] hover:bg-white/90 transition-colors"
              >
                Explore trips
              </Link>
              <Link
                href="/contact"
                className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
