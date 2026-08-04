import express from "express";

import {
  addPharmacy,
  getAllPharmacies,
  getPharmacyById
} from "../controllers/pharmacyController.js";

const router = express.Router();

router.post("/", addPharmacy);

router.get("/", getAllPharmacies);

router.get("/:id", getPharmacyById);

export default router;