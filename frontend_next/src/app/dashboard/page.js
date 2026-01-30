'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../api'; // Note: Double dot to go back up
import '../styles/Dashboard.css'; // Import your new CSS

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Logout Function
  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  // 2. Fetch Data on Load
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/'); // Kick them out if no token
            return;
        }

        // Add the token to the request headers manually for this call
        const response = await api.get('appointments/', {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("🔍 Data from Django:", response.data);

        // --- THE SMART CHECK (From our previous debugging) ---
        if (Array.isArray(response.data)) {
            setAppointments(response.data);
        } else if (response.data.results) {
            setAppointments(response.data.results);
        }
        // ----------------------------------------------------

      } catch (err) {
        console.error("Failed to load:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [router]);

  return (
    <div className="dashboard-container">
      <div className="app-shell">
        
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-header">Main Navigation</div>
          <div className="sidebar-nav">
            <div className="sidebar-item sidebar-item-active">
              <iconify-icon icon="lucide:calendar-days" style={{fontSize: '18px'}}></iconify-icon>
              <span>Schedule</span>
            </div>
            <div className="sidebar-item">
              <iconify-icon icon="lucide:users" style={{fontSize: '18px'}}></iconify-icon>
              <span>My Patients</span>
            </div>
          </div>
          
          <div style={{marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #ccc'}}>
            <div className="sidebar-item" onClick={handleLogout} style={{color: 'red'}}>
              <iconify-icon icon="lucide:log-out" style={{fontSize: '18px'}}></iconify-icon>
              <span>Logout</span>
            </div>
          </div>
        </div>

        {/* MAIN AREA */}
        <div className="app-main">
          <div className="header-bar">
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <div className="logo-mark">T</div>
                <h2 style={{fontSize: '18px', fontWeight: 'bold'}}>Therapist Command Center</h2>
            </div>
            <div className="user-profile">
                <span>Dr. Final Test</span>
            </div>
          </div>

          <div className="main-layout">
            {/* LEFT: SCHEDULE */}
            <div className="schedule-pane">
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">Daily Schedule</span>
                        <span style={{fontSize: '12px', color: '#888'}}>Today</span>
                    </div>

                    <div className="schedule-grid">
                        {loading && <p>Loading appointments...</p>}
                        
                        {!loading && appointments.length === 0 && (
                            <p style={{color: '#999', fontStyle: 'italic'}}>No appointments found for today.</p>
                        )}

                        {appointments.map((appt) => (
                            <div className="schedule-row" key={appt.id}>
                                <div className="time-col">
                                    {/* Format time nicely */}
                                    {appt.start_time ? new Date(appt.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "09:00"}
                                </div>
                                <div className="info-col">
                                    <div className="patient-name">
                                        {/* Handle both nested object OR flat ID */}
                                        {appt.patient_details?.user?.username || appt.patient || "Patient"}
                                    </div>
                                    <div className="appt-type">
                                        {appt.service_details?.name || "General Session"}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: CASELOAD */}
            <div className="caseload-pane">
                <div className="card">
                    <div className="card-header">
                        <span className="card-title">My Caseload</span>
                    </div>
                    <p style={{color: '#888'}}>Coming soon...</p>
                </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}