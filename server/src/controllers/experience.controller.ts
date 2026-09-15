import type { Request, Response } from "express";
import { Experience } from "../models/Experience.js";

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** GET /api/experiences?search=&category=&destination= */
export async function listExperiences(
  req: Request,
  res: Response
): Promise<void> {
  const { search, category, destination } = req.query;
  const filter: Record<string, unknown> = { status: "ACTIVE" };

  if (search) {
    filter.$or = [
      { title: { $regex: escapeRegExp(String(search)), $options: "i" } },
      { description: { $regex: escapeRegExp(String(search)), $options: "i" } },
    ];
  }
  if (category) filter.category = String(category);
  if (destination) filter.destinationId = String(destination);

  const experiences = await Experience.find(filter)
    .sort({ rating: -1, reviewCount: -1 })
    .populate("destinationId", "name slug state")
    .lean();

  res.json({ success: true, data: experiences });
}

/** GET /api/experiences/:slug */
export async function getExperience(
  req: Request,
  res: Response
): Promise<void> {
  const experience = await Experience.findOne({
    slug: req.params.slug,
    status: "ACTIVE",
  })
    .populate("destinationId", "name slug state")
    .populate("hostId", "name avatar")
    .lean();

  if (!experience) {
    res.status(404).json({ success: false, error: "Experience not found" });
    return;
  }
  res.json({ success: true, data: experience });
}