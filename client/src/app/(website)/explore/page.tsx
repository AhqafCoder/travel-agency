"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { TripCard } from "@/components/travel/TripCard";
import type { Trip } from "@/types";
import { TRIP_TYPES, TRIP_DIFFICULTIES, DURATION_OPTIONS, PRICE_RANGES, SORT_OPTIONS } from "@/lib/constants";
import { MOCK_TRIPS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, Filter, SlidersHorizontal, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExplorePageFallback />}>
      <ExplorePageContent />
    </Suspense>
  );
}

function ExplorePageFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading trips...</p>
      </div>
    </div>
  );
}

function ExplorePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse URL params to initial state
  const initialSearch = searchParams.get("search") || "";
  const initialType = searchParams.get("type") || "";
  const initialDifficulty = searchParams.get("difficulty") || "";
  const initialDestination = searchParams.get("destination") || "";
  const initialMinPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0;
  const initialMaxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 999999;
  const initialMinDuration = searchParams.get("minDuration") ? Number(searchParams.get("minDuration")) : 1;
  const initialMaxDuration = searchParams.get("maxDuration") ? Number(searchParams.get("maxDuration")) : 30;
  const initialSort = searchParams.get("sort") || "popular";

  const [search, setSearch] = useState(initialSearch);
  const [tripType, setTripType] = useState(initialType);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [destination, setDestination] = useState(initialDestination);
  const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice]);
  const [durationRange, setDurationRange] = useState<[number, number]>([initialMinDuration, initialMaxDuration]);
  const [sort, setSort] = useState(initialSort);
  const [showFilters, setShowFilters] = useState(false);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);

  // Update URL when filters change
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (tripType) params.set("type", tripType);
    if (difficulty) params.set("difficulty", difficulty);
    if (destination) params.set("destination", destination);
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 999999) params.set("maxPrice", priceRange[1].toString());
    if (durationRange[0] > 1) params.set("minDuration", durationRange[0].toString());
    if (durationRange[1] < 30) params.set("maxDuration", durationRange[1].toString());
    if (sort !== "popular") params.set("sort", sort);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [search, tripType, difficulty, destination, priceRange, durationRange, sort, router, pathname]);

  // Filter trips based on current state
  useEffect(() => {
    let result = [...MOCK_TRIPS].filter(trip => trip.status === "PUBLISHED");

    if (search) {
      const query = search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.shortDescription.toLowerCase().includes(query) ||
        t.destination?.name.toLowerCase().includes(query) ||
        t.tripType.toLowerCase().includes(query)
      );
    }

    if (tripType) result = result.filter(t => t.tripType === tripType);
    if (difficulty) result = result.filter(t => t.difficulty === difficulty);
    if (destination) result = result.filter(t => t.destinationId === destination);

    // Price filter (using discountedPrice or basePrice)
    result = result.filter(t => {
      const price = t.discountedPrice || t.basePrice;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Duration filter
    result = result.filter(t => t.durationDays >= durationRange[0] && t.durationDays <= durationRange[1]);

    // Sort
    switch (sort) {
      case "price_asc":
        result.sort((a, b) => (a.discountedPrice || a.basePrice) - (b.discountedPrice || b.basePrice));
        break;
      case "price_desc":
        result.sort((a, b) => (b.discountedPrice || b.basePrice) - (a.discountedPrice || a.basePrice));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default: // popular
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    setFilteredTrips(result);
  }, [search, tripType, difficulty, destination, priceRange, durationRange, sort]);

  // Sync URL changes to state (for browser back/forward)
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setTripType(searchParams.get("type") || "");
    setDifficulty(searchParams.get("difficulty") || "");
    setDestination(searchParams.get("destination") || "");
    setPriceRange([
      searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0,
      searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 999999,
    ]);
    setDurationRange([
      searchParams.get("minDuration") ? Number(searchParams.get("minDuration")) : 1,
      searchParams.get("maxDuration") ? Number(searchParams.get("maxDuration")) : 30,
    ]);
    setSort(searchParams.get("sort") || "popular");
  }, [searchParams]);

  // Active filter count
  const activeFilters = [
    search,
    tripType,
    difficulty,
    destination,
    priceRange[0] > 0,
    priceRange[1] < 999999,
    durationRange[0] > 1,
    durationRange[1] < 30,
    sort !== "popular",
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearch("");
    setTripType("");
    setDifficulty("");
    setDestination("");
    setPriceRange([0, 999999]);
    setDurationRange([1, 30]);
    setSort("popular");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-muted/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-foreground">Explore Trips</h1>
          <p className="text-muted-foreground mt-2">
            Find your perfect adventure. Filter by type, difficulty, price, and more.
          </p>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-72 flex-shrink-0 p-6 border-r border-border/20 bg-background/50 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Filters</h2>
            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-primary hover:text-primary/80">
                <X className="w-3.5 h-3.5 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          {/* Search */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search trips..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Trip Type */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">Trip Type</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {TRIP_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={tripType === type}
                    onCheckedChange={() => setTripType(tripType === type ? "" : type)}
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Difficulty */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">Difficulty</Label>
            <div className="space-y-2">
              {TRIP_DIFFICULTIES.map((d) => (
                <label key={d} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={difficulty === d}
                    onCheckedChange={() => setDifficulty(difficulty === d ? "" : d)}
                  />
                  <Badge variant="secondary" className={cn(
                    d === "Easy" && "bg-green-100 text-green-700",
                    d === "Moderate" && "bg-yellow-100 text-yellow-700",
                    d === "Challenging" && "bg-orange-100 text-orange-700",
                    d === "Extreme" && "bg-red-100 text-red-700"
                  )}>
                    {d}
                  </Badge>
                </label>
              ))}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Price Range */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">
              Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
            </Label>
            <div className="space-y-2">
              {PRICE_RANGES.map((range) => (
                <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={priceRange[0] === range.min && priceRange[1] === range.max}
                    onCheckedChange={() => setPriceRange(priceRange[0] === range.min && priceRange[1] === range.max ? [0, 999999] : [range.min, range.max])}
                  />
                  <span className="text-sm">{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Duration */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">Duration</Label>
            <div className="space-y-2">
              {DURATION_OPTIONS.map((opt) => (
                <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={durationRange[0] === opt.min && durationRange[1] === opt.max}
                    onCheckedChange={() => setDurationRange(durationRange[0] === opt.min && durationRange[1] === opt.max ? [1, 30] : [opt.min, opt.max])}
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Sort */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">Sort By</Label>
            <Select value={sort} onValueChange={(v) => setSort(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="w-full gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Filters {activeFilters > 0 && <Badge variant="secondary">{activeFilters}</Badge>}
            </Button>
          </div>

          {/* Mobile Filters Drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-background p-6 overflow-y-auto">
              <div className="max-w-sm mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                {/* Search */}
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">Search</Label>
                  <Input
                    type="text"
                    placeholder="Search trips..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Separator className="mb-4" />
                {/* Trip Type */}
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">Trip Type</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {TRIP_TYPES.map((type) => (
                      <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={tripType === type}
                          onCheckedChange={() => setTripType(tripType === type ? "" : type)}
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Separator className="mb-4" />
                {/* Difficulty */}
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">Difficulty</Label>
                  <div className="space-y-2">
                    {TRIP_DIFFICULTIES.map((d) => (
                      <label key={d} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={difficulty === d}
                          onCheckedChange={() => setDifficulty(difficulty === d ? "" : d)}
                        />
                        <Badge variant="secondary" className={cn(
                          d === "Easy" && "bg-green-100 text-green-700",
                          d === "Moderate" && "bg-yellow-100 text-yellow-700",
                          d === "Challenging" && "bg-orange-100 text-orange-700",
                          d === "Extreme" && "bg-red-100 text-red-700"
                        )}>
                          {d}
                        </Badge>
                      </label>
                    ))}
                  </div>
                </div>
                <Separator className="mb-4" />
                {/* Price Range */}
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">
                    Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                  </Label>
                  <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                      <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={priceRange[0] === range.min && priceRange[1] === range.max}
                          onCheckedChange={() => setPriceRange(priceRange[0] === range.min && priceRange[1] === range.max ? [0, 999999] : [range.min, range.max])}
                        />
                        <span className="text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Separator className="mb-4" />
                {/* Duration */}
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">Duration</Label>
                  <div className="space-y-2">
                    {DURATION_OPTIONS.map((opt) => (
                      <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={durationRange[0] === opt.min && durationRange[1] === opt.max}
                          onCheckedChange={() => setDurationRange(durationRange[0] === opt.min && durationRange[1] === opt.max ? [1, 30] : [opt.min, opt.max])}
                        />
                        <span className="text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Separator className="mb-4" />
                {/* Sort */}
                <div className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">Sort By</Label>
                  <Select value={sort} onValueChange={(v) => setSort(v ?? "")}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {activeFilters > 0 && (
                  <Button variant="outline" className="w-full mt-4" onClick={clearAllFilters}>
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">
                {filteredTrips.length} {filteredTrips.length === 1 ? "trip" : "trips"} found
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-48">
              <Select value={sort} onValueChange={(v) => setSort(v ?? "")}> 
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort" />
                  <ChevronDown className="w-4 h-4" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Trip Grid */}
          {filteredTrips.length === 0 ? (
            <div className="text-center py-20">
              <Filter className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No trips found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
              <Button onClick={clearAllFilters}>Clear All Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          )}

          {/* Pagination (placeholder) */}
          {filteredTrips.length > 12 && (
            <div className="mt-10 flex justify-center gap-2">
              <Button variant="outline" size="icon"><ChevronDown className="w-4 h-4 rotate-180" /></Button>
              <Button variant="default" className="w-10 h-10">1</Button>
              <Button variant="outline" className="w-10 h-10">2</Button>
              <Button variant="outline" className="w-10 h-10">3</Button>
              <Button variant="outline" size="icon"><ChevronDown className="w-4 h-4" /></Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}