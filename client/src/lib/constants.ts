import type { TripDifficulty, TripType } from "@/types";

// ── Site Config ───────────────────────────────

export const SITE = {
  name: "EditMyTrips",
  tagline: "Edit Your Trip. Create Your Story.",
  description:
    "We don't just sell trips — we craft experiences. Curated adventures across India's most spectacular landscapes, edited to fit you perfectly.",
  url: "https://editmytrips.com",
  email: "hello@editmytrips.com",
  phone: "+91 87555 77146",
  whatsapp: "+918755577146",
  address: "2nd Floor, D Tower, Above Deepak Sweets, Krishna Vanti Colony, Bareilly, Uttar Pradesh – 243001",
  social: {
    instagram: "https://instagram.com/editmytrips",
    facebook: "https://www.facebook.com/profile.php?id=61575187543626",
    whatsapp: "https://wa.me/918755577146",
  },
} as const;

// ── Navigation ────────────────────────────────

export const NAV_LINKS = [
  { label: "Explore Trips", href: "/trips" },
  { label: "Destinations", href: "/destinations" },
  { label: "Experiences", href: "/experiences" },
  { label: "Past Trips", href: "/stories" },
  { label: "About Us", href: "/about" },
] as const;

export const FOOTER_LINKS = {
  explore: [
    { label: "All Trips", href: "/trips" },
    { label: "Destinations", href: "/destinations" },
    { label: "Experiences", href: "/experiences" },
    { label: "Past Trips", href: "/stories" },
    { label: "Explore", href: "/explore" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "FAQs", href: "/faqs" },
    { label: "Careers", href: "/careers" },
  ],
  destinations: [
    { label: "Himachal Edit", href: "/destinations/manali" },
    { label: "Uttarakhand Edit", href: "/destinations/rishikesh" },
    { label: "Kashmir Edit", href: "/destinations/kashmir" },
    { label: "Goa Edit", href: "/destinations/goa" },
    { label: "North East Edit", href: "/destinations/meghalaya" },
    { label: "Ladakh Edit", href: "/destinations/spiti-valley" },
  ],
  support: [
    { label: "Cancellation Policy", href: "/cancellation-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
} as const;

// ── Destination Edits (homepage categories) ──

export const DESTINATION_EDITS = [
  {
    label: "Himachal Edit",
    slug: "manali",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
    count: 14,
    state: "Himachal Pradesh",
  },
  {
    label: "Kashmir Edit",
    slug: "kashmir",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800&q=80",
    count: 9,
    state: "Jammu & Kashmir",
  },
  {
    label: "Uttarakhand Edit",
    slug: "rishikesh",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80",
    count: 11,
    state: "Uttarakhand",
  },
  {
    label: "Ladakh Edit",
    slug: "spiti-valley",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
    count: 8,
    state: "Ladakh",
  },
  {
    label: "Goa Edit",
    slug: "goa",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    count: 9,
    state: "Goa",
  },
  {
    label: "North East Edit",
    slug: "meghalaya",
    image: "https://images.unsplash.com/photo-1601134467661-3d775b999c0b?w=800&q=80",
    count: 7,
    state: "Meghalaya",
  },
  {
    label: "Rajasthan Edit",
    slug: "rajasthan",
    image: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
    count: 6,
    state: "Rajasthan",
  },
  {
    label: "Kerala Edit",
    slug: "kerala",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
    count: 5,
    state: "Kerala",
  },
] as const;

// ── Experience Categories ─────────────────────

export const EXPERIENCE_CATEGORIES = [
  { label: "Adventure", icon: "⛰️", desc: "Push your limits", color: "from-orange-500/20 to-red-500/20" },
  { label: "Curated", icon: "✨", desc: "Handpicked moments", color: "from-amber-500/20 to-yellow-500/20" },
  { label: "Peace", icon: "🌿", desc: "Find your calm", color: "from-green-500/20 to-emerald-500/20" },
  { label: "Backpacking", icon: "🎒", desc: "Travel light, live full", color: "from-blue-500/20 to-cyan-500/20" },
  { label: "Luxury", icon: "💎", desc: "The finest experiences", color: "from-purple-500/20 to-violet-500/20" },
  { label: "Road Trips", icon: "🛣️", desc: "The journey is the destination", color: "from-yellow-500/20 to-orange-500/20" },
  { label: "Nature", icon: "🏔️", desc: "Into the wild", color: "from-teal-500/20 to-green-500/20" },
  { label: "Weekend Escapes", icon: "🌅", desc: "Quick, memorable getaways", color: "from-pink-500/20 to-rose-500/20" },
] as const;

// ── Homepage FAQ ─────────────────────────────

export const HOMEPAGE_FAQS = [
  {
    q: "How do I book a trip?",
    a: "Browse our trips, select your preferred departure date, and click 'Book Now'. You'll go through a quick 3-step booking flow — select dates, add traveller details, and confirm payment. Alternatively, use 'Customize Your Trip' to tailor a package to your needs.",
  },
  {
    q: "Can I customize a package?",
    a: "Absolutely. Every trip on EditMyTrips can be customized. Tell us your group size, preferred dates, accommodation type, activities, and budget — we'll craft a trip that fits you perfectly.",
  },
  {
    q: "What is included in the package price?",
    a: "Each package page clearly lists inclusions (accommodation, transport, meals, activities, guide, etc.) and exclusions (flights, insurance, personal expenses). Check the 'Inclusions' tab on any trip page.",
  },
  {
    q: "What is the cancellation policy?",
    a: "Cancellations made 7+ days before departure receive a full refund. Cancellations within 7 days are subject to a partial refund as per our cancellation policy. Customized trips may have different terms.",
  },
  {
    q: "Can I travel solo?",
    a: "Yes! We welcome solo travellers on all our group trips. It's one of the best ways to meet like-minded people. We also offer solo-specific customized itineraries on request.",
  },
  {
    q: "How do I contact EditMyTrips?",
    a: "You can reach us via WhatsApp, email, or phone. We're available Monday–Saturday, 10am–7pm IST. For urgent matters, WhatsApp is the fastest channel.",
  },
] as const;

// ── Admin Navigation ──────────────────────────

export const ADMIN_NAV = [
  {
    section: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: "LayoutDashboard" }],
  },
  {
    section: "Content",
    items: [
      { label: "Trips", href: "/admin/trips", icon: "MapPin" },
      { label: "Destinations", href: "/admin/destinations", icon: "Globe" },
      { label: "Experiences", href: "/admin/experiences", icon: "Sparkles" },
      { label: "Stories", href: "/admin/stories", icon: "BookOpen" },
      { label: "Media", href: "/admin/media", icon: "Image" },
    ],
  },
  {
    section: "Operations",
    items: [
      { label: "Bookings", href: "/admin/bookings", icon: "CalendarCheck" },
      { label: "Departures", href: "/admin/departures", icon: "Navigation" },
      { label: "Trip Captains", href: "/admin/captains", icon: "Users" },
      { label: "Customers", href: "/admin/customers", icon: "UserCircle" },
    ],
  },
  {
    section: "Marketing",
    items: [
      { label: "Coupons", href: "/admin/coupons", icon: "Tag" },
      { label: "Notifications", href: "/admin/notifications", icon: "Bell" },
    ],
  },
  {
    section: "Finance",
    items: [
      { label: "Payments", href: "/admin/payments", icon: "CreditCard" },
    ],
  },
  {
    section: "Community",
    items: [
      { label: "Reviews", href: "/admin/reviews", icon: "Star" },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: "Settings" },
      { label: "Audit Logs", href: "/admin/audit-logs", icon: "ClipboardList" },
    ],
  },
] as const;

