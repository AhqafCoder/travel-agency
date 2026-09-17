import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Calendar, Clock, Eye, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getStoryBySlug, MOCK_STORIES } from "@/lib/mock-data";
import { format } from "date-fns";

type StoryParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: StoryParams): Promise<Metadata> {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) return { title: "Story Not Found" };
  return {
    title: story.metaTitle ?? story.title,
    description: story.metaDescription ?? story.excerpt,
  };
}

export default async function StoryDetailPage({ params }: StoryParams) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) notFound();

  // "Increment" views locally for the mock — real counter lives in the API.
  const views = story.views + 1;

  const moreStories = MOCK_STORIES.filter(
    (s) => s.slug !== story.slug && s.status === "PUBLISHED"
  ).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero */}
      <section className="relative h-[52vh] min-h-[340px] w-full">
        <Image
          src={story.coverImage}
          alt={story.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        {/* Back link */}
        <div className="absolute top-5 left-5 sm:left-8">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-background/70 backdrop-blur-sm border-background/20 text-foreground"
          >
            <Link href="/stories">
              <ArrowLeft className="w-4 h-4 mr-1" /> All stories
            </Link>
          </Button>
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-background/90 text-foreground backdrop-blur-sm">
                {story.category}
              </Badge>
              {story.featured && (
                <Badge className="bg-primary text-primary-foreground">
                  Featured
                </Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {story.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Meta bar */}
      <section className="border-b border-border/20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={story.author?.avatar}
                alt={story.author?.name}
              />
              <AvatarFallback className="text-xs">
                {story.author?.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium text-foreground">
              {story.author?.name}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {getPublishedLabel(story.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {story.readTime} min read
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            {views.toLocaleString()} views
          </span>
        </div>
      </section>

      {/* Body */}
      <section className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 italic">
            {story.excerpt}
          </p>

          {/* Rich content */}
          {story.content ? (
            <div
              className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-foreground/85 prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: story.content }}
            />
          ) : (
            <div className="prose prose-slate max-w-none prose-p:text-foreground/85 prose-p:leading-relaxed">
              <p>
                {story.title}. This story is part of our community journal at
                editmytrips — real experiences from real travellers across
                India.
              </p>
              <h2>A journey worth remembering</h2>
              <p>
                Every trip with editmytrips is built around moments like the
                ones in this story: sunrise over a Himalayan ridge, a village
                that welcomes strangers like family, a river that carries your
                worries away. We plan the logistics; the magic happens on its
                own.
              </p>
              <p>
                Coming soon — a fully rich-text version of this article. For
                now, explore more stories from the trail or start planning your
                own adventure.
              </p>
            </div>
          )}

          {/* Tags */}
          {story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border/20">
              {story.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* More stories */}
      {moreStories.length > 0 && (
        <section className="py-14 bg-muted/30 border-t border-border/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">
                More from the journal
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/stories" className="gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {moreStories.map((s) => (
                <Link
                  key={s._id}
                  href={`/stories/${s.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border/30 bg-card shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={s.coverImage}
                      alt={s.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs text-muted-foreground mb-2">
                      {s.category}
                    </span>
                    <h3 className="font-bold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                      {s.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-4">
                      Read
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-14 bg-gradient-to-r from-brand-muted to-teal-muted">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Ready to write your own story?
          </h2>
          <p className="text-muted-foreground mb-6">
            Explore trips across India and make memories worth journaling.
          </p>
          <Button asChild size="lg">
            <Link href="/trips">
              Browse trips <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </section>
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