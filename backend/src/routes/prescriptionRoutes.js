import express from "express";
import {
  createPrescription,
  getMyPrescriptions,
  getPrescriptionById,
  requestPrescriptionRefill
} from "../controllers/prescriptionController.js";

const router = express.Router();

router.get("/", getMyPrescriptions);
router.get("/my", getMyPrescriptions);
router.post("/", createPrescription);
router.get("/:id", getPrescriptionById);
router.post("/:id/refill", requestPrescriptionRefill);

export default router;