// ── Trip Options ──────────────────────────────

export const TRIP_TYPES: TripType[] = [
  "Adventure",
  "Cultural",
  "Wildlife",
  "Beach",
  "Pilgrimage",
  "Backpacking",
  "Luxury",
  "Road Trip",
  "Trek",
  "Workation",
];

export const TRIP_DIFFICULTIES: TripDifficulty[] = [
  "Easy",
  "Moderate",
  "Challenging",
  "Extreme",
];

export const DIFFICULTY_COLORS: Record<TripDifficulty, string> = {
  Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  Moderate: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Challenging: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  Extreme: "bg-red-500/15 text-red-400 border-red-500/20",
};

export const DURATION_OPTIONS = [
  { label: "Weekend (1-3 days)", min: 1, max: 3 },
  { label: "Short (4-6 days)", min: 4, max: 6 },
  { label: "Week (7-10 days)", min: 7, max: 10 },
  { label: "Long (11+ days)", min: 11, max: 30 },
];

export const PRICE_RANGES = [
  { label: "Under ₹5,000", min: 0, max: 4999 },
  { label: "₹5,000 – ₹10,000", min: 5000, max: 10000 },
  { label: "₹10,000 – ₹20,000", min: 10000, max: 20000 },
  { label: "₹20,000 – ₹40,000", min: 20000, max: 40000 },
  { label: "₹40,000+", min: 40000, max: 999999 },
];

export const SORT_OPTIONS = [
  { label: "Most Popular", value: "popular" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Highest Rated", value: "rating" },
] as const;

// ── Booking ───────────────────────────────────

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  REFUNDED: "Refunded",
};

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  CONFIRMED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  CANCELLED: "bg-red-500/15 text-red-400 border-red-500/20",
  COMPLETED: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  REFUNDED: "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  PAID: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  FAILED: "bg-red-500/15 text-red-400 border-red-500/20",
  REFUNDED: "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

export const DEPARTURE_STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  ACTIVE: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  CLOSED: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  CANCELLED: "bg-red-500/15 text-red-400 border-red-500/20",
  COMPLETED: "bg-blue-500/15 text-blue-400 border-blue-500/20",
};

// ── Tax ───────────────────────────────────────
export const GST_RATE = 0.05;

// ── Pagination ────────────────────────────────
export const DEFAULT_PAGE_SIZE = 12;
export const ADMIN_PAGE_SIZE = 20;

// ── Media ─────────────────────────────────────
export const MEDIA_FOLDERS = [
  "trips",
  "destinations",
  "experiences",
  "stories",
  "community",
  "captains",
  "misc",
] as const;

// ── Story Categories ──────────────────────────
export const STORY_CATEGORIES = [
  "Travel Tips",
  "Destination Guide",
  "Trip Recap",
  "Gear & Packing",
  "Food & Culture",
  "Photography",
  "Solo Travel",
  "Budget Travel",
  "Adventure",
  "Wellness",
] as const;
