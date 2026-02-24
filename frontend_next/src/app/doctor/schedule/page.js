'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../api'; 

export default function Dashboard() {
  const router = useRouter();

  // --- DYNAMIC STATES ---
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                router.push('/login');
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch Appointments and Patients simultaneously
            const [apptRes, patRes] = await Promise.all([
                api.get('appointments/', config),
                api.get('patients/', config)
            ]);

            // Set Appointments (Sort by newest/upcoming)
            const apptData = apptRes.data.results || apptRes.data;
            setAppointments(apptData.sort((a, b) => new Date(a.start_time) - new Date(b.start_time)));

            // Set Patients
            setPatients(patRes.data.results || patRes.data);

        } catch (err) {
            console.error("Error fetching schedule data:", err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [router]);

  // --- FORMATTING HELPERS ---
  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    try {
        return new Date(isoString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } catch (e) {
        return "--:--";
    }
  };

  const getPatientName = (appt) => {
      if (appt.patient_details?.full_name) return appt.patient_details.full_name;
      if (appt.patient_details?.user?.username) return appt.patient_details.user.username;
      return "Unknown Patient";
  };

  const getPatientInitials = (name) => {
      if (!name || name === "Unknown Patient") return "P";
      const parts = name.split(' ');
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return name[0].toUpperCase();
  };

  // --- GROUP APPOINTMENTS BY DATE ---
  const groupedAppointments = appointments.reduce((acc, appt) => {
      const dateObj = new Date(appt.start_time);

      // Create a readable date string (e.g., "Monday, Oct 20")
      let dateString = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

      // Replace with "Today" if it matches today's date
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      if (dateString === today) {
          dateString = "Today";
      }

      if (!acc[dateString]) acc[dateString] = [];
      acc[dateString].push(appt);
      return acc;
  }, {});


  return (
    <div className="main-layout" style={{ display: 'flex', gap: '30px', padding: '30px', minHeight: '100%' }}>

      {/* ================= LEFT: DAILY SCHEDULE ================= */}
      <div className="schedule-pane" style={{ flex: 1 }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
            <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Upcoming Schedule</h2>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '5px 0 0 0' }}>Manage your appointments and sessions.</p>
            </div>
            <span style={{ fontSize: '13px', background: '#e0f2fe', color: '#0284c7', padding: '6px 12px', borderRadius: '20px', fontWeight: '600' }}>
                {appointments.length} Total Appointments
            </span>
        </div>

        <div className="card" style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>

          {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Loading schedule...</div>
          ) : appointments.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>No upcoming appointments booked.</div>
          ) : (
              <div>
                  {Object.entries(groupedAppointments).map(([dateStr, appts]) => (
                      <div key={dateStr}>

                          {/* DATE HEADER */}
                          <div style={{ background: '#f8fafc', padding: '12px 24px', borderBottom: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 'bold', color: '#475569' }}>
                              {dateStr}
                          </div>

                          {/* APPOINTMENT ROWS */}
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                              {appts.map((appt) => {
                                  const pName = getPatientName(appt);
                                  return (
                                      <div
                                          key={appt.id}
                                          style={{
                                              display: 'flex', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s ease', cursor: 'pointer'
                                          }}
                                          onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                                          onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                          onClick={() => router.push(`/doctor/patients/${appt.patient}`)} // Optional: click to go to patient profile
                                      >

                                          {/* Time Column */}
                                          <div style={{ minWidth: '120px', borderRight: '2px solid #e2e8f0', marginRight: '20px' }}>
                                              <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
                                                  {formatTime(appt.start_time)}
                                              </div>
                                              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                                                  {appt.service_details?.duration_minutes || 50} min
                                              </div>
                                          </div>

                                          {/* Patient Info Column */}
                                          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
                                              <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#e0faea', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px' }}>
                                                  {getPatientInitials(pName)}
                                              </div>
                                              <div>
                                                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
                                                      {pName}
                                                  </div>
                                                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                      <iconify-icon icon="lucide:video" style={{ fontSize: '14px' }}></iconify-icon>
                                                      {appt.service_details?.name || "Therapy Session"}
                                                  </div>
                                              </div>
                                          </div>

                                          {/* Status / Action Column */}
                                          <div>
                                              <span style={{
                                                  background: appt.status === 'COMPLETED' ? '#dcfce7' : '#f1f5f9',
                                                  color: appt.status === 'COMPLETED' ? '#16a34a' : '#475569',
                                                  padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600'
                                              }}>
                                                  {appt.status || 'SCHEDULED'}
                                              </span>
                                          </div>

                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                  ))}
              </div>
          )}
        </div>
      </div>

      {/* ================= RIGHT: CASELOAD ================= */}
      <div className="caseload-pane" style={{ width: '350px' }}>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>Caseload</h2>

        <div className="card" style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px', marginBottom: '10px' }}>
             <span className="card-title" style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>My Patients</span>
             <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>{patients.length} Active</span>
          </div>

          <div className="caseload-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {patients.length === 0 && <p style={{ fontSize: '14px', color: '#94a3b8', padding: '10px 0' }}>No patients assigned yet.</p>}

              {patients.map(p => (
                <div
                    key={p.id}
                    style={{ padding: '12px 10px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '8px', transition: 'background 0.2s ease', cursor: 'pointer' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    onClick={() => router.push(`/doctor/patients/${p.id}`)}
                >

                  {/* Avatar + Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '38px', height: '38px', background: '#f1f5f9', color: '#475569', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                      {getPatientInitials(p.full_name || p.user_name)}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>
                        {p.full_name || p.user_name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Patient ID: {p.id}</div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span style={{ backgroundColor: '#dcfce7', color: '#166534', fontSize: '10px', fontWeight: '600', padding: '4px 8px', borderRadius: '12px' }}>
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