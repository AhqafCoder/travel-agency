import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getStory, listStories } from "../controllers/story.controller.js";

const router = Router();

router.get("/", asyncHandler(listStories));
router.get("/:slug", asyncHandler(getStory));

export default router;