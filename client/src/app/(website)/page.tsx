import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Search, Shield, Users, Star, Clock, Award, Sparkles } from "lucide-react";
import { TripCard } from "@/components/travel/TripCard";
import { DestinationCard } from "@/components/travel/DestinationCard";
import { ExperienceCard } from "@/components/travel/ExperienceCard";
import { TravellerCard } from "@/components/travel/TravellerCard";
import { getFeaturedTrips, getTrendingTrips, getFeaturedDestinations, MOCK_EXPERIENCES, MOCK_STORIES, MOCK_CUSTOMERS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const featuredTrips = getFeaturedTrips().slice(0, 3);
  const trendingTrips = getTrendingTrips().slice(0, 3);
  const featuredDestinations = getFeaturedDestinations().slice(0, 4);
  const experiences = MOCK_EXPERIENCES.slice(0, 4);
  const stories = MOCK_STORIES.filter(s => s.featured).slice(0, 3);
  const travellers = MOCK_CUSTOMERS.slice(0, 6);

  const trustSignals = [
    { icon: Shield, title: "Verified Captains", desc: "Every trip led by certified, background-checked captains with 5+ years experience" },
    { icon: Users, title: "10,000+ Happy Travellers", desc: "Join a community of explorers who've discovered India's hidden gems with us" },
    { icon: Star, title: "4.9/5 Average Rating", desc: "Consistently rated exceptional across Google, TripAdvisor, and our platform" },
    { icon: Award, title: "Safety First", desc: "Medical kits, emergency protocols, and 24/7 support on every departure" },
  ];

  return (
    <div className="flex flex-col">
      {/* ============================================================
           HERO SECTION
      ============================================================= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1920&q=80"
            alt="Himalayan mountains"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/90" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 text-balance">
              Go Beyond the
              <br />
              <span className="brand-gradient-text">Ordinary</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Handcrafted adventures across India's most spectacular landscapes. 
              Small groups. Trusted captains. Memories that last a lifetime.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-3xl mx-auto mb-16">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-border/20 shadow-xl p-1 md:p-2">
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 p-4 md:p-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Where do you want to go? Manali, Spiti, Rishikesh..."
                      className="w-full pl-12 pr-4 py-3 bg-background/50 border border-border/30 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <select className="w-full pl-12 pr-12 py-3 bg-background/50 border border-border/30 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none cursor-pointer">
                      <option value="">Any Trip Type</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Trek">Trekking</option>
                      <option value="Backpacking">Backpacking</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Road Trip">Road Trip</option>
                    </select>
                  </div>
                  <Button size="lg" className="w-full md:w-auto py-3 px-8 text-lg font-semibold gap-2" asChild>
                    <Link href="/explore">
                      Search Trips
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
              <div>
                <p className="text-3xl sm:text-4xl font-bold brand-gradient-text">10,000+</p>
                <p className="text-sm text-muted-foreground">Travellers</p>
              </div>
              <div className="border-l border-border/30 pl-8 md:pl-16">
                <p className="text-3xl sm:text-4xl font-bold brand-gradient-text">32+</p>
                <p className="text-sm text-muted-foreground">Handcrafted Trips</p>
              </div>
              <div className="border-l border-border/30 pl-8 md:pl-16">
                <p className="text-3xl sm:text-4xl font-bold brand-gradient-text">4.9/5</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="w-6 h-6 text-primary rotate-90" />
        </div>
      </section>

      {/* ============================================================
           TRENDING TRIPS
      ============================================================= */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Trending This Season</h2>
              <p className="text-muted-foreground mt-2">Our most popular trips right now — selling fast!</p>
            </div>
            <Button variant="outline" size="lg" asChild className="gap-2">
              <Link href="/trips?sort=popular">View All Trending</Link>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingTrips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
           POPULAR DESTINATIONS
      ============================================================= */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Popular Destinations</h2>
              <p className="text-muted-foreground mt-2">Explore India's most spectacular regions</p>
            </div>
            <Button variant="outline" size="lg" asChild className="gap-2">
              <Link href="/destinations">View All Destinations</Link>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((dest) => (
              <DestinationCard key={dest._id} destination={dest} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
           EXPERIENCES
      ============================================================= */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Curated Experiences</h2>
              <p className="text-muted-foreground mt-2">Add unique activities to your trip — from sunrise treks to heritage walks</p>
            </div>
            <Button variant="outline" size="lg" asChild className="gap-2">
              <Link href="/experiences">View All Experiences</Link>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {experiences.map((exp) => (
              <ExperienceCard key={exp._id} experience={exp} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
           STORIES / BLOG
      ============================================================= */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Stories from the Trail</h2>
              <p className="text-muted-foreground mt-2">Real experiences, travel tips, and inspiration from our community</p>
            </div>
            <Button variant="outline" size="lg" asChild className="gap-2">
              <Link href="/stories">Read All Stories</Link>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((story) => (
              <Link key={story._id} href={`/stories/${story.slug}`} className="group">
                <div className="relative overflow-hidden rounded-2xl border border-border/20 bg-background/50 hover:shadow-lg transition-all">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={story.coverImage}
                      alt={story.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary-foreground bg-primary px-3 py-1 rounded-full">
                        {story.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <span>{story.readTime} min read</span>
                      <span>•</span>
                      <span>{story.views.toLocaleString()} views</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{story.excerpt}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {story.author?.name?.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{story.author?.name}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
           COMMUNITY / TRAVELLER PHOTOS
      ============================================================= */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Our Community in Action</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Real moments from real travellers. Tag @editmytrips to be featured!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {travellers.map((traveller, idx) => (
              <TravellerCard key={traveller._id} user={traveller} tripsCount={Math.floor(Math.random() * 8) + 1} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild className="gap-2">
              <Link href="/community">Join the Community</Link>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================
           TRUST SIGNALS (WHY EDITMYTRIPS)
      ============================================================= */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Why Choose editmytrips?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              We're not just another travel company. We're a community of explorers 
              who believe the best journeys change you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustSignals.map((signal, idx) => (
              <div 
                key={signal.title}
                className="p-8 rounded-2xl border border-border/20 bg-background/50 hover:border-primary/30 hover:shadow-lg transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <signal.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3">{signal.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{signal.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
           CTA BANNER
      ============================================================= */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-brand to-teal">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative p-12 md:p-20 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready for Your Next Adventure?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Browse our handcrafted trips, pick a departure date, and join a group 
                of like-minded explorers. Your story starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="w-full sm:w-auto px-10 py-4 text-lg font-semibold gap-2 bg-white text-primary hover:bg-white/90" asChild>
                  <Link href="/explore">
                    Find Your Trip
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto px-10 py-4 text-lg font-semibold border-white text-white hover:bg-white/10" asChild>
                  <Link href="/destinations">
                    Browse Destinations
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}