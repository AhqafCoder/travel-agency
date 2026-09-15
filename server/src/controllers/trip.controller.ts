import type { Request, Response } from "express";
import { Trip } from "../models/Trip.js";
import { Destination } from "../models/Destination.js";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type TripFilter = Record<string, unknown> & {
  basePrice?: { $gte?: number; $lte?: number };
  durationDays?: { $gte?: number; $lte?: number };
};

/**
 * GET /api/trips
 * Supports: search, tripType, difficulty, destination, minPrice, maxPrice,
 * minDuration, maxDuration, featured, trending, sort, page, pageSize.
 */
export async function listTrips(req: Request, res: Response): Promise<void> {
  const {
    search,
    tripType,
    difficulty,
    destination,
    minPrice,
    maxPrice,
    minDuration,
    maxDuration,
    featured,
    trending,
    sort = "newest",
    page = "1",
    pageSize = "12",
  } = req.query;

  const filter: TripFilter = { status: "PUBLISHED" };

  if (search) {
    filter.$or = [
      { title: { $regex: escapeRegExp(String(search)), $options: "i" } },
      { shortDescription: { $regex: escapeRegExp(String(search)), $options: "i" } },
      { description: { $regex: escapeRegExp(String(search)), $options: "i" } },
    ];
  }
  if (tripType) filter.tripType = String(tripType);
  if (difficulty) filter.difficulty = String(difficulty);
  if (destination) filter.destinationId = String(destination);
  if (featured === "true") filter.featured = true;
  if (trending === "true") filter.trending = true;

  const priceRange: NonNullable<TripFilter["basePrice"]> = {};
  if (minPrice) priceRange.$gte = Number(minPrice);
  if (maxPrice) priceRange.$lte = Number(maxPrice);
  if (Object.keys(priceRange).length > 0) filter.basePrice = priceRange;

  const durationRange: NonNullable<TripFilter["durationDays"]> = {};
  if (minDuration) durationRange.$gte = Number(minDuration);
  if (maxDuration) durationRange.$lte = Number(maxDuration);
  if (Object.keys(durationRange).length > 0) filter.durationDays = durationRange;

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    price_asc: { basePrice: 1 },
    price_desc: { basePrice: -1 },
    rating: { rating: -1 },
    popular: { reviewCount: -1 },
  };
  const sortOptions = sortMap[String(sort)] ?? sortMap.newest;

  const pageNum = Math.max(1, Number(page) || 1);
  const pageSizeNum = Math.min(50, Math.max(1, Number(pageSize) || 12));

  const [data, total] = await Promise.all([
    Trip.find(filter)
      .sort(sortOptions)
      .skip((pageNum - 1) * pageSizeNum)
      .limit(pageSizeNum)
      .populate("destinationId", "name slug state heroImage")
      .lean(),
    Trip.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data,
    meta: {
      total,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages: Math.ceil(total / pageSizeNum),
    },
  });
}

/** GET /api/trips/:slug */
export async function getTrip(req: Request, res: Response): Promise<void> {
  const trip = await Trip.findOne({ slug: req.params.slug })
    .populate("destinationId", "name slug state heroImage")
    .populate("captainId")
    .lean();

  if (!trip) {
    res.status(404).json({ success: false, error: "Trip not found" });
    return;
  }
  res.json({ success: true, data: trip });
}

/** GET /api/trips/featured */
export async function getFeaturedTrips(
  _req: Request,
  res: Response
): Promise<void> {
  const trips = await Trip.find({ status: "PUBLISHED", featured: true })
    .limit(6)
    .lean();
  res.json({ success: true, data: trips });
}

/** GET /api/trips/search?q=... — uses Mongo text index */
export async function searchTrips(req: Request, res: Response): Promise<void> {
  const q = String(req.query.q ?? "").trim();
  if (!q) {
    res.json({ success: true, data: [] });
    return;
  }
  const trips = await Trip.find(
    { status: "PUBLISHED", $text: { $search: q } },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(20)
    .lean();
  res.json({ success: true, data: trips });
}

/** GET /api/trips/destination/:destinationId */
export async function getTripsByDestination(
  req: Request,
  res: Response
): Promise<void> {
  const destinationId = req.params.destinationId;
  const destination = await Destination.findById(destinationId).lean();
  if (!destination) {
    res.status(404).json({ success: false, error: "Destination not found" });
    return;
  }
  const trips = await Trip.find({ status: "PUBLISHED", destinationId }).lean();
  res.json({ success: true, data: trips });
}