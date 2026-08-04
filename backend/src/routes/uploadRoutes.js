import express from "express";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/image",
  upload.single("image"),
  (req, res) => {
    res.status(200).json({
      success: true,
      imageUrl: `/uploads/${req.file.filename}`
    });
  }
);

export default router;