import { Booking } from "@/server/models/Booking";
import { Trip } from "@/server/models/Trip";
import { Departure } from "@/server/models/Departure";
import { User } from "@/server/models/User";
import { ok, handle, requireRole } from "@/server/lib/http";
import { UserRole } from "@/server/models/enums";

const OPS: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.OPERATIONS];

/** GET /api/admin/stats — dashboard KPIs. */
export const GET = handle(async (req) => {
  await requireRole(req, ...OPS);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const [
    totalBookings, thisMonthBookings, lastMonthBookings, pendingBookings, confirmedBookings,
    totalRevenue, thisMonthRevenue, lastMonthRevenue,
    publishedTrips, draftTrips, upcomingDepartures,
    totalCustomers, newCustomers, lastMonthCustomers,
    recentBookings, revenueChart,
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
    Booking.find({}).sort({ createdAt: -1 }).limit(5)
      .populate("tripId", "title coverImage")
      .populate("userId", "name email avatar")
      .lean(),
    Booking.aggregate([
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, revenue: { $sum: "$total" }, bookings: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 },
    ]),
  ]);

  const totalRev = (totalRevenue[0]?.total ?? 0) as number;
  const thisMonthRev = (thisMonthRevenue[0]?.total ?? 0) as number;
  const lastMonthRev = (lastMonthRevenue[0]?.total ?? 0) as number;
  const pct = (cur: number, prev: number) => (prev > 0 ? Math.round(((cur - prev) / prev) * 100) : 0);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const chartData = (revenueChart as Array<{ _id: { year: number; month: number }; revenue: number; bookings: number }>).map((r) => ({
    month: months[r._id.month - 1],
    revenue: r.revenue,
    bookings: r.bookings,
  }));

  return ok({
    revenue: { total: totalRev, thisMonth: thisMonthRev, trend: pct(thisMonthRev, lastMonthRev) },
    bookings: { total: totalBookings, thisMonth: thisMonthBookings, trend: pct(thisMonthBookings, lastMonthBookings), pending: pendingBookings, confirmed: confirmedBookings },
    trips: { total: publishedTrips + draftTrips, published: publishedTrips, draft: draftTrips },
    departures: { upcoming: upcomingDepartures, active: upcomingDepartures },
    customers: { total: totalCustomers, newThisMonth: newCustomers, trend: pct(newCustomers, lastMonthCustomers) },
    recentBookings,
    revenueChart: chartData,
  });
});
