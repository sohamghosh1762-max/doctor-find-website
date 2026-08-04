import express from "express";
import {
  getNearbyData,
} from "../controllers/locationController.js";

const router = express.Router();

router.get(
  "/nearby",
  getNearbyData
);

export default router;