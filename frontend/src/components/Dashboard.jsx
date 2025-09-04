import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // custom styles

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");
  const [uploads, setUploads] = useState([]);
  const [stats, setStats] = useState({ totalFiles: 0, totalCharts: 0 });

  // Simulate fetching from backend
  useEffect(() => {
    // TODO: Replace with API call
    setUsername("Pratik"); // dynamically from backend / localStorage
    setUploads([
      { id: 1, filename: "Sales_Q1.xlsx", date: "2025-08-29" },
      { id: 2, filename: "Marketing_Data.xlsx", date: "2025-08-30" },
      { id: 3, filename: "HR_Report.xlsx", date: "2025-08-31" },
    ]);
    setStats({ totalFiles: 3, totalCharts: 8 });
  }, []);

  const handleFileClick = (file) => {
    // Navigate to Charts page with that file selected
    navigate("/charts", { state: { file } });
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1>Welcome back, {username} 👋</h1>
        <p>{new Date().toDateString()}</p>
      </header>

      {/* Quick Actions */}
      <div className="dashboard-actions">
        <button onClick={() => navigate("/upload")}>📂 Upload New File</button>
        <button onClick={() => navigate("/charts")}>📊 View Charts</button>
       { /*<button onClick={() => navigate("/login")}>🚪 Logout</button>*/}
      </div>

      {/* Stats */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h2>{stats.totalFiles}</h2>
          <p>Files Uploaded</p>
        </div>
        <div className="stat-card">
          <h2>{stats.totalCharts}</h2>
          <p>Charts Generated</p>
        </div>
      </div>

      {/* History */}
      <div className="dashboard-history">
        <h2>📜 Upload History</h2>
        <ul>
          {uploads.map((file) => (
            <li key={file.id} onClick={() => handleFileClick(file)}>
              <span className="filename">{file.filename}</span>
              <span className="date">{file.date}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
