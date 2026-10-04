import express from "express";
import {
  createPrescription,
  getMyPrescriptions,
  getPrescriptionById,
  requestPrescriptionRefill,
} from "../controllers/prescriptionController.js";
import protect from "../middleware/authMiddleware.js";
import { isDoctorOrAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", isDoctorOrAdmin, createPrescription);
router.get("/", getMyPrescriptions);
router.get("/:id", getPrescriptionById);
router.post("/:id/refill", requestPrescriptionRefill);

export default router;