import express from "express";
import { getNearbyServices } from "../controllers/nearbyController.js";

const router = express.Router();

router.get("/", getNearbyServices);
router.get("/services", getNearbyServices);

export default router;