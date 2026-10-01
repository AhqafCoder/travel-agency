import type { Request, Response } from "express";
import { Story } from "../models/Story.js";
import type { AuthUser } from "../middleware/auth.js";

/** GET /api/admin/stories */
export async function adminListStories(req: Request, res: Response): Promise<void> {
  const { search, status, page = "1", pageSize = "20" } = req.query;
  const filter: Record<string, unknown> = {};
  if (search) filter.title = { $regex: String(search), $options: "i" };
  if (status) filter.status = String(status);

  const pageNum = Math.max(1, Number(page));
  const pageSizeNum = Math.min(100, Number(pageSize));

  const [data, total] = await Promise.all([
    Story.find(filter).sort({ updatedAt: -1 }).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum).populate("authorId", "name avatar").lean(),
    Story.countDocuments(filter),
  ]);
  res.json({ success: true, data, meta: { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) } });
}

/** POST /api/admin/stories */
export async function adminCreateStory(req: Request, res: Response): Promise<void> {
  const user = res.locals.user as AuthUser;
  const body = req.body as Record<string, unknown>;
  if (!body.slug && body.title) {
    body.slug = String(body.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  const story = await Story.create({ ...body, authorId: user.id });
  res.status(201).json({ success: true, data: story });
}

/** GET /api/admin/stories/:id */
export async function adminGetStory(req: Request, res: Response): Promise<void> {
  const story = await Story.findById(req.params.id).populate("authorId", "name avatar").lean();
  if (!story) { res.status(404).json({ success: false, error: "Story not found" }); return; }
  res.json({ success: true, data: story });
}

/** PATCH /api/admin/stories/:id */
export async function adminUpdateStory(req: Request, res: Response): Promise<void> {
  const body = req.body as Record<string, unknown>;
  if (body.status === "PUBLISHED" && !(body as { publishedAt?: unknown }).publishedAt) {
    body.publishedAt = new Date();
  }
  const story = await Story.findByIdAndUpdate(req.params.id, { $set: body }, { new: true, runValidators: true }).lean();
  if (!story) { res.status(404).json({ success: false, error: "Story not found" }); return; }
  res.json({ success: true, data: story });
}

/** DELETE /api/admin/stories/:id */
export async function adminDeleteStory(req: Request, res: Response): Promise<void> {
  const story = await Story.findByIdAndDelete(req.params.id);
  if (!story) { res.status(404).json({ success: false, error: "Story not found" }); return; }
  res.json({ success: true, data: { deleted: req.params.id } });
}
