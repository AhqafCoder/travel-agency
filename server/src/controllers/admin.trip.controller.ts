import type { Request, Response } from "express";
import { Trip } from "../models/Trip.js";
import { Departure } from "../models/Departure.js";
import type { AuthUser } from "../middleware/auth.js";

function escapeRegExp(v: string) {
  return v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** GET /api/admin/trips — list all trips (any status) for admin */
export async function adminListTrips(req: Request, res: Response): Promise<void> {
  const { search, status, tripType, page = "1", pageSize = "20" } = req.query;

  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { title: { $regex: escapeRegExp(String(search)), $options: "i" } },
      { slug: { $regex: escapeRegExp(String(search)), $options: "i" } },
    ];
  }
  if (status) filter.status = String(status);
  if (tripType) filter.tripType = String(tripType);

  const pageNum = Math.max(1, Number(page));
  const pageSizeNum = Math.min(100, Math.max(1, Number(pageSize)));

  const [data, total] = await Promise.all([
    Trip.find(filter)
      .sort({ updatedAt: -1 })
      .skip((pageNum - 1) * pageSizeNum)
      .limit(pageSizeNum)
      .populate("destinationId", "name slug state")
      .lean(),
    Trip.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data,
    meta: { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) },
  });
}

/** POST /api/admin/trips — create trip */
export async function adminCreateTrip(req: Request, res: Response): Promise<void> {
  const body = req.body as Record<string, unknown>;
  // Slug auto-generate if missing
  if (!body.slug && body.title) {
    body.slug = String(body.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  const trip = new Trip(body);
  await trip.save();

  res.status(201).json({ success: true, data: trip });
}

/** GET /api/admin/trips/:id — get single trip by id */
export async function adminGetTrip(req: Request, res: Response): Promise<void> {
  const trip = await Trip.findById(req.params.id)
    .populate("destinationId")
    .populate("captainId")
    .lean();

  if (!trip) {
    res.status(404).json({ success: false, error: "Trip not found" });
    return;
  }
  res.json({ success: true, data: trip });
}

/** PATCH /api/admin/trips/:id — partial update */
export async function adminUpdateTrip(req: Request, res: Response): Promise<void> {
  const trip = await Trip.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  ).lean();

  if (!trip) {
    res.status(404).json({ success: false, error: "Trip not found" });
    return;
  }
  res.json({ success: true, data: trip });
}

/** DELETE /api/admin/trips/:id */
export async function adminDeleteTrip(req: Request, res: Response): Promise<void> {
  const trip = await Trip.findByIdAndDelete(req.params.id);
  if (!trip) {
    res.status(404).json({ success: false, error: "Trip not found" });
    return;
  }
  // Also delete departures
  await Departure.deleteMany({ tripId: req.params.id });
  res.json({ success: true, data: { deleted: req.params.id } });
}

/** PATCH /api/admin/trips/:id/publish */
export async function adminPublishTrip(req: Request, res: Response): Promise<void> {
  const { status } = req.body as { status?: string };
  const allowed = ["DRAFT", "PUBLISHED", "ARCHIVED"];
  if (!status || !allowed.includes(status)) {
    res.status(400).json({ success: false, error: `status must be one of ${allowed.join(", ")}` });
    return;
  }
  const trip = await Trip.findByIdAndUpdate(req.params.id, { status }, { new: true }).lean();
  if (!trip) {
    res.status(404).json({ success: false, error: "Trip not found" });
    return;
  }
  res.json({ success: true, data: trip });
}

// ── Departures for a trip ─────────────────────────────────────────────────

/** GET /api/admin/trips/:id/departures */
export async function adminListDepartures(req: Request, res: Response): Promise<void> {
  const departures = await Departure.find({ tripId: req.params.id })
    .sort({ startDate: 1 })
    .lean();
  res.json({ success: true, data: departures });
}

/** POST /api/admin/trips/:id/departures */
export async function adminCreateDeparture(req: Request, res: Response): Promise<void> {
  const departure = await Departure.create({
    ...req.body,
    tripId: req.params.id,
    bookedSeats: 0,
    availableSeats: Number(req.body.capacity ?? 20),
  });
  res.status(201).json({ success: true, data: departure });
}

/** PATCH /api/admin/departures/:depId */
export async function adminUpdateDeparture(req: Request, res: Response): Promise<void> {
  const dep = await Departure.findByIdAndUpdate(
    req.params.depId,
    { $set: req.body },
    { new: true, runValidators: true }
  ).lean();
  if (!dep) {
    res.status(404).json({ success: false, error: "Departure not found" });
    return;
  }
  res.json({ success: true, data: dep });
}

/** DELETE /api/admin/departures/:depId */
export async function adminDeleteDeparture(req: Request, res: Response): Promise<void> {
  const dep = await Departure.findByIdAndDelete(req.params.depId);
  if (!dep) {
    res.status(404).json({ success: false, error: "Departure not found" });
    return;
  }
  res.json({ success: true, data: { deleted: req.params.depId } });
}
