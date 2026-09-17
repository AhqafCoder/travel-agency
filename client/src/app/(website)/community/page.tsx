import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  Star,
  ArrowRight,
  CheckCircle2,
  Camera,
  MapPin,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MOCK_REVIEWS, MOCK_CUSTOMERS, MOCK_STORIES } from "@/lib/mock-data";
import { Review } from "@/types";

export const metadata: Metadata = {
  title: "Community | editmytrips",
  description:
    "Traveller photos, trip reviews, and stories from the editmytrips community.",
};

const COMMUNITY_PHOTOS = [
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80",
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80",
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );
}

export default function CommunityPage() {
  const reviews = MOCK_REVIEWS.filter((r) => r.status === "APPROVED").slice(0, 6);
  const travellers = MOCK_CUSTOMERS.slice(0, 6);
  const story = MOCK_STORIES[0];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted/30 border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Badge className="bg-teal text-teal-foreground mb-4">
            <Users className="w-3 h-3 mr-1" /> 25,000+ explorers
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
            The editmytrips Community
          </h1>
          <p className="text-lg text-muted-foreground mt-3 max-w-2xl">
            Solo travellers, friends, and families — thousands of people have
            gone beyond the ordinary with us. Here&apos;s what they have to say.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {/* Traveller photo wall */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              From the Trail
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COMMUNITY_PHOTOS.map((src, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-2xl overflow-hidden group"
              >
                <Image
                  src={src}
                  alt={`Community photo ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="absolute bottom-2 left-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  @editmytrips
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Traveller cards */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Meet the Travellers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {travellers.map((t, i) => (
              <div
                key={t._id}
                className="flex items-center gap-3 p-4 rounded-xl border border-border/20 bg-card hover:shadow-md transition-shadow"
              >
                <Avatar className="w-11 h-11 border border-border/20">
                  <AvatarImage src={t.avatar} alt={t.name} />
                  <AvatarFallback>{t.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(i % 3) + 1} trip{(i % 3) + 1 > 1 ? "s" : ""} with us
                  </p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Trip Reviews
            </h2>
            <Link
              href="/trips"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              Book your own trip <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <ReviewCardInline key={review._id} review={review} />
            ))}
          </div>
        </section>

        {/* Story CTA */}
        {story && (
          <section className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src={story.coverImage}
                alt={story.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
            </div>
            <div className="relative p-10 md:p-14 max-w-xl">
              <Badge className="bg-primary text-primary-foreground mb-4">
                {story.category}
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug">
                {story.title}
              </h2>
              <p className="text-muted-foreground mt-3 line-clamp-2">
                {story.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={`/stories/${story.slug}`}>
                    Read the story <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="bg-background/60 backdrop-blur-sm">
                  <Link href="/stories">More stories</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ReviewCardInline({ review }: { review: Review }) {
  return (
    <div className="flex flex-col p-6 rounded-2xl border border-border/20 bg-card shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="w-10 h-10 border border-border/20">
          <AvatarImage src={review.user?.avatar} alt={review.user?.name} />
          <AvatarFallback className="text-xs">
            {review.user?.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">
            {review.user?.name}
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Stars rating={review.rating} />
            <span className="ml-1">• {review.trip?.title}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 flex-1">
        &ldquo;{review.content}&rdquo;
      </p>
      {review.verifiedBooking && (
        <div className="mt-4 inline-flex items-center gap-1 text-xs text-teal font-medium">
          <CheckCircle2 className="w-4 h-4" /> Verified traveller
        </div>
      )}
    </div>
  );
}