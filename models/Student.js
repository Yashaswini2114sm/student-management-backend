const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  usn: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true }
});

module.exports = mongoose.model("Student", studentSchema);
