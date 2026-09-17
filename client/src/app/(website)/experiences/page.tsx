"use client";

import { useMemo, useState } from "react";
import { ExperienceCard } from "@/components/travel/ExperienceCard";
import { MOCK_EXPERIENCES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function ExperiencesPage() {
  const allExperiences = MOCK_EXPERIENCES.filter((e) => e.status === "ACTIVE");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(allExperiences.map((e) => e.category)));
    return ["All", ...cats];
  }, [allExperiences]);

  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? allExperiences
      : allExperiences.filter((e) => e.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground">Experiences</h1>
          <p className="text-muted-foreground mt-2">
            Extraordinary activities curated by our captains across India
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 text-sm font-medium rounded-full transition-colors border",
                  activeCategory === cat
                    ? "bg-brand text-white border-brand"
                    : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-foreground/30"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Experiences Grid */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No experiences in this category yet. Check back soon!
              </p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground">
                  {activeCategory === "All"
                    ? "All Experiences"
                    : activeCategory}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {filtered.length} experience{filtered.length !== 1 ? "s" : ""}{" "}
                  available
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((exp) => (
                  <ExperienceCard key={exp._id} experience={exp} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
