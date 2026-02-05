import { useState, useEffect } from "react";
import FacultyPage from "./FacultyPage";
import StudentPage from "./StudentPage";
import FacultyAnalytics from "./FacultyAnalytics";
import "./App.css";
function App() {
  const [page, setPage] = useState("faculty");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.body.className = dark ? "dark" : "";
  }, [dark]);

  return (
    <div>
      <div className="nav">
        <button onClick={() => setPage("faculty")}>Faculty</button>
        <button onClick={() => setPage("student")}>Student</button>
        <button onClick={() => setPage("analytics")}>Analytics</button>
      </div>

      <button onClick={() => setDark(!dark)}>
        {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {page === "faculty" && <FacultyPage />}
      {page === "student" && <StudentPage />}
      {page === "analytics" && <FacultyAnalytics />}

    </div>
  );
}

export default App;
