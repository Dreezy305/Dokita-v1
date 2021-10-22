const express = require("express");
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctorById,
  paginateDoctors,
  deleteDoctorById,
} = require("../controllers/doctor");

const router = express.Router();

router.post("/doctors", createDoctor); // create doctors
router.get("/allDoctors", getDoctors); // get all doctors
router.get("/doctors", paginateDoctors); // get paginated doctors
router.get("/doctors/:id", getDoctorById); // get doctors by id
router.put("/doctors/:id", updateDoctorById); // update doctors records
router.put("/doctors/:id", deleteDoctorById); // delete doctor record by Id

module.exports = router;
