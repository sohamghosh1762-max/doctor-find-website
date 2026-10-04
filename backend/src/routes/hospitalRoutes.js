import express from "express";
import {
  addHospital,
  getAllHospitals,
  updateHospital,
  deleteHospital,
} from "../controllers/hospitalController.js";
import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllHospitals);
router.post("/", protect, isAdmin, addHospital);
router.put("/:id", protect, isAdmin, updateHospital);
router.delete("/:id", protect, isAdmin, deleteHospital);

export default router;