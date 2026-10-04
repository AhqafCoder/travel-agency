import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, MessageCircle } from "lucide-react";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "FAQs | EditMyTrips",
  description:
    "Answers to common questions about booking, payments, cancellations and travel with EditMyTrips.",
};

const FAQ_GROUPS: {
  group: string;
  items: { question: string; answer: string }[];
}[] = [
  {
    group: "Booking & Trips",
    items: [
      {
        question: "How do I book a trip?",
        answer:
          "Browse our curated trips, pick your departure date, and click Book Now. You'll fill in traveller details and pay a booking amount to confirm your seat. Prefer something custom? Send us an enquiry from the footer form or our contact page and we'll build a trip around you.",
      },
      {
        question: "Can I customise an existing itinerary?",
        answer:
          "Absolutely — that's literally our name. Every trip can be edited: swap hotels, add days, change the pace, include private transfers or special experiences. Send an enquiry with your requirements and we'll re-edit the itinerary for free.",
      },
      {
        question: "What is the group size on a typical departure?",
        answer:
          "Most group departures run with 10–20 travellers so everyone gets a personal experience. Private and honeymoon trips are exclusive to your own group.",
      },
      {
        question: "Are your trips suitable for solo travellers?",
        answer:
          "Yes! A large part of our community travels solo. You can join a group departure to meet like-minded travellers, or book a private trip just for yourself.",
      },
    ],
  },
  {
    group: "Payments",
    items: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept UPI, credit/debit cards, net banking and popular wallets through our secure Razorpay checkout. EMI options are available on select trips.",
      },
      {
        question: "How much do I pay to confirm a booking?",
        answer:
          "A booking amount (usually 30% of the trip price) confirms your seat. The remainder is due 15 days before departure. For bookings made within 15 days of departure, full payment is required.",
      },
      {
        question: "Is my payment secure?",
        answer:
          "Yes. All payments are processed through Razorpay's PCI-DSS compliant gateway. We never store your card details on our servers.",
      },
    ],
  },
  {
    group: "Cancellations & Refunds",
    items: [
      {
        question: "What is your cancellation policy?",
        answer:
          "Cancellations 30+ days before departure receive a 90% refund, 15–30 days receive 50%, and within 15 days the booking amount is non-refundable. Full details are on our Cancellation Policy page.",
      },
      {
        question: "What happens if a trip is cancelled by EditMyTrips?",
        answer:
          "In the rare event we cancel a departure (e.g., extreme weather or insufficient bookings), you get a 100% refund or a free transfer to another departure — your choice.",
      },
      {
        question: "Do I need travel insurance?",
        answer:
          "It's not mandatory, but we strongly recommend it, especially for trekking and adventure itineraries. We can help you add a suitable policy during booking.",
      },
    ],
  },
  {
    group: "On the Trip",
    items: [
      {
        question: "Who are your trip captains?",
        answer:
          "Trip captains are vetted locals with deep knowledge of the region — trained in first aid and wilderness safety. They handle logistics, safety and making sure everyone has a great time.",
      },
      {
        question: "What should I pack?",
        answer:
          "You'll receive a detailed packing list with your booking confirmation, tailored to your destination and season. Generally: comfortable layers, sturdy shoes, and a sense of adventure.",
      },
      {
        question: "Will I stay connected during the trip?",
        answer:
          "Network coverage varies by region — the mountains have patches with no signal (that's part of the charm!). Your captain will always carry emergency communication equipment.",
      },
    ],
  },
];

export default function FaqsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted/30 pt-28 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <HelpCircle className="w-3.5 h-3.5" />
            Help centre
          </span>
          <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Frequently asked questions
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Everything you need to know before you travel with us. Can&apos;t
            find your answer? We&apos;re one message away.
          </p>
        </div>
      </section>

      {/* FAQ groups */}
      <section className="py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {FAQ_GROUPS.map((group) => (
            <div key={group.group}>
              <h2 className="text-xl font-bold text-foreground mb-5">
                {group.group}
              </h2>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-2xl border border-border/60 bg-card open:border-primary/30 transition-colors"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                      {item.question}
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-transform duration-200 group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}

          {/* Still need help */}
          <div className="rounded-3xl border border-border/60 bg-card p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Still have questions?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Our team replies within 24 hours — usually much faster.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/85 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-xl border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
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
