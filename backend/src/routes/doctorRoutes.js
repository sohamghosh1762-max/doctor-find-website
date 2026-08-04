import express from "express";

import {
  addDoctor,
  getAllDoctors,
  getDoctorById,
  searchDoctors,
  verifyDoctor,
  updateAvailability,
  getAvailability,
  updateDoctor,
  deleteDoctor,
  doctorLogin,
  changeDoctorPassword
} from "../controllers/doctorController.js";

const router = express.Router();

router.post("/", addDoctor);

router.get("/", getAllDoctors);

router.get("/search", searchDoctors);

router.put("/verify/:id", verifyDoctor);

router.put("/:id/slots", updateAvailability);

router.get("/:id/slots", getAvailability);

router.get("/:id", getDoctorById);

router.put("/:id", updateDoctor);

router.delete("/:id", deleteDoctor);

router.post("/login", doctorLogin);

router.put("/change-password/:id", changeDoctorPassword);

export default router;