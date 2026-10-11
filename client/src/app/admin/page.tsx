"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { api } from "@/lib/api";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  Users,
  Map,
  Calendar,
  Wallet,
  Plus,
  CalendarPlus,
  Tag,
  ImagePlus,
  ArrowRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const QUICK_ACTIONS = [
  { label: "New Trip", href: "/admin/trips/new", icon: Plus },
  { label: "Add Departure", href: "/admin/departures", icon: CalendarPlus },
  { label: "Create Coupon", href: "/admin/coupons", icon: Tag },
  { label: "Upload Media", href: "/admin/media", icon: ImagePlus },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return "Working late";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function AdminDashboardPage() {
  const { user, status } = useAuth();
  const authLoading = status === "loading";
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || !["SUPER_ADMIN", "ADMIN", "OPERATIONS"].includes(user.role))) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: () => api.adminGetDashboardStats(),
    enabled: !!user && ["SUPER_ADMIN", "ADMIN", "OPERATIONS"].includes(user.role),
  });

  const chartData = stats?.revenueChart ?? [];
  const recentBookings = stats?.recentBookings ?? [];
  const thisMonth = stats?.revenue?.thisMonth;

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[132px] rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-[380px] rounded-2xl lg:col-span-4" />
          <Skeleton className="h-[380px] rounded-2xl lg:col-span-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Greeting + quick actions ─────────────────── */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-display text-[26px] font-bold tracking-tight text-foreground">
            {greeting()}, {user?.name?.split(" ")[0]}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · Here's what's happening with editmytrips today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {QUICK_ACTIONS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-1.5 rounded-xl border border-black/[0.06] bg-white px-3.5 py-2 text-[13px] font-medium text-zinc-700 shadow-[0_1px_2px_rgba(16,24,40,0.05)] transition-all hover:border-orange-500/30 hover:text-[#e85a25] active:scale-[0.98]"
            >
              <Icon className="size-4 text-zinc-400" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`₹${(stats?.revenue?.total ?? 0).toLocaleString("en-IN")}`}
          icon={Wallet}
          trend={stats?.revenue?.trend || 0}
          hint={thisMonth ? `₹${thisMonth.toLocaleString("en-IN")} this month` : undefined}
        />
        <StatCard
          label="Bookings"
          value={stats?.bookings?.total ?? 0}
          icon={Calendar}
          trend={stats?.bookings?.trend || 0}
          hint={stats?.bookings?.pending ? `${stats.bookings.pending} awaiting confirmation` : undefined}
        />
        <StatCard
          label="Trips"
          value={stats?.trips?.total ?? 0}
          icon={Map}
          hint={
            stats?.trips
              ? `${stats.trips.published ?? 0} published · ${stats.trips.draft ?? 0} draft`
              : undefined
          }
        />
        <StatCard
          label="Customers"
          value={stats?.customers?.total ?? 0}
          icon={Users}
          trend={stats?.customers?.trend || 0}
          hint={
            stats?.customers?.newThisMonth
              ? `+${stats.customers.newThisMonth} joined this month`
              : undefined
          }
        />
      </div>

      {/* ── Chart + recent bookings ──────────────────── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.05)] lg:col-span-4">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h3 className="font-display text-[15px] font-semibold tracking-tight text-foreground">
                Revenue Overview
              </h3>
              <p className="text-xs text-muted-foreground">Monthly bookings value</p>
            </div>
            <Link
              href="/admin/payments"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#e85a25] transition-colors hover:text-[#FF6B35]"
            >
              Payments <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF6B35" stopOpacity={0.18} />
                    <stop offset="100%" stopColor="#FF6B35" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef2" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8b8f98", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8b8f98", fontSize: 12 }}
                  tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                  width={72}
                />
                <Tooltip
                  cursor={{ stroke: "#FF6B35", strokeWidth: 1, strokeDasharray: "4 4" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid rgba(16,24,40,0.06)",
                    boxShadow: "0 12px 32px rgba(16,24,40,0.12)",
                    fontSize: 12.5,
                  }}
                  formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FF6B35"
                  strokeWidth={2.25}
                  fill="url(#revenueFill)"
                  activeDot={{ r: 4, strokeWidth: 2, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border border-black/[0.06] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.05)] lg:col-span-3">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h3 className="font-display text-[15px] font-semibold tracking-tight text-foreground">
                Recent Bookings
              </h3>
              <p className="text-xs text-muted-foreground">Latest travellers</p>
            </div>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#e85a25] transition-colors hover:text-[#FF6B35]"
            >
              View all <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="-mx-2 flex-1 space-y-1 overflow-y-auto px-2">
            {recentBookings.length === 0 ? (
              <div className="flex h-full min-h-[160px] flex-col items-center justify-center rounded-xl border border-dashed border-black/[0.08] text-center">
                <Calendar className="size-6 text-zinc-300" />
                <p className="mt-2 text-sm font-medium text-foreground">No bookings yet</p>
                <p className="text-xs text-muted-foreground">New bookings will appear here.</p>
              </div>
            ) : (
              recentBookings.map((booking: any) => (
                <div
                  key={booking._id}
                  className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-zinc-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/20 to-orange-500/[0.08] text-[13px] font-bold text-[#e85a25]">
                    {(booking.userId?.name || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-foreground">
                      {booking.userId?.name || "Unknown"}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {booking.tripId?.title || "Unknown trip"}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[13.5px] font-bold tabular-nums text-foreground">
                      ₹{(booking.total ?? 0).toLocaleString("en-IN")}
                    </p>
                    <div className="mt-0.5 flex justify-end">
                      <StatusBadge status={booking.bookingStatus ?? "PENDING"} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
