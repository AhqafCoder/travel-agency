import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { createLead } from "../controllers/admin.lead.controller.js";

const router = Router();

// Public endpoint to submit enquiry from popup form
router.post("/", asyncHandler(createLead));

export default router;
