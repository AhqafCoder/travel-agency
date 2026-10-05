import {
  LayoutDashboard,
  Map,
  Calendar,
  BookOpen,
  Users,
  UserCheck,
  MapPin,
  Sparkles,
  BookMarked,
  Image as ImageIcon,
  Tag,
  CreditCard,
  Star,
  Settings,
  MessageSquare,
  Bell,
  type LucideIcon,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  section?: string;
}

/** Single source of truth for the admin sidebar + header titles. */
export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  // Content
  { label: "Trips", href: "/admin/trips", icon: Map, section: "Content" },
  { label: "Departures", href: "/admin/departures", icon: Calendar, section: "Content" },
  { label: "Destinations", href: "/admin/destinations", icon: MapPin, section: "Content" },
  { label: "Experiences", href: "/admin/experiences", icon: Sparkles, section: "Content" },
  { label: "Stories", href: "/admin/stories", icon: BookMarked, section: "Content" },
  { label: "Media", href: "/admin/media", icon: ImageIcon, section: "Content" },
  // Operations
  { label: "Enquiry Leads", href: "/admin/leads", icon: MessageSquare, section: "Operations" },
  { label: "Bookings", href: "/admin/bookings", icon: BookOpen, section: "Operations" },
  { label: "Customers", href: "/admin/customers", icon: Users, section: "Operations" },
  { label: "Captains", href: "/admin/captains", icon: UserCheck, section: "Operations" },
  { label: "Reviews", href: "/admin/reviews", icon: Star, section: "Operations" },
  // Marketing
  { label: "Coupons", href: "/admin/coupons", icon: Tag, section: "Marketing" },
  { label: "Notifications", href: "/admin/notifications", icon: Bell, section: "Marketing" },
  // Finance
  { label: "Payments", href: "/admin/payments", icon: CreditCard, section: "Finance" },
  // System
  { label: "Settings", href: "/admin/settings", icon: Settings, section: "System" },
];

export const ADMIN_NAV_SECTIONS = [
  "Content",
  "Operations",
  "Marketing",
  "Finance",
  "System",
] as const;

/** Resolve the current page title from a pathname like /admin/trips/abc/edit. */
export function getAdminPageTitle(pathname: string): string {
  // Best-match: longest href that prefixes the pathname.
  const match = [...ADMIN_NAV_ITEMS]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname === item.href || pathname.startsWith(item.href + "/"));

  if (!match) return "Admin";
  if (pathname === match.href) return match.label;

  // Sub-routes of a section
  if (pathname === "/admin/trips/new") return "New Trip";
  if (/^\/admin\/trips\/[^/]+\/edit$/.test(pathname)) return "Edit Trip";
  if (pathname === "/admin/destinations/new") return "New Destination";
  if (/^\/admin\/destinations\/[^/]+\/edit$/.test(pathname)) return "Edit Destination";
  if (pathname === "/admin/experiences/new") return "New Experience";
  if (/^\/admin\/experiences\/[^/]+\/edit$/.test(pathname)) return "Edit Experience";
  if (pathname === "/admin/stories/new") return "New Story";
  if (/^\/admin\/stories\/[^/]+\/edit$/.test(pathname)) return "Edit Story";
  return match.label;
}
