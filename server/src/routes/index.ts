import { Router } from "express";
import healthRouter from "./health.routes.js";
import tripRouter from "./trip.routes.js";
import destinationRouter from "./destination.routes.js";
import experienceRouter from "./experience.routes.js";
import storyRouter from "./story.routes.js";
import bookingRouter from "./booking.routes.js";
import reviewRouter from "./review.routes.js";

const router = Router();

router.use("/health", healthRouter);
router.use("/trips", tripRouter);
router.use("/destinations", destinationRouter);
router.use("/experiences", experienceRouter);
router.use("/stories", storyRouter);
router.use("/bookings", bookingRouter);
router.use("/trips", reviewRouter); // GET/POST /trips/:tripId/reviews

export default router;