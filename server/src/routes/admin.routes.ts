import { Router } from "express";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getDashboardStats } from "../controllers/admin.controller.js";
import {
  adminListTrips,
  adminCreateTrip,
  adminGetTrip,
  adminUpdateTrip,
  adminDeleteTrip,
  adminPublishTrip,
  adminListDepartures,
  adminCreateDeparture,
  adminUpdateDeparture,
  adminDeleteDeparture,
} from "../controllers/admin.trip.controller.js";
import {
  adminListDestinations,
  adminCreateDestination,
  adminGetDestination,
  adminUpdateDestination,
  adminDeleteDestination,
} from "../controllers/admin.destination.controller.js";
import {
  adminListBookings,
  adminGetBooking,
  adminUpdateBookingStatus,
} from "../controllers/admin.booking.controller.js";
import {
  adminListCustomers,
  adminGetCustomer,
  adminUpdateCustomer,
} from "../controllers/admin.customer.controller.js";
import {
  adminListReviews,
  adminUpdateReviewStatus,
  adminDeleteReview,
} from "../controllers/admin.review.controller.js";
import {
  adminListStories,
  adminCreateStory,
  adminGetStory,
  adminUpdateStory,
  adminDeleteStory,
} from "../controllers/admin.story.controller.js";
import {
  adminListExperiences,
  adminCreateExperience,
  adminGetExperience,
  adminUpdateExperience,
  adminDeleteExperience,
} from "../controllers/admin.experience.controller.js";
import {
  adminListCoupons,
  adminCreateCoupon,
  adminGetCoupon,
  adminUpdateCoupon,
  adminDeleteCoupon,
} from "../controllers/admin.coupon.controller.js";
import {
  adminListLeads,
  adminGetLead,
  adminUpdateLead,
  adminDeleteLead,
} from "../controllers/admin.lead.controller.js";

const router = Router();

// All admin routes require auth. Role checks are fine-grained per sub-resource.
router.use(requireAuth);
const su = requireRole("SUPER_ADMIN", "ADMIN");
const ops = requireRole("SUPER_ADMIN", "ADMIN", "OPERATIONS");
const editor = requireRole("SUPER_ADMIN", "ADMIN", "OPERATIONS", "EDITOR");

// ── Dashboard ─────────────────────────────────────────────────────────────
router.get("/stats", ops, asyncHandler(getDashboardStats));

// ── Trips ─────────────────────────────────────────────────────────────────
router.get("/trips", ops, asyncHandler(adminListTrips));
router.post("/trips", ops, asyncHandler(adminCreateTrip));
router.get("/trips/:id", ops, asyncHandler(adminGetTrip));
router.patch("/trips/:id", ops, asyncHandler(adminUpdateTrip));
router.delete("/trips/:id", su, asyncHandler(adminDeleteTrip));
router.patch("/trips/:id/status", ops, asyncHandler(adminPublishTrip));

// ── Departures ────────────────────────────────────────────────────────────
router.get("/trips/:id/departures", ops, asyncHandler(adminListDepartures));
router.post("/trips/:id/departures", ops, asyncHandler(adminCreateDeparture));
router.patch("/departures/:depId", ops, asyncHandler(adminUpdateDeparture));
router.delete("/departures/:depId", su, asyncHandler(adminDeleteDeparture));

// ── Destinations ──────────────────────────────────────────────────────────
router.get("/destinations", editor, asyncHandler(adminListDestinations));
router.post("/destinations", ops, asyncHandler(adminCreateDestination));
router.get("/destinations/:id", editor, asyncHandler(adminGetDestination));
router.patch("/destinations/:id", ops, asyncHandler(adminUpdateDestination));
router.delete("/destinations/:id", su, asyncHandler(adminDeleteDestination));

// ── Bookings ──────────────────────────────────────────────────────────────
router.get("/bookings", ops, asyncHandler(adminListBookings));
router.get("/bookings/:id", ops, asyncHandler(adminGetBooking));
router.patch("/bookings/:id/status", ops, asyncHandler(adminUpdateBookingStatus));

// ── Customers ─────────────────────────────────────────────────────────────
router.get("/customers", ops, asyncHandler(adminListCustomers));
router.get("/customers/:id", ops, asyncHandler(adminGetCustomer));
router.patch("/customers/:id", su, asyncHandler(adminUpdateCustomer));

// ── Reviews ───────────────────────────────────────────────────────────────
router.get("/reviews", editor, asyncHandler(adminListReviews));
router.patch("/reviews/:id/status", editor, asyncHandler(adminUpdateReviewStatus));
router.delete("/reviews/:id", su, asyncHandler(adminDeleteReview));

// ── Stories ───────────────────────────────────────────────────────────────
router.get("/stories", editor, asyncHandler(adminListStories));
router.post("/stories", editor, asyncHandler(adminCreateStory));
router.get("/stories/:id", editor, asyncHandler(adminGetStory));
router.patch("/stories/:id", editor, asyncHandler(adminUpdateStory));
router.delete("/stories/:id", su, asyncHandler(adminDeleteStory));

// ── Experiences ───────────────────────────────────────────────────────────
router.get("/experiences", editor, asyncHandler(adminListExperiences));
router.post("/experiences", ops, asyncHandler(adminCreateExperience));
router.get("/experiences/:id", editor, asyncHandler(adminGetExperience));
router.patch("/experiences/:id", ops, asyncHandler(adminUpdateExperience));
router.delete("/experiences/:id", su, asyncHandler(adminDeleteExperience));

	// ── Coupons ───────────────────────────────────────────────────────────────
	router.get("/coupons", ops, asyncHandler(adminListCoupons));
	router.post("/coupons", ops, asyncHandler(adminCreateCoupon));
	router.get("/coupons/:id", ops, asyncHandler(adminGetCoupon));
	router.patch("/coupons/:id", ops, asyncHandler(adminUpdateCoupon));
	router.delete("/coupons/:id", su, asyncHandler(adminDeleteCoupon));

	// ── Leads ─────────────────────────────────────────────────────────────────
	router.get("/leads", ops, asyncHandler(adminListLeads));
	router.get("/leads/:id", ops, asyncHandler(adminGetLead));
	router.patch("/leads/:id", ops, asyncHandler(adminUpdateLead));
	router.delete("/leads/:id", su, asyncHandler(adminDeleteLead));

export default router;
