const express = require("express");
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctorById,
  paginateDoctors,
} = require("../controllers/doctor");

const router = express.Router();

router.post("/doctors", createDoctor); // create doctors
router.get("/doctors", getDoctors); // get all doctors
router.get(`/doctors?page=${page}&limit=${limit}`, paginateDoctors); // get paginated doctors
router.get("/doctors/:id", getDoctorById); // get doctors by id
router.put("/doctors/:id", updateDoctorById); // update doctors records

module.exports = router;
