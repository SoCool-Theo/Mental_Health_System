'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; 
import api from '../../../../../api';
import styles from '../../../patient_dashboard.module.css';

export default function SessionSummaryPage() {
  const router = useRouter();
  const params = useParams(); // NEW: Grabs the [id] from the folder structure!
  const appointmentId = params.id;

  const [privacyMode, setPrivacyMode] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const sensitiveStyle = {
    filter: privacyMode ? 'blur(4px)' : 'none', 
    transition: 'all 0.3s ease',
    userSelect: privacyMode ? 'none' : 'text', 
    opacity: privacyMode ? 0.8 : 1 
  };

  useEffect(() => {
    if (!appointmentId) return;

    const fetchSummary = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await api.get(`appointments/${appointmentId}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setAppointment(res.data);
      } catch (error) {
        console.error("Failed to fetch appointment:", error);
        if (error.response?.status === 404) {
          alert("Appointment not found.");
        } else if (error.response?.status === 403) {
          alert("You don't have permission to view this appointment.");
        } else {
          alert("Could not load summary. Please try again.");
        }
        router.push('/patient/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [appointmentId, router]);

  // Format Helpers
  const formatDisplayDate = (isoString) => {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  const formatDisplayTime = (isoString) => {
      return new Date(isoString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (loading) return <div style={{ minHeight: '100vh', backgroundColor: '#333', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading summary...</div>;
  if (!appointment) return null;

  // Extract the nested clinical note for cleaner code below
  const note = appointment.clinical_note;

  return (
    <div style={{ fontFamily: 'Times New Roman, serif', minHeight: '100vh', backgroundColor: '#333' }}>
      
      {/* ================= BACKGROUND LAYERS ================= */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/first_background_homepage.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(30, 30, 30, 0.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 0 }}></div>

      {/* ================= SCROLLABLE CONTENT ================= */}
      <div style={{ position: 'relative', zIndex: 1, paddingTop: '120px', paddingBottom: '50px' }}>
        
        {/* --- BACK BUTTON --- */}
        <div style={{ padding: '0 60px', marginBottom: '20px' }}>
            <button 
                onClick={() => router.push('/patient/dashboard')} 
                style={{
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '30px', padding: '8px 20px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontFamily: 'sans-serif', transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#333'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'white'; }}
            >
                <span>←</span> Back to Dashboard
            </button>
        </div>
        
        {/* --- SECTION 1: SESSION SUMMARY --- */}
        <div style={{ padding: '0 60px', color: 'white' }}>
            
            {/* Header + Privacy Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '36px', fontWeight: 'normal' }}>Session Summary</h2>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.2)', padding: '8px 15px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
                    <span style={{ fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
                        {privacyMode ? 'Privacy On' : 'Privacy Mode'}
                    </span>
                    <div onClick={() => setPrivacyMode(!privacyMode)} style={{ width: '40px', height: '20px', background: privacyMode ? '#4ade80' : '#ccc', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}>
                        <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: privacyMode ? '22px' : '2px', transition: 'left 0.3s' }}></div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
                
                {/* 1. Main Card */}
                <div className={styles.glassCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <div style={{ fontWeight: 'bold', fontFamily: 'sans-serif' }}>
                            {formatDisplayDate(appointment.start_time)} • {formatDisplayTime(appointment.start_time)} - {formatDisplayTime(appointment.end_time)}
                        </div>
                        <span style={{ background: '#22c55e', color: 'white', padding: '2px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>
                            {appointment.status}
                        </span>
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '20px' }}>
                        {appointment.status} appointment with Dr. {appointment.therapist_details?.user?.last_name}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px', fontFamily: 'sans-serif' }}>
                        <div><div style={{ opacity: 0.6, fontSize: '12px' }}>Therapist</div><div>Dr. {appointment.therapist_details?.user?.first_name} {appointment.therapist_details?.user?.last_name}</div></div>
                        <div><div style={{ opacity: 0.6, fontSize: '12px' }}>Service</div><div>{appointment.service_details?.name} • {appointment.service_details?.duration_minutes} min</div></div>
                        <div><div style={{ opacity: 0.6, fontSize: '12px' }}>Location</div><div>Telehealth</div></div>
                        <div>
                            <div style={{ opacity: 0.6, fontSize: '12px' }}>Billing status</div>
                            {/* Falling back to 'Processed' if you haven't implemented billing fields yet */}
                            <div style={sensitiveStyle}>Processed</div> 
                        </div>
                    </div>
                </div>

                {/* 2. Session Details (SENSITIVE) */}
                <div className={styles.glassCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px' }}>Session details</h3>
                        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: '10px', fontSize: '12px' }}>Read-only</span>
                    </div>
                    
                    {note ? (
                        <div style={{ fontSize: '14px', fontFamily: 'sans-serif', marginTop: '20px' }}>
                            <div style={{ opacity: 0.6, fontSize: '12px', marginBottom: '5px' }}>Diagnosis code</div>
                            <div style={{ marginBottom: '20px', ...sensitiveStyle }}>
                                {note.diagnosis_code || 'None provided'}
                            </div>

                            <div style={{ opacity: 0.6, fontSize: '12px', marginBottom: '5px' }}>Record status</div>
                            <div>{note.is_draft ? 'Draft (In Progress)' : 'Signed & locked by provider'}</div>
                        </div>
                    ) : (
                        <div style={{ fontSize: '13px', opacity: 0.7, marginTop: '20px' }}>The provider has not uploaded notes for this session yet.</div>
                    )}
                </div>

                {/* 3. Bottom Three Columns (Clinical Notes) */}
                <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '10px' }}>
                    
                    <div className={styles.glassCard}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Subjective summary</h3>
                        <p style={{ fontSize: '13px', lineHeight: '1.5', opacity: 0.8, fontFamily: 'sans-serif', ...sensitiveStyle }}>
                            {note?.subjective_analysis || 'No subjective summary available.'}
                        </p>
                    </div>

                    <div className={styles.glassCard}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Therapist observations</h3>
                        <p style={{ fontSize: '13px', lineHeight: '1.5', opacity: 0.8, fontFamily: 'sans-serif', ...sensitiveStyle }}>
                             {note?.observations || 'No observations recorded.'}
                        </p>
                    </div>

                     <div className={styles.glassCard}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Treatment plan</h3>
                        <p style={{ fontSize: '13px', lineHeight: '1.5', opacity: 0.8, fontFamily: 'sans-serif', ...sensitiveStyle }}>
                            {note?.treatment_plan || 'No treatment plan documented.'}
                        </p>
                    </div>

                </div>

            </div>
        </div>

      </div>
    </div>
  );
}