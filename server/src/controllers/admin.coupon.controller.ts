import type { Request, Response } from "express";
import { Coupon } from "../models/Coupon.js";

/** GET /api/admin/coupons */
export async function adminListCoupons(req: Request, res: Response): Promise<void> {
  const { page = "1", pageSize = "20" } = req.query;
  const pageNum = Math.max(1, Number(page));
  const pageSizeNum = Math.min(100, Number(pageSize));
  const [data, total] = await Promise.all([
    Coupon.find({}).sort({ createdAt: -1 }).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum).lean(),
    Coupon.countDocuments({}),
  ]);
  res.json({ success: true, data, meta: { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) } });
}

/** POST /api/admin/coupons */
export async function adminCreateCoupon(req: Request, res: Response): Promise<void> {
  const coupon = await Coupon.create({ ...req.body, code: String(req.body.code ?? "").toUpperCase() });
  res.status(201).json({ success: true, data: coupon });
}

/** GET /api/admin/coupons/:id */
export async function adminGetCoupon(req: Request, res: Response): Promise<void> {
  const coupon = await Coupon.findById(req.params.id).lean();
  if (!coupon) { res.status(404).json({ success: false, error: "Coupon not found" }); return; }
  res.json({ success: true, data: coupon });
}

/** PATCH /api/admin/coupons/:id */
export async function adminUpdateCoupon(req: Request, res: Response): Promise<void> {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true }).lean();
  if (!coupon) { res.status(404).json({ success: false, error: "Coupon not found" }); return; }
  res.json({ success: true, data: coupon });
}

/** DELETE /api/admin/coupons/:id */
export async function adminDeleteCoupon(req: Request, res: Response): Promise<void> {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) { res.status(404).json({ success: false, error: "Coupon not found" }); return; }
  res.json({ success: true, data: { deleted: req.params.id } });
}
