import express from "express";

const router = express.Router();

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!process.env.GOOGLE_MAPS_API_KEY) {
      return res.json([]);
    }

    const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
    url.searchParams.set("location", `${lat},${lng}`);
    url.searchParams.set("radius", "5000");
    url.searchParams.set("type", "hospital");
    url.searchParams.set("key", process.env.GOOGLE_MAPS_API_KEY);

    const response = await fetch(url.toString());
    const data = await response.json();

    res.json(data.results || []);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching places from Google Maps API",
    });
  }
});

export default router;