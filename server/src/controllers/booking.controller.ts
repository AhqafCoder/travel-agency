import type { Request, Response } from "express";
import { Booking } from "../models/Booking.js";
import { Departure } from "../models/Departure.js";
import { Trip } from "../models/Trip.js";
import { createBooking, cancelBooking } from "../services/booking.service.js";
import { calculatePrice } from "../services/pricing.service.js";

/** GET /api/bookings — returns the caller's bookings (from Bearer token). */
export async function listMyBookings(
  _req: Request,
  res: Response
): Promise<void> {
  const userId = res.locals.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  const bookings = await Booking.find({ userId })
    .populate("tripId", "title slug coverImage durationDays tripType")
    .populate("departureId", "startDate endDate meetingPoint status")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, data: bookings });
}

/** GET /api/bookings/:id */
export async function getBooking(req: Request, res: Response): Promise<void> {
  const booking = await Booking.findById(req.params.id)
    .populate("tripId")
    .populate("departureId")
    .populate("userId", "name email phone avatar")
    .lean();

  if (!booking) {
    res.status(404).json({ success: false, error: "Booking not found" });
    return;
  }
  res.json({ success: true, data: booking });
}

/** POST /api/bookings — create a booking with atomic seat reservation. */
export async function createOneBooking(
  req: Request,
  res: Response
): Promise<void> {
  const userId = res.locals.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  const { tripId, departureId, travellers, couponCode, notes } = req.body;

  if (!tripId || !departureId || !Array.isArray(travellers) || travellers.length === 0) {
    res.status(400).json({
      success: false,
      error: "tripId, departureId and travellers[] are required",
    });
    return;
  }

  const booking = await createBooking({
    userId,
    tripId,
    departureId,
    travellers,
    couponCode,
    notes,
  });

  res.status(201).json({ success: true, data: booking });
}

/** POST /api/bookings/price — preview price without reserving seats. */
export async function previewPrice(
  req: Request,
  res: Response
): Promise<void> {
  const { tripId, travellersCount, couponCode } = req.body as {
    tripId?: string;
    travellersCount?: number;
    couponCode?: string;
  };

  if (!tripId || !travellersCount || travellersCount < 1) {
    res.status(400).json({
      success: false,
      error: "tripId and travellersCount (>0) are required",
    });
    return;
  }

  const trip = await Trip.findById(tripId).lean();
  if (!trip) {
    res.status(404).json({ success: false, error: "Trip not found" });
    return;
  }

  const pricePerPerson = trip.discountedPrice ?? trip.basePrice;
  const price = await calculatePrice({
    pricePerPerson,
    travellersCount,
    couponCode,
    tripId: String(trip._id),
  });

  const departures = await Departure.find({
    tripId,
    status: { $in: ["ACTIVE", "DRAFT"] },
    startDate: { $gte: new Date() },
  })
    .sort({ startDate: 1 })
    .lean();

  res.json({ success: true, data: { price, departures } });
}

/** PATCH /api/bookings/:id/cancel */
export async function cancelOneBooking(
  req: Request,
  res: Response
): Promise<void> {
  const { reason } = req.body as { reason?: string };
  if (!reason) {
    res.status(400).json({ success: false, error: "reason is required" });
    return;
  }

  const booking = await cancelBooking(req.params.id, reason);
  res.json({ success: true, data: booking });
}