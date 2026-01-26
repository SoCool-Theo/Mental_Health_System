import { useEffect, useState } from "react";
import api from "../api";
import "./Dashboard.css";

function Dashboard({ onLogout }) {
  const [user, setUser] = useState("Dr. Alex Rivera");
  const [appointments, setAppointments] = useState([]); // Default is empty list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get("appointments/");
        console.log("🔍 API RESPONSE:", response.data); 

        // --- SMARTER CHECK ---
        if (Array.isArray(response.data)) {
          // Case 1: Django sent a simple list
          setAppointments(response.data);
        } 
        else if (response.data.results && Array.isArray(response.data.results)) {
          // Case 2: Django sent a Paginated Object (Data is inside .results)
          console.log("✅ Found paginated results!");
          setAppointments(response.data.results);
        } 
        else {
          // Case 3: Unknown format
          console.error("Data structure unknown:", response.data);
          setError("Invalid data format received.");
        }
        // ---------------------

      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load appointments.");
        if (err.response && err.response.status === 401) {
            alert("Session expired. Please login again.");
            onLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [onLogout]);

  return (
    <div className="app-root">
      <div className="app-shell">
        {/* --- SIDEBAR --- */}
        <div className="sidebar">
          <div className="sidebar-header">Main Navigation</div>
          <div className="sidebar-nav">
            <div className="sidebar-item sidebar-item-active">
              <iconify-icon icon="lucide:calendar-days" style={{ fontSize: "18px" }}></iconify-icon>
              <span>Schedule</span>
            </div>
            <div className="sidebar-item">
              <iconify-icon icon="lucide:layout-dashboard" style={{ fontSize: "18px" }}></iconify-icon>
              <span>My Patients</span>
            </div>
          </div>
          <div className="sidebar-footer">
            <div className="sidebar-item" onClick={onLogout} style={{cursor: "pointer", color: "red"}}>
              <iconify-icon icon="lucide:log-out" style={{ fontSize: "18px" }}></iconify-icon>
              <span>Logout</span>
            </div>
          </div>
        </div>

        {/* --- MAIN AREA --- */}
        <div className="app-main">
          <div className="dashboard-header">
            <div className="header-left">
              <div className="header-logo-mark">T</div>
              <div className="header-app-name">Therapist Command Center</div>
            </div>
             <div className="header-right">Dr. Rivera</div>
          </div>

          <div className="main-layout">
            <div className="schedule-pane">
              <div className="card">
                <div className="card-header">
                  <div className="section-title">Daily Schedule</div>
                </div>
                
                <div className="schedule-grid">
                  {/* ERROR STATE */}
                  {error && <p style={{color: "red", padding: "20px"}}>{error}</p>}

                  {/* LOADING STATE */}
                  {loading && <p style={{padding: "20px"}}>Loading...</p>}

                  {/* DATA STATE */}
                  {!loading && !error && appointments.length === 0 && (
                     <p style={{padding: "20px", color: "#888"}}>No appointments found.</p>
                  )}

                  {/* --- DEBUG BOX START (Delete this later) --- */}
                  <div style={{background: "#333", color: "#fff", padding: "10px", margin: "10px", borderRadius: "5px"}}>
                    <h4>🕵️ DEBUG: What is Django sending?</h4>
                    <pre style={{fontSize: "12px"}}>
                      {JSON.stringify(appointments, null, 2)}
                    </pre>
                  </div>
                  {/* --- DEBUG BOX END --- */}

                  {/* SUCCESS LOOP */}
                  {Array.isArray(appointments) && appointments.map((appt) => (
                    <div className="schedule-row" key={appt.id || Math.random()}>
                      <div className="schedule-time-cell">
                        {appt.time ? appt.time.substring(0, 5) : "09:00"}
                      </div>
                      <div className="schedule-slot-cell">
                        <div className="schedule-patient-name">
                           {/* Try to find the right name field */}
                           {appt.patient_name || appt.patient || "Unknown Patient"}
                        </div>
                        <div className="schedule-meta">
                           {appt.reason || appt.status || "Checkup"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Caseload (Static) */}
             <div className="caseload-pane">
              <div className="card">
                <div className="card-header">
                   <div className="section-title">Caseload</div>
                </div>
                <div className="caseload-list">
                    <p style={{padding: "10px"}}>Loading...</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;