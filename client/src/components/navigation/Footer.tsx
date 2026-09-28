import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Video,
  Globe,
  AtSign,
  Mail,
  Phone,
  MessageCircle,
  ArrowRight,
  ArrowUp,
} from "lucide-react";
import { SITE, FOOTER_LINKS } from "@/lib/constants";

const SOCIALS = [
  { icon: Camera, href: SITE.social.instagram, label: "Instagram" },
  { icon: Video, href: SITE.social.youtube, label: "YouTube" },
  { icon: Globe, href: SITE.social.facebook, label: "Facebook" },
  { icon: AtSign, href: SITE.social.twitter, label: "Twitter" },
  { icon: MessageCircle, href: SITE.social.whatsapp, label: "WhatsApp" },
];

const LINK_COLUMNS = [
  { title: "Explore", links: FOOTER_LINKS.explore },
  { title: "Destinations", links: FOOTER_LINKS.destinations },
  { title: "Company", links: FOOTER_LINKS.company },
  { title: "Support", links: FOOTER_LINKS.support },
];

const linkClass =
  "group inline-flex items-center text-sm text-foreground/55 hover:text-foreground transition-colors focus-visible:outline-none focus-visible:text-foreground focus-visible:underline underline-offset-4";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[oklch(0.05_0.003_250)] border-t border-white/6">
      {/* Soft glow behind the CTA */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── CTA panel ───────────────────────────────── */}
        <div className="-translate-y-0 pt-14">
          <div className="rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.06] to-white/[0.02] px-6 py-10 sm:px-10 sm:py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <h3 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  Ready to edit your trip?
                </h3>
                <p className="mt-3 text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Tell us where you want to go. We&apos;ll build the perfect
                  experience around you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  href="/trips"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#111] font-semibold text-sm hover:bg-white/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Customize your trip
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 text-foreground font-semibold text-sm hover:bg-white/8 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main grid ───────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-x-6 gap-y-12 py-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <Link
              href="/"
              aria-label={`${SITE.name ?? "EditMyTrips"} home`}
              className="inline-flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary rounded-md"
            >
              <Image
                src="/image.png"
                alt=""
                width={48}
                height={48}
                className="h-11 w-auto"
              />
              <span className="font-display font-bold text-2xl tracking-tight text-foreground">
                EditMyTrips
              </span>
            </Link>

            <p className="mt-5 text-muted-foreground text-sm leading-relaxed max-w-xs">
              {SITE.description}
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/8 text-muted-foreground hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {LINK_COLUMNS.map(({ title, links }, i) => (
            <nav
              key={title}
              aria-label={title}
              className="lg:col-span-2"
            >
              <h4 className="font-display font-semibold text-sm text-foreground mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* ── Contact + legal bar ─────────────────────── */}
        <div className="border-t border-white/6 py-7 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              {SITE.email}
            </a>
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              {SITE.phone}
            </a>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-6">
            <p className="text-xs text-muted-foreground/60">
              © {new Date().getFullYear()} EditMyTrips. Travel, edited your way.
            </p>
            <a
              href="#top"
              aria-label="Back to top"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <ArrowUp className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}