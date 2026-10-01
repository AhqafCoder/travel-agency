"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  section?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  // Content
  { label: "Trips", href: "/admin/trips", icon: Map, section: "Content" },
  { label: "Departures", href: "/admin/departures", icon: Calendar, section: "Content" },
  { label: "Destinations", href: "/admin/destinations", icon: MapPin, section: "Content" },
  { label: "Experiences", href: "/admin/experiences", icon: Sparkles, section: "Content" },
  { label: "Stories", href: "/admin/stories", icon: BookMarked, section: "Content" },
  { label: "Media", href: "/admin/media", icon: Image, section: "Content" },
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

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const sections = ["Content", "Operations", "Marketing", "Finance", "System"];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    router.push("/");
  };

  return (
      <aside
        className={cn(
          "flex flex-col border-r border-white/10 bg-[#111] transition-all duration-300 relative shrink-0",
          collapsed ? "w-[64px]" : "w-[240px]"
        )}
      >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-white/5 border border-white/10 flex items-center justify-center">
          <Image
            src="/image.png"
            alt="Logo"
            fill
            className="object-contain p-1"
          />
        </div>
        {!collapsed && (
          <span className="text-white font-bold text-sm tracking-tight truncate">
            editmytrips
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {/* Dashboard first (no section) */}
        {navItems
          .filter((i) => !i.section)
          .map((item) => (
            <NavLink key={item.href} item={item} collapsed={collapsed} active={isActive(item.href)} />
          ))}

        {/* Sectioned items */}
        {sections.map((section) => {
          const sectionItems = navItems.filter((i) => i.section === section);
          if (!sectionItems.length) return null;
          return (
            <div key={section} className="pt-3">
              {!collapsed && (
                <p className="px-3 pb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {section}
                </p>
              )}
              {collapsed && <div className="border-t border-white/10 mx-2 mb-1" />}
              {sectionItems.map((item) => (
                <NavLink key={item.href} item={item} collapsed={collapsed} active={isActive(item.href)} />
              ))}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-white/10">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0a0f1e] border border-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </aside>
  );
}

function NavLink({
  item,
  collapsed,
  active,
}: {
  item: NavItem;
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
        collapsed && "justify-center",
        active
          ? "bg-orange-500/15 text-orange-400 font-medium"
          : "text-slate-400 hover:text-white hover:bg-white/5"
      )}
      title={collapsed ? item.label : undefined}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}
