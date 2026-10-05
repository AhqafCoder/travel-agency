"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { StatCard } from "@/components/admin/StatCard";
import { Users, Map, Calendar, DollarSign } from "lucide-react";
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

const data = [
  { name: "Jan", revenue: 4000 },
  { name: "Feb", revenue: 3000 },
  { name: "Mar", revenue: 2000 },
  { name: "Apr", revenue: 2780 },
  { name: "May", revenue: 1890 },
  { name: "Jun", revenue: 2390 },
  { name: "Jul", revenue: 3490 },
];

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

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="h-[400px] rounded-xl lg:col-span-4" />
          <Skeleton className="h-[400px] rounded-xl lg:col-span-3" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground dark:text-muted-foreground">
            Welcome back, {user?.name}. Here's what's happening today.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={`$${stats?.revenue.total.toLocaleString() || "0"}`}
          icon={DollarSign}
          trend={stats?.revenue.trend || 0}
        />
        <StatCard
          label="Active Bookings"
          value={stats?.bookings.total || 0}
          icon={Calendar}
          trend={stats?.bookings.trend || 0}
        />
        <StatCard
          label="Total Trips"
          value={stats?.trips.total || 0}
          icon={Map}
          trend={0} 
        />
        <StatCard
          label="Total Users"
          value={stats?.customers.total || 0}
          icon={Users}
          trend={stats?.customers.trend || 0}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 lg:col-span-4 shadow-sm">
          <h3 className="font-semibold text-lg mb-6">Revenue Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#FF6B35"
                    fill="#FF6B35"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 lg:col-span-3 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Recent Bookings</h3>
          <div className="space-y-4">
            {stats?.recentBookings.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent bookings.</p>
            ) : (
              stats?.recentBookings.map((booking: any) => (
                <div key={booking._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-medium text-slate-600 dark:text-slate-300">
                      {booking.userId?.name.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{booking.userId?.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 max-w-[150px]">{booking.tripId?.title || 'Unknown Trip'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${booking.total}</p>
                    <p className="text-xs text-emerald-600 font-medium">{booking.bookingStatus}</p>
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
