import type { Request, Response } from "express";
import { Review } from "../models/Review.js";
import { User } from "../models/User.js";

/** GET /api/trips/:tripId/reviews */
export async function listTripReviews(
  req: Request,
  res: Response
): Promise<void> {
  const tripId = req.params.tripId;
  const reviews = await Review.find({
    tripId,
    status: "APPROVED",
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const userIds = [...new Set(reviews.map((r) => String(r.userId)))];
  const users = await User.find({ _id: { $in: userIds } })
    .select("name avatar")
    .lean();
  const userMap = new Map(users.map((u) => [String(u._id), u]));

  const data = reviews.map((r) => ({
    ...r,
    user: userMap.get(String(r.userId)),
  }));

  res.json({ success: true, data });
}

/** POST /api/trips/:tripId/reviews — submit a review (auth required). */
export async function createReview(
  req: Request,
  res: Response
): Promise<void> {
  const userId = res.locals.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }

  const { rating, title, content, images } = req.body as {
    rating?: number;
    title?: string;
    content?: string;
    images?: string[];
  };

  if (!rating || rating < 1 || rating > 5 || !content) {
    res.status(400).json({
      success: false,
      error: "rating (1-5) and content are required",
    });
    return;
  }

  const review = await Review.create({
    userId,
    tripId: req.params.tripId,
    rating,
    title,
    content,
    images,
    status: "PENDING",
    verifiedBooking: false,
  });

  res.status(201).json({ success: true, data: review });
}