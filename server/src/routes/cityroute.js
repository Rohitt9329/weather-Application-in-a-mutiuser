const express = require("express");

const {
  addCity,
  deleteCity,
  getCity,
  listCities,
  previewCity,
  updateCity,
} = require("../Controllers/citycontroller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", listCities);
router.post("/", addCity);
router.get("/preview", previewCity);
router.get("/:id", getCity);
router.patch("/:id", updateCity);
router.delete("/:id", deleteCity);

module.exports = router;
