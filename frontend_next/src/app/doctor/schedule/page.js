'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../api'; 

export default function Dashboard() {
  const router = useRouter();

  // --- DYNAMIC STATES ---
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  
  // --- FORM STATES FOR NEW AVAILABILITY ---
  const [availDate, setAvailDate] = useState('');
  const [availStartTime, setAvailStartTime] = useState('');
  const [availEndTime, setAvailEndTime] = useState('');
  const [saving, setSaving] = useState(false);

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch Appointments, Patients, and Availabilities simultaneously
            const [apptRes, patRes, availRes] = await Promise.all([
                api.get('appointments/', config),
                api.get('patients/', config),
                api.get('availability/', config)
            ]);

            // Set Appointments (Sort by newest/upcoming)
            const apptData = apptRes.data.results || apptRes.data;
            setAppointments(apptData.sort((a, b) => new Date(a.start_time) - new Date(b.start_time)));

            // Set Patients
            setPatients(patRes.data.results || patRes.data);

            // Set Current Availabilities (Sort by date and time)
            const availData = availRes.data.results || availRes.data;
            setAvailabilities(availData);

        } catch (err) {
            console.error("Error fetching schedule data:", err);
        }
    };
    fetchData();
  }, [router]);

  // --- HANDLE ADDING NEW AVAILABILITY ---
  const handleAddAvailability = async (e) => {
      e.preventDefault();
      setSaving(true);
      
      try {
          const token = localStorage.getItem('access_token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          
          const payload = {
              date: availDate,
              start_time: availStartTime,
              end_time: availEndTime
          };

          const res = await api.post('availability/', payload, config);
          
          // Add the new slot to the list instantly so the UI updates
          setAvailabilities([...availabilities, res.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
          
          // Clear form
          setAvailDate('');
          setAvailStartTime('');
          setAvailEndTime('');
          alert("Time slot added successfully! Patients can now book this time.");

      } catch (err) {
          console.error("Error adding availability:", err);
          alert("Failed to add availability. Please check the inputs.");
      } finally {
          setSaving(false);
      }
  };

  // --- HANDLE DELETE AVAILABILITY ---
  const handleDeleteAvailability = async (id) => {
      if (!confirm("Are you sure you want to remove this open slot?")) return;
      
      try {
          const token = localStorage.getItem('access_token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          
          await api.delete(`availability/${id}/`, config);
          
          // Remove from UI
          setAvailabilities(availabilities.filter(a => a.id !== id));
      } catch (err) {
          console.error("Error deleting slot:", err);
      }
  };

  // --- FORMATTING HELPERS ---
  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    try {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return "--:--";
    }
  };

  const formatSimpleTime = (timeString) => {
      if (!timeString) return "";
      const [hour, minute] = timeString.split(':');
      const dateObj = new Date();
      dateObj.setHours(parseInt(hour, 10), parseInt(minute, 10));
      return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getPatientName = (appt) => {
      if (appt.patient_details?.full_name) return appt.patient_details.full_name;
      if (appt.patient_details?.user?.username) return appt.patient_details.user.username;
      return "Unknown Patient";
  };

  return (
    <div className="main-layout" style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      
      {/* ================= LEFT: SCHEDULE ================= */}
      <div className="schedule-pane" style={{ flex: 1 }}>
        <div className="card" style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
            <span className="card-title" style={{ fontSize: '18px', fontWeight: 'bold' }}>Daily Schedule</span>
            <span style={{ fontSize: '12px', color: '#888' }}>All Upcoming</span>
          </div>

          <div className="schedule-grid">
            {appointments.length === 0 && (
              <p style={{ padding: '20px 0', color: '#999', fontSize: '14px' }}>No upcoming appointments booked.</p>
            )}

            {appointments.map((appt) => (
              <div className="schedule-row" key={appt.id} style={{ display: 'flex', gap: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px', marginBottom: '10px' }}>
                
                {/* Time */}
                <div className="time-col" style={{ fontWeight: 'bold', color: '#334155', minWidth: '80px' }}>
                  {formatTime(appt.start_time)}
                </div>
                
                {/* Info */}
                <div className="info-col">
                  <div className="patient-name" style={{ fontWeight: 'bold', fontSize: '15px' }}>
                    {getPatientName(appt)}
                  </div>
                  <div className="appt-type" style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                    {appt.service_details?.name || "Therapy Session"}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= RIGHT: AVAILABILITY & CASELOAD ================= */}
      <div className="caseload-pane" style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* NEW CARD: Manage Availability */}
        <div className="card" style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
                <span className="card-title" style={{ fontSize: '16px', fontWeight: 'bold' }}>Open Time Slots</span>
            </div>

            {/* Form to Add Slot */}
            <form onSubmit={handleAddAvailability} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', background: '#f0fdf4', padding: '15px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#166534' }}>Add Availability</div>
                
                <input type="date" required value={availDate} onChange={(e) => setAvailDate(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }} />
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="time" required value={availStartTime} onChange={(e) => setAvailStartTime(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }} />
                    <span style={{ alignSelf: 'center', color: '#666' }}>-</span>
                    <input type="time" required value={availEndTime} onChange={(e) => setAvailEndTime(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '13px' }} />
                </div>
                
                <button type="submit" disabled={saving} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}>
                    {saving ? 'Saving...' : '+ Add Slot'}
                </button>
            </form>

            {/* List of Existing Slots */}
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {availabilities.length === 0 && <p style={{ fontSize: '13px', color: '#999' }}>No open slots.</p>}
                
                {availabilities.map(slot => (
                    <div key={slot.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee', fontSize: '13px' }}>
                        <div>
                            <div style={{ fontWeight: 'bold', color: '#334155' }}>
                                {new Date(slot.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div style={{ color: '#64748b' }}>
                                {formatSimpleTime(slot.start_time)} - {formatSimpleTime(slot.end_time)}
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDeleteAvailability(slot.id)}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}
                            title="Delete Slot"
                        >
                            <iconify-icon icon="lucide:x-circle"></iconify-icon>
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* ORIGINAL CARD: My Caseload */}
        <div className="card" style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' }}>
             <span className="card-title" style={{ fontSize: '16px', fontWeight: 'bold' }}>My Caseload</span>
             <span style={{ fontSize: '12px', color: '#888' }}>{patients.length} Active</span>
          </div>
          
          <div className="caseload-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {patients.length === 0 && <p style={{ fontSize: '13px', color: '#999' }}>No patients assigned yet.</p>}
              
              {patients.map(p => (
                <div key={p.id} style={{ padding: '12px 0', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  
                  {/* Left Side: Avatar + Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '35px', height: '35px', background: '#e0faea', color: '#006421', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
                      {(p.full_name || p.user_name || "P").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>
                        {p.full_name || p.user_name}
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