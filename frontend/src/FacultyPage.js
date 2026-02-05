import { QRCodeCanvas } from "qrcode.react";
import { useState, useEffect } from "react";

function FacultyPage() {
  const [sessionId, setSessionId] = useState("");
  const [expiryTime, setExpiryTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const createSession = async () => {
    const res = await fetch("http://localhost:5000/create-session", {
      method: "POST"
    });
    const data = await res.json();
    setSessionId(data.sessionId);
    const expiresIn = 10 * 60;
    setExpiryTime(Date.now() + expiresIn * 1000);
    setTimeLeft(expiresIn);

  };

  useEffect(() => {
    if (!expiryTime) return;

    const interval = setInterval(() => {
      const remaining = Math.floor((expiryTime - Date.now()) / 1000);
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

  return (
    <div className="container">

      <div className="card">
        <h1>Smart Attendance System</h1>
        <p>NIT Trichy</p>
      </div>

      <div className="card">
        <h2>Faculty Dashboard</h2>
        <button onClick={createSession}>
          Generate Attendance QR
        </button>
      </div>

      {sessionId && (
        <div className="card">
          <QRCodeCanvas value={sessionId} size={200} />
          <p>Session ID:</p>
          <small>{sessionId}</small>
          <p style={{ color: "green", marginTop: "10px" }}>
            Session Active
          </p>
        </div>
      )}

      {timeLeft > 0 && (
        <div className="timer">
          Session expires in {timeLeft} seconds
        </div>
      )}

    </div>
  );

}

export default FacultyPage;
