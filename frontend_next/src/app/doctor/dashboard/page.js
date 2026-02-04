'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../api'; // Correct path from src/app/doctor/dashboard/

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) { router.push('/login'); return; }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // 1. Fetch Appointments
        const apptResponse = await api.get('appointments/', config);
        if (Array.isArray(apptResponse.data)) setAppointments(apptResponse.data);
        else if (apptResponse.data.results) setAppointments(apptResponse.data.results);

        // 2. Fetch Patients (The Caseload)
        const patientResponse = await api.get('patients/', config);
        if (Array.isArray(patientResponse.data)) setPatients(patientResponse.data);
        else if (patientResponse.data.results) setPatients(patientResponse.data.results);

      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="main-layout">
      
      {/* LEFT: SCHEDULE */}
      <div className="schedule-pane">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Daily Schedule</span>
            <span style={{ fontSize: '12px', color: '#888' }}>Today</span>
          </div>

          <div className="schedule-grid">
            {loading && <p>Loading appointments...</p>}

            {!loading && appointments.length === 0 && (
              <p style={{ color: '#999', fontStyle: 'italic', padding: '10px' }}>
                No appointments found for today.
              </p>
            )}

            {appointments.map((appt) => (
              <div className="schedule-row" key={appt.id}>
                <div className="time-col">
                  {appt.start_time 
                    ? new Date(appt.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                    : "09:00"}
                </div>
                <div className="info-col">
                  <div className="patient-name">
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
            <div>
              <span className="card-title">My Caseload</span>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Quick view of assigned patients & status
              </div>
            </div>
            <span style={{ fontSize: '12px', color: '#888', padding: '10px 10px' }}>
              {patients.length} {patients.length === 1 ? 'Patient' : 'Patients'}
            </span>
          </div>
          
          <div className="caseload-list">
            {patients.length === 0 ? (
              <p style={{ color: '#888', padding: '10px' }}>No active patients.</p>
            ) : (
              patients.map((p) => (
                <div key={p.id} style={{
                  padding: '12px 0',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>

                  {/* LEFT GROUP: Avatar + Name + ID */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px', height: '40px',
                      background: '#e0f7fa', color: '#006064',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', fontSize: '16px'
                    }}>
                      {(p.full_name || p.user_name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>
                        {p.full_name || p.user_name || "Unknown Patient"}
                      </div>
                      <div style={{ fontSize: '11px', color: '#999' }}>
                        ID: {p.id}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT GROUP: Status */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ marginBottom: '4px' }}>
                      <span style={{
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        fontSize: '11px', /* Adjusted slightly smaller for badge look */
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '12px',
                      }}>
                        Active
                      </span>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}