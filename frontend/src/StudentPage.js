import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

function StudentPage() {
  const [studentId, setStudentId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [message, setMessage] = useState("");
  const [scanning, setScanning] = useState(false);

  const markAttendance = async () => {
    if (!studentId || !sessionId) {
      setMessage("Enter both Student ID and Session ID");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/mark-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, sessionId })
      });

      const data = await res.json();
      setMessage(data.message);
    } catch {
      setMessage("Server error");
    }
  };

  // ✅ 1. QR Scanner lifecycle
  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        console.log("QR scanned:", decodedText);
        setSessionId(decodedText);
        setScanning(false);
        scanner.clear();
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scanning]);

  // ✅ 2. Auto-submit when QR fills sessionId
  useEffect(() => {
    if (studentId && sessionId) {
      markAttendance();
    }
  }, [sessionId]);   // ← triggered by QR scan

  return (
    <div className="container">
      <div className="card">
        <h1>Attendance Portal</h1>
        <p>Scan QR or enter details to mark attendance</p>
      </div>

      <div className="card">
        <label>Student ID</label>
        <input
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Enter your Roll Number"
        />

        <label style={{ marginTop: "10px" }}>Session ID</label>
        <input
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          placeholder="Paste Session ID"
        />
      </div>

      <div className="card">
        <button onClick={() => setScanning(true)}>
          Open Camera
        </button>

        <button
          style={{ marginTop: "10px", background: "#16a34a" }}
          onClick={markAttendance}
        >
          Submit Attendance
        </button>
      </div>

      {scanning && (
        <div className="card">
          <div id="qr-reader" />
          <p style={{ fontSize: "12px" }}>
            Point camera at the QR code
          </p>
        </div>
      )}

      {message && (
        <div className="card">
          <p style={{ color: message.includes("marked") ? "green" : "red" }}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
}

export default StudentPage;
