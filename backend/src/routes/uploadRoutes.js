import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected Upload: Image / Avatar / Doctor Certificate
router.post(
  "/image",
  protect,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No valid image file uploaded.",
        code: "NO_FILE",
      });
    }

    res.status(200).json({
      success: true,
      imageUrl: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
    });
  }
);

// Protected Upload: Medical Record Document (PDF / Image)
router.post(
  "/document",
  protect,
  upload.single("document"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No valid document file uploaded.",
        code: "NO_FILE",
      });
    }

    res.status(200).json({
      success: true,
      fileUrl: `/uploads/${req.file.filename}`,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  }
);

export default router;