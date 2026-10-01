import type { Request, Response } from "express";
import { Experience } from "../models/Experience.js";

/** GET /api/admin/experiences */
export async function adminListExperiences(req: Request, res: Response): Promise<void> {
  const { search, status, page = "1", pageSize = "20" } = req.query;
  const filter: Record<string, unknown> = {};
  if (search) filter.title = { $regex: String(search), $options: "i" };
  if (status) filter.status = String(status);

  const pageNum = Math.max(1, Number(page));
  const pageSizeNum = Math.min(100, Number(pageSize));

  const [data, total] = await Promise.all([
    Experience.find(filter).sort({ updatedAt: -1 }).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum).populate("destinationId", "name slug").lean(),
    Experience.countDocuments(filter),
  ]);
  res.json({ success: true, data, meta: { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) } });
}

/** POST /api/admin/experiences */
export async function adminCreateExperience(req: Request, res: Response): Promise<void> {
  const body = req.body as Record<string, unknown>;
  if (!body.slug && body.title) {
    body.slug = String(body.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  const exp = await Experience.create(body);
  res.status(201).json({ success: true, data: exp });
}

/** GET /api/admin/experiences/:id */
export async function adminGetExperience(req: Request, res: Response): Promise<void> {
  const exp = await Experience.findById(req.params.id).populate("destinationId", "name slug").lean();
  if (!exp) { res.status(404).json({ success: false, error: "Experience not found" }); return; }
  res.json({ success: true, data: exp });
}

/** PATCH /api/admin/experiences/:id */
export async function adminUpdateExperience(req: Request, res: Response): Promise<void> {
  const exp = await Experience.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true }).lean();
  if (!exp) { res.status(404).json({ success: false, error: "Experience not found" }); return; }
  res.json({ success: true, data: exp });
}

/** DELETE /api/admin/experiences/:id */
export async function adminDeleteExperience(req: Request, res: Response): Promise<void> {
  const exp = await Experience.findByIdAndDelete(req.params.id);
  if (!exp) { res.status(404).json({ success: false, error: "Experience not found" }); return; }
  res.json({ success: true, data: { deleted: req.params.id } });
}
