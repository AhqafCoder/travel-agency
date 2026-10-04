import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/constants";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact Us | EditMyTrips",
  description:
    "Get in touch with the EditMyTrips team — send an enquiry and we'll craft your perfect trip.",
};

const CONTACT_CARDS = [
  {
    icon: Phone,
    title: "Call us",
    value: SITE.phone,
    href: `tel:${SITE.phone.replace(/\s/g, "")}`,
    hint: "Mon–Sat, 9am to 7pm IST",
  },
  {
    icon: Mail,
    title: "Email us",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    hint: "We reply within 24 hours",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: SITE.phone,
    href: `https://wa.me/${SITE.whatsapp}`,
    hint: "Fastest way to reach us",
  },
  {
    icon: MapPin,
    title: "Office",
    value: SITE.address,
    href: "https://maps.google.com/?q=Mumbai,Maharashtra,India",
    hint: "Visits by appointment",
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted/30 pt-28 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Get in touch
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Questions about a trip, a custom itinerary, or anything else?
            Drop us a line — real humans answer here.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CONTACT_CARDS.map(({ icon: Icon, title, value, href, hint }) => (
              <a
                key={title}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group rounded-2xl border border-border/60 bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="mt-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {title}
                </h2>
                <p className="mt-1 font-semibold text-foreground break-words">
                  {value}
                </p>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {hint}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry form */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-foreground">
              Send an enquiry
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Fill in the form and our travel experts will design a
              personalised itinerary around your dates, budget and travel
              style — completely free.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Customised itinerary within 24 hours
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Free changes until you&apos;re happy
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                Best-price guarantee on every departure
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
            <EnquiryForm variant="light" />
          </div>
        </div>
      </section>
    </div>
  );
}
