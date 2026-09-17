import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Clock, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_STORIES } from "@/lib/mock-data";
import { format } from "date-fns";

export const metadata: Metadata = {
  title: "Stories from the Trail | editmytrips",
  description:
    "Real experiences, travel tips, and inspiration from the editmytrips community.",
};

export default function StoriesPage() {
  const featured = MOCK_STORIES.filter((s) => s.featured).slice(0, 1);
  const rest = MOCK_STORIES.filter((s) => !featured.includes(s));

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted/30 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Badge className="bg-brand-muted text-brand mb-4">The Journal</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            Stories from the Trail
          </h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl">
            Real experiences, travel tips, and inspiration from our community of
            explorers across India.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {/* Featured story */}
        {featured[0] && (
          <Link
            href={`/stories/${featured[0].slug}`}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-3xl overflow-hidden border border-border/30 bg-card shadow-sm hover:shadow-xl transition-all mb-14"
          >
            <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full min-h-[280px] overflow-hidden">
              <Image
                src={featured[0].coverImage}
                alt={featured[0].title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                <Badge className="bg-primary text-primary-foreground">
                  Featured
                </Badge>
                <span>{featured[0].category}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors">
                {featured[0].title}
              </h2>
              <p className="text-muted-foreground mt-4 leading-relaxed line-clamp-3">
                {featured[0].excerpt}
              </p>
              <div className="flex items-center gap-4 mt-6 text-sm text-muted-foreground">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={featured[0].author?.avatar} alt={featured[0].author?.name} />
                  <AvatarFallback className="text-xs">
                    {featured[0].author?.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">
                  {featured[0].author?.name}
                </span>
                <span>•</span>
                <span>
                  {getPublishedLabel(featured[0].publishedAt)}
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Story grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((story) => (
            <Link
              key={story._id}
              href={`/stories/${story.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/30 bg-card shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={story.coverImage}
                  alt={story.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge className="absolute top-3 left-3 bg-background/90 text-foreground backdrop-blur-sm">
                  {story.category}
                </Badge>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {story.readTime} min read
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {story.views.toLocaleString()}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-3">
                  {story.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                  {story.excerpt}
                </p>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/20">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-7 h-7">
                      <AvatarImage src={story.author?.avatar} alt={story.author?.name} />
                      <AvatarFallback className="text-[10px]">
                        {story.author?.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-foreground">
                      {story.author?.name}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Read <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {rest.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            More stories landing soon.
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 bg-gradient-to-r from-brand-muted to-teal-muted rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Have a story to tell?
          </h2>
          <p className="text-muted-foreground mb-6">
            Share your trip experience with the community.
          </p>
          <Button asChild size="lg">
            <Link href="/community">
              Join the community <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function getPublishedLabel(date?: Date): string {
  if (!date) return "";
  try {
    return format(new Date(date), "MMM d, yyyy");
  } catch {
    return "";
  }
}