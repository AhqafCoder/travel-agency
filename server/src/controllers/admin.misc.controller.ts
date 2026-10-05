import type { Request, Response } from "express";
import { Departure } from "../models/Departure.js";
import { Payment } from "../models/Payment.js";
import { Captain } from "../models/Captain.js";

/** GET /api/admin/departures — all departures across trips (with trip info). */
export async function adminListAllDepartures(req: Request, res: Response): Promise<void> {
  const { status, page = "1", pageSize = "50" } = req.query;
  const query: Record<string, unknown> = {};
  if (status && typeof status === "string" && status !== "ALL") query.status = status;

  const pageNum = Math.max(1, Number(page));
  const pageSizeNum = Math.min(100, Number(pageSize));

  const [data, total] = await Promise.all([
    Departure.find(query)
      .sort({ startDate: 1 })
      .skip((pageNum - 1) * pageSizeNum)
      .limit(pageSizeNum)
      .populate("tripId", "title slug coverImage")
      .lean(),
    Departure.countDocuments(query),
  ]);

  res.json({
    success: true,
    data,
    meta: { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) },
  });
}

/** GET /api/admin/payments — payment ledger (with booking reference). */
export async function adminListPayments(req: Request, res: Response): Promise<void> {
  const { status, page = "1", pageSize = "20" } = req.query;
  const query: Record<string, unknown> = {};
  if (status && typeof status === "string" && status !== "ALL") query.status = status;

  const pageNum = Math.max(1, Number(page));
  const pageSizeNum = Math.min(100, Number(pageSize));

  const [data, total] = await Promise.all([
    Payment.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSizeNum)
      .limit(pageSizeNum)
      .populate("bookingId", "bookingNumber bookingStatus")
      .lean(),
    Payment.countDocuments(query),
  ]);

  res.json({
    success: true,
    data,
    meta: { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) },
  });
}

/** GET /api/admin/captains — captains with their user profile. */
export async function adminListCaptains(req: Request, res: Response): Promise<void> {
  const { available, page = "1", pageSize = "20" } = req.query;
  const query: Record<string, unknown> = {};
  if (available === "true") query.available = true;
  if (available === "false") query.available = false;

  const pageNum = Math.max(1, Number(page));
  const pageSizeNum = Math.min(100, Number(pageSize));

  const [data, total] = await Promise.all([
    Captain.find(query)
      .sort({ rating: -1 })
      .skip((pageNum - 1) * pageSizeNum)
      .limit(pageSizeNum)
      .populate("userId", "name email phone avatar")
      .lean(),
    Captain.countDocuments(query),
  ]);

  res.json({
    success: true,
    data,
    meta: { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) },
  });
}
