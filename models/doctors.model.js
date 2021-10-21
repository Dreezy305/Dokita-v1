const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const DoctorSchema = new Schema(
  {
    picture: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    department: { type: String, required: true },
    role: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model("Doctor", DoctorSchema);

module.exports = Doctor;
