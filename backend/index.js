const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

const sessions = {};

app.post("/create-session", (req, res) => {
  const sessionId = uuidv4();
  const expiresAt = Date.now() + 60 * 1000;

  sessions[sessionId] = {
    sessionId,
    expiresAt,
    attendance: []
  };

  res.json({ sessionId });
});

app.post("/mark-attendance", (req, res) => {
  const { sessionId, studentId } = req.body;

  const session = sessions[sessionId];
  if (!session) {
    return res.status(400).json({ message: "Invalid session" });
  }

  if (Date.now() > session.expiresAt) {
    return res.status(400).json({ message: "Session expired" });
  }

  const alreadyMarked = session.attendance.find(
    s => s.studentId === studentId
  );
  if (alreadyMarked) {
    return res.status(400).json({ message: "Already marked" });
  }

  session.attendance.push({
    studentId,
    time: new Date()
  });

  res.json({ message: "Attendance marked" });
});

app.get("/session/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const session = sessions[sessionId];

  if (!session) {
    return res.status(404).json({ message: "Session not found" });
  }

  res.json({
    total: session.attendance.length,
    students: session.attendance
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
