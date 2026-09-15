import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getExperience,
  listExperiences,
} from "../controllers/experience.controller.js";

const router = Router();

router.get("/", asyncHandler(listExperiences));
router.get("/:slug", asyncHandler(getExperience));

export default router;