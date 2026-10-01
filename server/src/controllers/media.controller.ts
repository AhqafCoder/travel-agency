import type { Request, Response } from "express";
import type { AuthUser } from "../middleware/auth.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../lib/cloudinary.js";

/**
 * POST /api/media/upload
 * Accepts: multipart/form-data with field "file" (single image)
 * Optional body field: folder (string) — default "general"
 * Returns: { url, publicId, width?, height? }
 */
export async function uploadMedia(req: Request, res: Response): Promise<void> {
  const file = req.file;
  if (!file) {
    res.status(400).json({ success: false, error: "No file provided" });
    return;
  }

  const folder = (req.body.folder as string | undefined) ?? "general";
  const result = await uploadToCloudinary(file.buffer, folder);

  res.status(201).json({ success: true, data: result });
}

/**
 * DELETE /api/media/:publicId
 * Deletes an asset from Cloudinary. publicId may contain slashes so we use
 * a wildcard route param.
 */
export async function deleteMedia(req: Request, res: Response): Promise<void> {
  const { publicId } = req.params as { publicId: string };
  if (!publicId) {
    res.status(400).json({ success: false, error: "publicId is required" });
    return;
  }

  // Decode URI-encoded publicId (may contain /)
  const decoded = decodeURIComponent(publicId);
  await deleteFromCloudinary(decoded);

  res.json({ success: true, data: { deleted: decoded } });
}
