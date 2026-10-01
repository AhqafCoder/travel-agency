import type { Request, Response } from "express";
import { Booking } from "../models/Booking.js";

/** GET /api/admin/bookings — filterable booking table */
export async function adminListBookings(req: Request, res: Response): Promise<void> {
  const { search, status, paymentStatus, page = "1", pageSize = "20" } = req.query;
  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { bookingNumber: { $regex: String(search), $options: "i" } },
    ];
  }
  if (status) filter.bookingStatus = String(status);
  if (paymentStatus) filter.paymentStatus = String(paymentStatus);

  const pageNum = Math.max(1, Number(page));
  const pageSizeNum = Math.min(100, Number(pageSize));

  const [data, total] = await Promise.all([
    Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSizeNum)
      .limit(pageSizeNum)
      .populate("userId", "name email phone avatar")
      .populate("tripId", "title coverImage slug")
      .populate("departureId", "startDate endDate price meetingPoint")
      .lean(),
    Booking.countDocuments(filter),
  ]);

  res.json({ success: true, data, meta: { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) } });
}

/** GET /api/admin/bookings/:id */
export async function adminGetBooking(req: Request, res: Response): Promise<void> {
  const booking = await Booking.findById(req.params.id)
    .populate("userId", "name email phone avatar")
    .populate("tripId", "title coverImage slug durationDays")
    .populate("departureId")
    .lean();
  if (!booking) { res.status(404).json({ success: false, error: "Booking not found" }); return; }
  res.json({ success: true, data: booking });
}

/** PATCH /api/admin/bookings/:id/status — change booking status */
export async function adminUpdateBookingStatus(req: Request, res: Response): Promise<void> {
  const { bookingStatus, cancelReason } = req.body as { bookingStatus: string; cancelReason?: string };
  const allowed = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "REFUNDED"];
  if (!allowed.includes(bookingStatus)) {
    res.status(400).json({ success: false, error: "Invalid bookingStatus" });
    return;
  }

  const update: Record<string, unknown> = { bookingStatus };
  if (cancelReason) update.cancelReason = cancelReason;

  const booking = await Booking.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).lean();
  if (!booking) { res.status(404).json({ success: false, error: "Booking not found" }); return; }
  res.json({ success: true, data: booking });
}
