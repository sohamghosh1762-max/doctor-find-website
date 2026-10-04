import express from "express";
import {
  addReview,
  getDoctorReviews,
  getAllReviews,
  deleteReview,
} from "../controllers/reviewController.js";
import protect from "../middleware/authMiddleware.js";
import { isPatient } from "../middleware/roleMiddleware.js";
import { validateReview } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.get("/doctor/:id", getDoctorReviews);
router.get("/", getAllReviews);
router.post("/", protect, isPatient, validateReview, addReview);
router.delete("/:id", protect, deleteReview);

export default router;