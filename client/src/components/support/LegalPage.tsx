import Link from "next/link";
import { LifeBuoy } from "lucide-react";

export interface LegalSection {
  heading: string;
  /** Paragraphs for this section. */
  paragraphs?: string[];
  /** Optional bullet points rendered under the paragraphs. */
  bullets?: string[];
}

interface LegalPageProps {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
}

/**
 * Shared layout for policy / support pages (terms, privacy, refunds…).
 * Keeps a consistent header, prose styling and a help CTA.
 */
export function LegalPage({
  title,
  description,
  lastUpdated,
  sections,
}: LegalPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted/30 pt-28 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <LifeBuoy className="w-3.5 h-3.5" />
            Support
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
            {description}
          </p>
          <p className="mt-4 text-xs text-muted-foreground/70">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="On this page"
            className="mb-10 rounded-2xl border border-border/60 bg-card p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              On this page
            </p>
            <ol className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {sections.map((section, i) => (
                <li key={section.heading}>
                  <a
                    href={`#section-${i + 1}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {i + 1}. {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="space-y-10">
            {sections.map((section, i) => (
              <section key={section.heading} id={`section-${i + 1}`} className="scroll-mt-28">
                <h2 className="text-xl font-bold text-foreground">
                  {i + 1}. {section.heading}
                </h2>
                <div className="mt-3 space-y-3 text-sm text-muted-foreground leading-relaxed">
                  {section.paragraphs?.map((para) => (
                    <p key={para.slice(0, 40)}>{para}</p>
                  ))}
                  {section.bullets && (
                    <ul className="space-y-2 pl-1">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet.slice(0, 40)}
                          className="flex items-start gap-2.5"
                        >
                          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-border/60 bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Questions about this policy?{" "}
              <Link
                href="/contact"
                className="font-semibold text-primary hover:underline"
              >
                Contact our team
              </Link>{" "}
              — we&apos;re happy to clarify.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
