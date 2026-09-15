import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getDestination,
  listDestinations,
} from "../controllers/destination.controller.js";

const router = Router();

router.get("/", asyncHandler(listDestinations));
router.get("/:slug", asyncHandler(getDestination));

export default router;