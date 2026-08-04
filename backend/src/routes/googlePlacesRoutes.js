import express from "express";
import axios from "axios";

const router = express.Router();

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lng}`,
          radius: 5000,
          type: "hospital",
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    console.log(response.data);

    res.json(response.data.results);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error fetching places",
    });
  }
});

export default router;