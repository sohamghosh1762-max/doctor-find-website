import express from "express";

import {
  getAvailability,
  updateAvailability
} from "../controllers/availabilityController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getAvailability
);

router.put(
  "/",
  protect,
  updateAvailability
);

export default router;