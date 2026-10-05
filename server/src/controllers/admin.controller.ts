import type { Request, Response } from "express";
import { Trip } from "../models/Trip.js";
import { Departure } from "../models/Departure.js";
import { Booking } from "../models/Booking.js";
import { User } from "../models/User.js";

/** GET /api/admin/stats — Dashboard KPIs */
export async function getDashboardStats(_req: Request, res: Response): Promise<void> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const [
    totalBookings,
    thisMonthBookings,
    lastMonthBookings,
    pendingBookings,
    confirmedBookings,
    totalRevenue,
    thisMonthRevenue,
    lastMonthRevenue,
    publishedTrips,
    draftTrips,
    upcomingDepartures,
    totalCustomers,
    newCustomers,
    lastMonthCustomers,
    recentBookings,
    revenueChart,
  ] = await Promise.all([
    Booking.countDocuments({}),
    Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Booking.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    Booking.countDocuments({ bookingStatus: "PENDING" }),
    Booking.countDocuments({ bookingStatus: "CONFIRMED" }),
    Booking.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
    Booking.aggregate([{ $match: { createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
    Booking.aggregate([{ $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
    Trip.countDocuments({ status: "PUBLISHED" }),
    Trip.countDocuments({ status: "DRAFT" }),
    Departure.countDocuments({ startDate: { $gte: now }, status: { $in: ["ACTIVE", "DRAFT"] } }),
    User.countDocuments({ role: "CUSTOMER" }),
    User.countDocuments({ role: "CUSTOMER", createdAt: { $gte: startOfMonth } }),
    User.countDocuments({ role: "CUSTOMER", createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
    Booking.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("tripId", "title coverImage")
      .populate("userId", "name email avatar")
      .lean(),
    // Last 6 months revenue
    Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$total" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]),
  ]);

  const totalRev = (totalRevenue[0]?.total ?? 0) as number;
  const thisMonthRev = (thisMonthRevenue[0]?.total ?? 0) as number;
  const lastMonthRev = (lastMonthRevenue[0]?.total ?? 0) as number;
  const bookingTrend = lastMonthBookings > 0 ? Math.round(((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100) : 0;
  const revenueTrend = lastMonthRev > 0 ? Math.round(((thisMonthRev - lastMonthRev) / lastMonthRev) * 100) : 0;
  const customerTrend = lastMonthCustomers > 0 ? Math.round(((newCustomers - lastMonthCustomers) / lastMonthCustomers) * 100) : 0;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = (revenueChart as Array<{ _id: { year: number; month: number }; revenue: number; bookings: number }>).map((r) => ({
    month: months[r._id.month - 1],
    revenue: r.revenue,
    bookings: r.bookings,
  }));

  res.json({
    success: true,
    data: {
      revenue: { total: totalRev, thisMonth: thisMonthRev, trend: revenueTrend },
      bookings: { total: totalBookings, thisMonth: thisMonthBookings, trend: bookingTrend, pending: pendingBookings, confirmed: confirmedBookings },
      trips: { total: publishedTrips + draftTrips, published: publishedTrips, draft: draftTrips },
      departures: { upcoming: upcomingDepartures, active: upcomingDepartures },
      customers: { total: totalCustomers, newThisMonth: newCustomers, trend: customerTrend },
      recentBookings,
      revenueChart: chartData,
    },
  });
}
