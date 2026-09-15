import Link from "next/link";
import { MapPin, Camera, Video, AtSign, Globe, Mail, Phone, MessageCircle } from "lucide-react";
import { SITE, FOOTER_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 pb-12 border-b border-background/10">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-background">{SITE.name}</span>
            </Link>
            <p className="text-background/60 text-sm leading-relaxed mb-6 max-w-xs">
              {SITE.description}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {[
                { icon: Camera, href: SITE.social.instagram, label: "Instagram" },
                { icon: Video, href: SITE.social.youtube, label: "YouTube" },
                { icon: Globe, href: SITE.social.facebook, label: "Facebook" },
                { icon: AtSign, href: SITE.social.twitter, label: "Twitter" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-background/10 text-background/70 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-background text-sm uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trips */}
          <div>
            <h3 className="font-semibold text-background text-sm uppercase tracking-wider mb-4">
              Trips
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.trips.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="font-semibold text-background text-sm uppercase tracking-wider mb-4">
              Destinations
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.destinations.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support + Newsletter */}
          <div>
            <h3 className="font-semibold text-background text-sm uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2.5 mb-6">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Strip */}
        <div className="py-8 border-b border-background/10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-background mb-1">
                Get trip drops & travel inspiration
              </h3>
              <p className="text-background/60 text-sm">
                No spam. Unsubscribe anytime.
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="you@example.com"
                className="bg-background/10 border-background/20 text-background placeholder:text-background/40 focus:border-primary w-full md:w-64"
              />
              <Button type="submit" size="sm">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Contact + Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <a
              href={`mailto:${SITE.email}`}
              className="flex items-center gap-1.5 text-sm text-background/60 hover:text-background transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              {SITE.email}
            </a>
            <a
              href={`tel:${SITE.phone}`}
              className="flex items-center gap-1.5 text-sm text-background/60 hover:text-background transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              {SITE.phone}
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-background/60 hover:text-background transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </a>
          </div>
          <p className="text-sm text-background/40">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
