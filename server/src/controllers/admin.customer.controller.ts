import type { Request, Response } from "express";
import { User } from "../models/User.js";
import { Booking } from "../models/Booking.js";

/** GET /api/admin/customers */
export async function adminListCustomers(req: Request, res: Response): Promise<void> {
  const { search, page = "1", pageSize = "20" } = req.query;
  const filter: Record<string, unknown> = { role: "CUSTOMER" };
  if (search) {
    filter.$or = [
      { name: { $regex: String(search), $options: "i" } },
      { email: { $regex: String(search), $options: "i" } },
    ];
  }
  const pageNum = Math.max(1, Number(page));
  const pageSizeNum = Math.min(100, Number(pageSize));

  const [data, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * pageSizeNum).limit(pageSizeNum).lean(),
    User.countDocuments(filter),
  ]);
  res.json({ success: true, data, meta: { total, page: pageNum, pageSize: pageSizeNum, totalPages: Math.ceil(total / pageSizeNum) } });
}

/** GET /api/admin/customers/:id */
export async function adminGetCustomer(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.params.id).lean();
  if (!user) { res.status(404).json({ success: false, error: "User not found" }); return; }
  const bookings = await Booking.find({ userId: req.params.id }).sort({ createdAt: -1 }).populate("tripId", "title coverImage slug").lean();
  res.json({ success: true, data: { user, bookings } });
}

/** PATCH /api/admin/customers/:id — update role or basic info */
export async function adminUpdateCustomer(req: Request, res: Response): Promise<void> {
  const { role, name, phone } = req.body as { role?: string; name?: string; phone?: string };
  const update: Record<string, unknown> = {};
  if (role) update.role = role;
  if (name) update.name = name;
  if (phone) update.phone = phone;

  const user = await User.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).lean();
  if (!user) { res.status(404).json({ success: false, error: "User not found" }); return; }
  res.json({ success: true, data: user });
}
