const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
app.use(cors());
app.use(express.json());

console.log("Starting backend...");

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));


app.use("/students", studentRoutes);

app.get("/", (req, res) => {
  res.send("Student Management Backend Running");
});

app.listen(5001, () => {
  console.log("Backend running on http://localhost:5001");
});
