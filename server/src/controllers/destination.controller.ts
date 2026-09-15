import type { Request, Response } from "express";
import { Destination, type DestinationDoc } from "../models/Destination.js";
import { Trip } from "../models/Trip.js";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** GET /api/destinations */
export async function listDestinations(
  req: Request,
  res: Response
): Promise<void> {
  const { search, featured } = req.query;
  const filter: Record<string, unknown> = {};

  if (search) {
    filter.$or = [
      { name: { $regex: escapeRegExp(String(search)), $options: "i" } },
      { state: { $regex: escapeRegExp(String(search)), $options: "i" } },
      { description: { $regex: escapeRegExp(String(search)), $options: "i" } },
    ];
  }
  if (featured === "true") filter.featured = true;

  const destinations = await Destination.find(filter)
    .sort({ featured: -1, name: 1 })
    .lean();

  const dests = destinations as DestinationDoc[];
  // Annotate each destination with its published trip count.
  const data = await Promise.all(
    dests.map(async (dest) => {
      const tripCount = await Trip.countDocuments({
        destinationId: dest._id,
        status: "PUBLISHED",
      });
      return { ...dest, tripCount };
    })
  );

  res.json({ success: true, data });
}

/** GET /api/destinations/:slug */
export async function getDestination(
  req: Request,
  res: Response
): Promise<void> {
  const destination = await Destination.findOne({
    slug: req.params.slug,
  }).lean();

  if (!destination) {
    res.status(404).json({ success: false, error: "Destination not found" });
    return;
  }

  const trips = await Trip.find({
    destinationId: (destination as DestinationDoc)._id,
    status: "PUBLISHED",
  }).lean();

  res.json({ success: true, data: { ...destination, trips } });
}