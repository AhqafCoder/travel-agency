import type { Request, Response } from "express";
import { Destination } from "../models/Destination.js";

/** GET /api/admin/destinations */
export async function adminListDestinations(req: Request, res: Response): Promise<void> {
  const { search, page = "1", pageSize = "50" } = req.query;
  const filter: Record<string, unknown> = {};
  if (search) {
    filter.$or = [
      { name: { $regex: String(search), $options: "i" } },
      { state: { $regex: String(search), $options: "i" } },
    ];
  }
  const pageNum = Math.max(1, Number(page));
  const pageSizeNum = Math.min(100, Number(pageSize));

  const [data, total] = await Promise.all([
    Destination.find(filter).sort({ name: 1 }).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum).lean(),
    Destination.countDocuments(filter),
  ]);
  res.json({ success: true, data, meta: { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) } });
}

/** POST /api/admin/destinations */
export async function adminCreateDestination(req: Request, res: Response): Promise<void> {
  const body = req.body as Record<string, unknown>;
  if (!body.slug && body.name) {
    body.slug = String(body.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  const dest = await Destination.create(body);
  res.status(201).json({ success: true, data: dest });
}

/** GET /api/admin/destinations/:id */
export async function adminGetDestination(req: Request, res: Response): Promise<void> {
  const dest = await Destination.findById(req.params.id).lean();
  if (!dest) { res.status(404).json({ success: false, error: "Destination not found" }); return; }
  res.json({ success: true, data: dest });
}

/** PATCH /api/admin/destinations/:id */
export async function adminUpdateDestination(req: Request, res: Response): Promise<void> {
  const dest = await Destination.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true }).lean();
  if (!dest) { res.status(404).json({ success: false, error: "Destination not found" }); return; }
  res.json({ success: true, data: dest });
}

/** DELETE /api/admin/destinations/:id */
export async function adminDeleteDestination(req: Request, res: Response): Promise<void> {
  const dest = await Destination.findByIdAndDelete(req.params.id);
  if (!dest) { res.status(404).json({ success: false, error: "Destination not found" }); return; }
  res.json({ success: true, data: { deleted: req.params.id } });
}
