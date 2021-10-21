const Doctor = require("../models/doctors.model");

//create doctors
function createDoctor(req, res) {
  let { picture, firstName, lastName, department, role } = req.body;

  //  validate req.body fields
  let errors = [];

  if (!picture) {
    errors.push({ picture: "provide a valid picture" });
  }

  if (!firstName) {
    errors.push({ firstName: "provide your first name" });
  }

  if (!lastName) {
    errors.push({ lastName: "provide your last name" });
  }

  if (!department) {
    errors.push({ department: "provide your department" });
  }

  if (!role) {
    errors.push({ role: "provide your role" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors: errors });
  }

  const doctor = new Doctor({
    picture: picture,
    firstName: firstName,
    lastName: lastName,
    department: department,
    role: role,
  });
  doctor
    .save()
    .then((response) => {
      console.log(response);
      res.status(200).json({
        success: true,
        message: "doctor created successfully",
        payload: doctor,
      });
    })
    .catch((err) => {
      res.status(400).json({
        success: false,
        message: "something went wrong",
        error: [{ errors: err }],
      });
    });
}

// get all doctors from end point
const getDoctors = async (req, res) => {
  const doctors = await Doctor.find();
  if (doctors) {
    res.status(200).json({
      success: true,
      payload: doctors,
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "something went wrong",
    });
  }
};

//geta single doctor using id
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "successful operation",
        payload: doctor,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "something went wrong",
    });
  }
};

//update doctor record using id
const updateDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    console.log(doctor);
    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "not found",
      });
    } else {
      doctor.picture = req.body.picture;
      doctor.firstName = req.body.firstName;
      doctor.lastName = req.body.lastName;
      doctor.department = req.body.department;
      doctor.role = req.body.role;
      return res.status(200).json({
        success: true,
        message: "successful operation",
        payload: doctor,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "something went wrong",
    });
  }
};

module.exports = { createDoctor, getDoctors, getDoctorById, updateDoctorById };
