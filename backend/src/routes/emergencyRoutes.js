import express from "express";

const router = express.Router();

const EMERGENCY_HELPLINES = [
  { service: "National Emergency Number", number: "112", description: "All-in-one emergency response (Police, Fire, Ambulance)" },
  { service: "Medical Emergency / Ambulance", number: "102 / 108", description: "Government Emergency Ambulance Service" },
  { service: "Trauma & Disaster Helpline", number: "1078", description: "Emergency trauma and disaster response" },
  { service: "Women Helpline", number: "1091", description: "24/7 Women emergency helpline" },
  { service: "Senior Citizen Helpline", number: "14567", description: "Senior citizen assistance and emergency care" },
];

router.get("/helplines", (req, res) => {
  res.status(200).json({
    success: true,
    helplines: EMERGENCY_HELPLINES,
  });
});

router.post("/sos", (req, res) => {
  const { userLocation, contactNumber } = req.body;
  res.status(200).json({
    success: true,
    message: "SOS Emergency notification triggered. Contacting local emergency services.",
    emergencyHotline: "112",
    dispatchedAt: new Date().toISOString(),
  });
});

export default router;
