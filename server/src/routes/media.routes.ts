import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { uploadMedia, deleteMedia } from "../controllers/media.controller.js";

const router = Router();

// All media routes require auth + at least OPERATIONS role
router.use(requireAuth, requireRole("SUPER_ADMIN", "ADMIN", "OPERATIONS", "EDITOR"));

router.post(
  "/upload",
  upload.single("file"),
  asyncHandler(uploadMedia)
);

router.delete("/:publicId(*)", asyncHandler(deleteMedia));

export default router;
