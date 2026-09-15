import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import { createReview, listTripReviews } from "../controllers/review.controller.js";

const router = Router();

// Public: approved reviews for a trip.
router.get("/:tripId/reviews", asyncHandler(listTripReviews));
// Auth: submit a review.
router.post("/:tripId/reviews", requireAuth, asyncHandler(createReview));

export default router;