const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();
const app = express();

app.use(express.json());

const studentsFilePath = path.join(__dirname, "data", "students.json");

app.post("/students", (req, res) => {
  try {
    let newStudent = req.body;

    if (!newStudent.name || !newStudent.age || !newStudent.program) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student data" });
    }

    let data = JSON.parse(fs.readFileSync(studentsFilePath, "utf-8"));
    data.push({ id: data.length + 1, ...newStudent });

    fs.writeFileSync(studentsFilePath, JSON.stringify(data, null, 2));

    res
      .status(201)
      .json({ success: true, message: "Student added successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/students", (req, res) => {
  try {
    let data = JSON.parse(fs.readFileSync(studentsFilePath, "utf-8"));
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/students/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, program, enrolled } = req.body;

    let data = JSON.parse(fs.readFileSync(studentsFilePath, "utf-8"));

    const findStudent = data.find((s) => s.id === parseInt(id));

    if (!findStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found!" });
    }

    if (!name || !age || !program || enrolled === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid student data!" });
    }

    findStudent.name = name;
    findStudent.age = age;
    findStudent.program = program;
    findStudent.enrolled = enrolled;

    fs.writeFileSync(studentsFilePath, JSON.stringify(data, null, 2));

    res.status(200).json({
      success: true,
      message: "Student updated successfully!",
      student: findStudent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete("/students/:id", (req, res) => {
  try {
    const { id } = req.params;
    let data = JSON.parse(fs.readFileSync(studentsFilePath, "utf-8"));
    const findStudentIndex = data.findIndex((s) => s.id === parseInt(id));

    if (findStudentIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Student Not Found!" });
    }

    data.splice(findStudentIndex, 1);

    fs.writeFileSync(studentsFilePath, JSON.stringify(data, null, 2));

    res
      .status(200)
      .json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`App running on port: ${process.env.PORT}`);
});
