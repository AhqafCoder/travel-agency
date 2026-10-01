import type { Request, Response } from "express";
import { Review } from "../models/Review.js";

/** GET /api/admin/reviews */
export async function adminListReviews(req: Request, res: Response): Promise<void> {
  const { status, page = "1", pageSize = "20" } = req.query;
  const filter: Record<string, unknown> = {};
  if (status) filter.status = String(status);

  const pageNum = Math.max(1, Number(page));
  const pageSizeNum = Math.min(100, Number(pageSize));

  const [data, total] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSizeNum)
      .limit(pageSizeNum)
      .populate("userId", "name email avatar")
      .populate("tripId", "title slug coverImage")
      .lean(),
    Review.countDocuments(filter),
  ]);
  res.json({ success: true, data, meta: { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) } });
}

/** PATCH /api/admin/reviews/:id/status */
export async function adminUpdateReviewStatus(req: Request, res: Response): Promise<void> {
  const { status, adminNote } = req.body as { status: string; adminNote?: string };
  const allowed = ["PENDING", "APPROVED", "REJECTED"];
  if (!allowed.includes(status)) {
    res.status(400).json({ success: false, error: "Invalid status" });
    return;
  }
  const update: Record<string, unknown> = { status };
  if (adminNote) update.adminNote = adminNote;

  const review = await Review.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).lean();
  if (!review) { res.status(404).json({ success: false, error: "Review not found" }); return; }
  res.json({ success: true, data: review });
}

/** DELETE /api/admin/reviews/:id */
export async function adminDeleteReview(req: Request, res: Response): Promise<void> {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) { res.status(404).json({ success: false, error: "Review not found" }); return; }
  res.json({ success: true, data: { deleted: req.params.id } });
}
