const express = require("express");
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctorById,
} = require("../controllers/doctor");

const router = express.Router();

router.post("/doctors", createDoctor);
router.get("/doctors", getDoctors);
router.get("/doctors/:id", getDoctorById);
router.put("/doctors/:id", updateDoctorById);

module.exports = router;
