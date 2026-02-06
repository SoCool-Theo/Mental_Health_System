'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// import api from '../../../api'; // Commented out for now

export default function Dashboard() {
  const router = useRouter();

  // --- STATIC EXAMPLE DATA (No API) ---
  const [appointments] = useState([
    {
      id: 1,
      start_time: "2026-02-06T09:00:00", // ISO format like the backend sends
      patient_details: { full_name: "Sarah Jenkins" },
      service_details: { name: "Initial Consultation" }
    },
    {
      id: 2,
      start_time: "2026-02-06T10:30:00",
      patient_details: { full_name: "Michael Chen" },
      service_details: { name: "CBT Therapy" }
    },
    {
      id: 3,
      start_time: "2026-02-06T14:00:00",
      patient_details: { full_name: "Emma Wilson" },
      service_details: { name: "Follow-up Session" }
    }
  ]);

  const [patients] = useState([
    { id: 101, full_name: "Sarah Jenkins" },
    { id: 102, full_name: "Michael Chen" },
    { id: 103, full_name: "Emma Wilson" },
    { id: 104, full_name: "David Kim" },
    { id: 105, full_name: "Lisa Wong" }
  ]);
  // -------------------------------------

  /* // --- OLD API CODE (Keep this for later) ---
  useEffect(() => {
    const fetchData = async () => {
       // ... your fetch logic here ...
    };
    fetchData();
  }, [router]);
  */

  // Safe formatting helper
  const formatTime = (isoString) => {
    if (!isoString) return "09:00";
    try {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return "--:--";
    }
  };

  // Safe name helper
  const getPatientName = (appt) => {
      if (appt.patient_details?.full_name) return appt.patient_details.full_name;
      if (appt.patient_details?.user?.username) return appt.patient_details.user.username;
      return "Unknown Patient";
  };

  return (
    <div className="main-layout" style={{ gap: '20px' }}>
      
      {/* LEFT: SCHEDULE */}
      <div className="schedule-pane">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Daily Schedule</span>
            <span style={{ fontSize: '12px', color: '#888' }}>All Upcoming</span>
          </div>

          <div className="schedule-grid">
            {appointments.length === 0 && (
              <p style={{ padding: '20px', color: '#999' }}>No appointments found.</p>
            )}

            {appointments.map((appt) => (
              <div className="schedule-row" key={appt.id}>
                
                {/* Time */}
                <div className="time-col">
                  {formatTime(appt.start_time)}
                </div>
                
                {/* Info */}
                <div className="info-col">
                  <div className="patient-name">
                    {getPatientName(appt)}
                  </div>
                  <div className="appt-type">
                    {appt.service_details?.name || "Session"}
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
             <span style={{ fontSize: '12px', color: '#888' }}>{patients.length} Active</span>
          </div>
          
          <div className="caseload-list">
              {patients.map(p => (
                <div key={p.id} style={{ padding: '12px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  
                  {/* Left Side: Avatar + Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '35px', height: '35px', background: '#e0faea', color: '#006421', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                      {(p.full_name || "P").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>
                        {p.full_name}
                      </div>
                      <div style={{ fontSize: '10px', color: '#999' }}>ID: {p.id}</div>
                    </div>
                  </div>

                  {/* Right Side: Status Badge */}
                  <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '10px' }}>
                    Active
                  </span>

                </div>
              ))}
          </div>
        </div>
      </div>

    </div>
  );
}