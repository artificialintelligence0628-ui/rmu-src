import { Router } from "express";
import { upload, uploadBufferToCloudinary } from "../utils/cloudinary.js";
import { requireAdmin } from "../middleware/authMiddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

// POST /api/upload — admin only. Field name: "file"
router.post(
  "/",
  requireAdmin,
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const result = await uploadBufferToCloudinary(req.file.buffer, {
      resource_type: req.file.mimetype === "application/pdf" ? "raw" : "image",
    });
    res.status(201).json({ url: result.secure_url, public_id: result.public_id });
  })
);

export default router;
