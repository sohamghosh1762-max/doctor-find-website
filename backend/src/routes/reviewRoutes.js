import express from "express";

import {
  addReview,
  getDoctorReviews,
  getAllReviews,
  deleteReview
} from "../controllers/reviewController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addReview);

router.get(
  "/doctor/:id",
  getDoctorReviews
);

router.get(
  "/",
  getAllReviews
);

router.delete(
  "/:id",
  deleteReview
);

export default router;