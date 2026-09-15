import type { TripDifficulty, TripType } from "@/types";

// ── Site Config ───────────────────────────────

export const SITE = {
  name: "GetSet Junction",
  tagline: "Go Beyond the Ordinary",
  description:
    "India's most adventurous travel community. Handcrafted trips, trusted captains, and memories that last a lifetime.",
  url: "https://getsetjunction.com",
  email: "hello@getsetjunction.com",
  phone: "+91 98765 43210",
  whatsapp: "+919876543210",
  address: "Mumbai, Maharashtra, India",
  social: {
    instagram: "https://instagram.com/getsetjunction",
    youtube: "https://youtube.com/@getsetjunction",
    facebook: "https://facebook.com/getsetjunction",
    twitter: "https://twitter.com/getsetjunction",
  },
} as const;

// ── Navigation ────────────────────────────────

export const NAV_LINKS = [
  { label: "Explore", href: "/explore" },
  { label: "Trips", href: "/trips" },
  { label: "Destinations", href: "/destinations" },
  { label: "Experiences", href: "/experiences" },
  { label: "Stories", href: "/stories" },
  { label: "Community", href: "/community" },
] as const;

export const FOOTER_LINKS = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/stories" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "/contact" },
  ],
  trips: [
    { label: "Adventure Trips", href: "/trips?type=Adventure" },
    { label: "Treks & Hikes", href: "/trips?type=Trek" },
    { label: "Road Trips", href: "/trips?type=Road+Trip" },
    { label: "Backpacking", href: "/trips?type=Backpacking" },
    { label: "Group Tours", href: "/trips" },
  ],
  destinations: [
    { label: "Himachal Pradesh", href: "/destinations/himachal-pradesh" },
    { label: "Uttarakhand", href: "/destinations/uttarakhand" },
    { label: "Rajasthan", href: "/destinations/rajasthan" },
    { label: "Kerala", href: "/destinations/kerala" },
    { label: "Goa", href: "/destinations/goa" },
  ],
  support: [
    { label: "FAQs", href: "/faqs" },
    { label: "Cancellation Policy", href: "/cancellation-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
} as const;

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
  Easy: "bg-green-100 text-green-700",
  Moderate: "bg-yellow-100 text-yellow-700",
  Challenging: "bg-orange-100 text-orange-700",
  Extreme: "bg-red-100 text-red-700",
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
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
  REFUNDED: "bg-purple-100 text-purple-700 border-purple-200",
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  PAID: "bg-green-100 text-green-700 border-green-200",
  FAILED: "bg-red-100 text-red-700 border-red-200",
  REFUNDED: "bg-purple-100 text-purple-700 border-purple-200",
};

export const DEPARTURE_STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600 border-gray-200",
  ACTIVE: "bg-green-100 text-green-700 border-green-200",
  CLOSED: "bg-orange-100 text-orange-700 border-orange-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
};

// ── Tax ───────────────────────────────────────

export const GST_RATE = 0.05; // 5% GST on travel packages

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
  "Trip Report",
  "Adventure",
  "Culture",
  "Food & Cuisine",
  "Photography",
  "Budget Travel",
  "Solo Travel",
  "Family Travel",
] as const;
