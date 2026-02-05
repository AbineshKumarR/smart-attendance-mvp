import { useState } from "react";

const TOTAL_STUDENTS = 60;

function FacultyAnalytics() {
  const [sessionId, setSessionId] = useState("");
  const [data, setData] = useState(null);

  const fetchAnalytics = async () => {
    if (!sessionId) {
      alert("Please enter a Session ID");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/session/${sessionId}`);

      if (!res.ok) {
        alert("Session not found");
        return;
      }

      const json = await res.json();

      const students = json.students || json.attendance || [];

      setData({
        total: json.total ?? students.length,
        students: students
      });

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  const downloadCSV = () => {
    if (!data || data.students.length === 0) {
      alert("No attendance data to download");
      return;
    }

    let csv = "Student ID,Time\n";

    data.students.forEach(s => {
      const time = s.time
        ? new Date(s.time).toLocaleTimeString()
        : "-";
      csv += `${s.studentId || s},${time}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${sessionId}.csv`;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container">

      <div className="card">
        <h1>Session Analytics</h1>

        <input
          placeholder="Enter Session ID"
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
        />

        <button onClick={fetchAnalytics}>
          View Analytics
        </button>
      </div>

      {data && (
        <div className="card">

          <h2>Attendance Summary</h2>

          <div
            style={{
              marginTop: "10px",
              padding: "12px",
              borderRadius: "12px",
              background: "#ecfeff",
              fontWeight: "700",
              textAlign: "center"
            }}
          >
            {Math.round((data.total / TOTAL_STUDENTS) * 100)}% Attendance
          </div>

          <p style={{ marginTop: "10px" }}>
            Total Students Present: {data.total}
          </p>

          <button
            className="secondary"
            onClick={downloadCSV}
          >
            Download CSV
          </button>

          {data.students.length === 0 ? (
            <p style={{ marginTop: "10px" }}>
              No attendance marked yet.
            </p>
          ) : (
            <div style={{ marginTop: "10px" }}>
              {data.students.map((s, i) => (
                <div className="list-item" key={i}>
                  <span>{s.studentId || s}</span>
                  <span>
                    {s.time
                      ? new Date(s.time).toLocaleTimeString()
                      : "-"}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default FacultyAnalytics;
