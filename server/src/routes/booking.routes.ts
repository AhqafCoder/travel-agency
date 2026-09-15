import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/auth.js";
import {
  cancelOneBooking,
  createOneBooking,
  getBooking,
  listMyBookings,
  previewPrice,
} from "../controllers/booking.controller.js";

const router = Router();

// Everything under /api/bookings requires auth.
router.use(requireAuth);

router.get("/", asyncHandler(listMyBookings));
router.post("/", asyncHandler(createOneBooking));
router.post("/price", asyncHandler(previewPrice));
router.get("/:id", asyncHandler(getBooking));
router.patch("/:id/cancel", asyncHandler(cancelOneBooking));

export default router;