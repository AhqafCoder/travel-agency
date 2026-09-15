import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getFeaturedTrips,
  getTrip,
  getTripsByDestination,
  listTrips,
  searchTrips,
} from "../controllers/trip.controller.js";

const router = Router();

// Order matters: specific routes before /:slug.
router.get("/", asyncHandler(listTrips));
router.get("/featured", asyncHandler(getFeaturedTrips));
router.get("/search", asyncHandler(searchTrips));
router.get("/destination/:destinationId", asyncHandler(getTripsByDestination));
router.get("/:slug", asyncHandler(getTrip));

export default router;