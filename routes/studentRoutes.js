const express = require("express");
const Student = require("../models/Student");
const router = express.Router();
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

// ADD STUDENT
router.post("/add", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.json({ message: "Student Added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL STUDENTS (with filter & sort)
router.get("/", async (req, res) => {
  try {
    const { department, semester, sort } = req.query;

    let filter = {};
    if (department) filter.department = department;
    if (semester) filter.semester = semester;

    let query = Student.find(filter);
    if (sort) query = query.sort({ name: sort === "asc" ? 1 : -1 });

    const students = await query;
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SEARCH STUDENT
router.get("/search/:key", async (req, res) => {
  try {
    const regex = new RegExp(req.params.key, "i");
    const students = await Student.find({
      $or: [{ name: regex }, { usn: regex }]
    });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE STUDENT
router.put("/:id", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Student Updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE STUDENT
router.delete("/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EXPORT CSV
router.get("/export/csv", async (req, res) => {
  try {
    const students = await Student.find();

    const fields = ["name", "usn", "department", "semester"];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(students);

    res.header("Content-Type", "text/csv");
    res.header("Content-Disposition", "attachment; filename=students.csv");

    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// EXPORT PDF
router.get("/export/pdf", async (req, res) => {
  try {
    const students = await Student.find();
    const PDFDocument = require("pdfkit");

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=students.pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Student List", { align: "center" });
    doc.moveDown();

    students.forEach((s, i) => {
      doc.fontSize(12).text(
        `${i + 1}. ${s.name} | ${s.usn} | ${s.department} | Sem: ${s.semester}`
      );
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
