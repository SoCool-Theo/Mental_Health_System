'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../api';
import styles from '../patient_dashboard.module.css';

// --- REUSABLE HOVER BUTTON COMPONENT ---
const HoverButton = ({ children, onClick, style, hoverStyle, disabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...style,
        ...(isHovered && !disabled ? hoverStyle : {}),
        transition: 'all 0.2s ease', 
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontFamily: 'sans-serif'
      }}
    >
      {children}
    </button>
  );
};

export default function PatientDashboard() {
  const router = useRouter();
  const [privacyMode, setPrivacyMode] = useState(false);
  
  // --- NEW: Dynamic State Variables ---
  const [userName, setUserName] = useState('');
  const [nextAppt, setNextAppt] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const sensitiveStyle = {
    filter: privacyMode ? 'blur(4px)' : 'none', 
    transition: 'all 0.3s ease',
    userSelect: privacyMode ? 'none' : 'text', 
    opacity: privacyMode ? 0.7 : 1 
  };

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchDashboardData = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const config = { headers: { 'Authorization': `Bearer ${token}` } };

            // 1. Fetch User Info (for "Welcome Back, Joe!")
            const userRes = await api.get('users/me/', config);
            setUserName(userRes.data.first_name || userRes.data.username);

            // 2. Fetch Appointments
            const apptRes = await api.get('appointments/', config);
            const apptData = apptRes.data;
            const now = new Date();

            // Sort and Filter: Upcoming Appointments
            const upcoming = apptData
                .filter(a => new Date(a.start_time) >= now && a.status !== 'CANCELLED')
                .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

            // Sort and Filter: Past/Completed Appointments
            const past = apptData
                .filter(a => new Date(a.start_time) < now || a.status === 'COMPLETED')
                .sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

            if (upcoming.length > 0) setNextAppt(upcoming[0]);
            setHistory(past);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchDashboardData();
  }, [router]);

  // --- CANCEL APPOINTMENT ---
  const handleCancelAppointment = async (appointmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?\n\nThis action cannot be undone."
    );
    if (!confirmed) return;

    setCancelling(true);
    try {
      const token = localStorage.getItem('access_token');
      await api.post(`appointments/${appointmentId}/cancel/`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Move the cancelled appointment out of "next" and refresh the view
      setNextAppt(null);
      // Re-fetch to get fresh data
      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      const apptRes = await api.get('appointments/', config);
      const apptData = apptRes.data;
      const now = new Date();

      const upcoming = apptData
        .filter(a => new Date(a.start_time) >= now && a.status !== 'CANCELLED')
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

      const past = apptData
        .filter(a => new Date(a.start_time) < now || a.status === 'COMPLETED' || a.status === 'CANCELLED')
        .sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

      if (upcoming.length > 0) setNextAppt(upcoming[0]);
      setHistory(past);

      alert("Appointment cancelled successfully.");
    } catch (error) {
      console.error("Cancel failed:", error);
      if (error.response?.data?.detail) {
        alert(error.response.data.detail);
      } else {
        alert("Failed to cancel appointment. Please try again.");
      }
    } finally {
      setCancelling(false);
    }
  };

  // --- HELPER FORMATTING FUNCTIONS ---
  const formatFullDate = (isoString) => {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'long' });
  };
  const formatTime = (isoString) => {
      return new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };
  const formatShortDate = (isoString) => {
      return new Date(isoString).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
  };

  if (loading) {
      return <div style={{ minHeight: '100vh', backgroundColor: '#333', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading dashboard...</div>;
  }

  return (
    <div style={{ fontFamily: 'Times New Roman, serif', minHeight: '100vh', backgroundColor: '#333' }}>
      
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/first_background_homepage.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(30, 30, 30, 0.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 0 }}></div>

      <div style={{ position: 'relative', zIndex: 1, paddingTop: '120px', paddingBottom: '50px', paddingLeft: '60px', paddingRight: '60px', color: 'white' }}>
        
        {/* --- HEADER --- */}
        <div style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <h1 style={{ fontSize: '56px', fontWeight: 'normal', marginBottom: '10px' }}>Welcome Back, {userName}!</h1>
                <p style={{ fontFamily: 'sans-serif', fontSize: '16px', opacity: 0.8, marginBottom: '40px' }}>How are you feeling today?</p>
                
                <h2 style={{ fontSize: '32px', fontWeight: 'normal', marginBottom: '20px' }}>Next Session</h2>
                {nextAppt ? (
                    <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-start', fontFamily: 'sans-serif' }}>
                        <div>
                            <div style={{ fontSize: '20px', marginBottom: '5px', ...sensitiveStyle }}>{formatFullDate(nextAppt.start_time)}</div>
                            <div style={{ fontSize: '20px', opacity: 0.8, ...sensitiveStyle }}>{formatTime(nextAppt.start_time)} - {formatTime(nextAppt.end_time)}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '20px', marginBottom: '5px', ...sensitiveStyle }}>
                                Dr. {nextAppt.therapist_details?.user?.last_name || 'Assigned Therapist'}
                            </div>
                            <div style={{ fontSize: '20px', opacity: 0.8 }}>{nextAppt.service_details?.name || 'Therapy Session'}</div>
                        </div>
                    </div>
                ) : (
                    <p style={{ fontFamily: 'sans-serif', opacity: 0.8 }}>No upcoming sessions scheduled.</p>
                )}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.2)', padding: '8px 15px', borderRadius: '30px', backdropFilter: 'blur(10px)', marginTop: '15px' }}>
                <span style={{ fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>{privacyMode ? 'Privacy On' : 'Privacy Mode'}</span>
                <div onClick={() => setPrivacyMode(!privacyMode)} style={{ width: '40px', height: '20px', background: privacyMode ? '#4ade80' : '#ccc', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}>
                    <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: privacyMode ? '22px' : '2px', transition: 'left 0.3s' }}></div>
                </div>
            </div>
        </div>

        {/* --- UPCOMING SECTION --- */}
        <div style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 'normal', marginBottom: '10px' }}>Upcoming</h2>
            <p style={{ fontFamily: 'sans-serif', opacity: 0.8, fontSize: '14px', marginBottom: '20px' }}>Your next appointment and quick actions</p>

            <div className={styles.glassCard} style={{ padding: '25px' }}>
                {nextAppt ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Next appointment</div>
                                <div style={{ fontFamily: 'sans-serif', fontSize: '13px', opacity: 0.8 }}>Telehealth session with your therapist</div>
                            </div>
                            <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '4px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', fontFamily: 'sans-serif', ...sensitiveStyle }}>
                                {formatShortDate(nextAppt.start_time)} · {formatTime(nextAppt.start_time)}
                            </span>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px', ...sensitiveStyle }}>
                                Dr. {nextAppt.therapist_details?.user?.first_name} {nextAppt.therapist_details?.user?.last_name}
                            </div>
                            <div style={{ fontFamily: 'sans-serif', fontSize: '14px', opacity: 0.8 }}>
                                Licensed Therapist · {nextAppt.therapist_details?.specialization || 'General Practice'}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '25px', marginBottom: '25px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 12px', borderRadius: '8px', fontSize: '13px', fontFamily: 'sans-serif' }}>Telehealth</span>
                                <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 12px', borderRadius: '8px', fontSize: '13px', fontFamily: 'sans-serif' }}>
                                    {nextAppt.service_details?.duration_minutes || 60} minutes
                                </span>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <HoverButton 
                                    onClick={() => router.push(`/patient/dashboard/reschedule?id=${nextAppt.id}`)}
                                    style={{ padding: '10px 20px', background: '#0ea5e9', color: 'white' }}
                                    hoverStyle={{ background: '#0284c7' }}
                                >
                                    Reschedule
                                </HoverButton>
                                <HoverButton 
                                    onClick={() => handleCancelAppointment(nextAppt.id)}
                                    disabled={cancelling}
                                    style={{ padding: '10px 20px', background: '#ef4444', color: 'white' }}
                                    hoverStyle={{ background: '#dc2626' }}
                                >
                                    {cancelling ? 'Cancelling...' : 'Cancel'}
                                </HoverButton>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Preparation</div>
                                <p style={{ fontFamily: 'sans-serif', fontSize: '13px', opacity: 0.6, margin: 0 }}>Find a quiet, private space and headphones ready 5 minutes before start.</p>
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Session goal / Notes</div>
                                <p style={{ fontFamily: 'sans-serif', fontSize: '13px', opacity: 0.6, margin: 0, ...sensitiveStyle }}>
                                    {nextAppt.notes || "No specific notes provided for this session."}
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.8 }}>
                        <p>You have no upcoming appointments.</p>
                        <HoverButton 
                            onClick={() => router.push('/patient/booking')}
                            style={{ padding: '10px 20px', background: '#0ea5e9', color: 'white', marginTop: '10px' }}
                            hoverStyle={{ background: '#0284c7' }}
                        >
                            Book a Session
                        </HoverButton>
                    </div>
                )}
            </div>
        </div>

        {/* --- HISTORY SECTION --- */}
        <div>
            <h2 style={{ fontSize: '32px', fontWeight: 'normal', marginBottom: '10px' }}>History</h2>
            <p style={{ fontFamily: 'sans-serif', opacity: 0.8, fontSize: '14px', marginBottom: '25px' }}>Past sessions and visit summaries</p>
            <div className={styles.glassCard} style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 150px', padding: '15px 25px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontFamily: 'sans-serif', fontSize: '13px', fontWeight: 'bold', opacity: 0.9 }}>
                    <div>Date</div><div>Therapist</div><div>Status</div><div style={{ textAlign: 'right' }}>Actions</div>
                </div>
                
                {history.length > 0 ? history.map((item, index) => (
                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 150px', padding: '20px 25px', borderBottom: index !== history.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center', fontFamily: 'sans-serif', fontSize: '14px' }}>
                        <div style={{ color: '#93c5fd', ...sensitiveStyle }}>{formatShortDate(item.start_time)}</div>
                        <div style={sensitiveStyle}>Dr. {item.therapist_details?.user?.last_name || 'Unknown'}</div>
                        <div>
                            <span style={{ 
                                background: item.status === 'COMPLETED' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255,255,255,0.1)', 
                                color: item.status === 'COMPLETED' ? '#4ade80' : 'white',
                                padding: '4px 10px', borderRadius: '12px', fontSize: '12px' 
                            }}>
                                {item.status}
                            </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <HoverButton 
                                onClick={() => router.push(`/patient/dashboard/summary/${item.id}`)} 
                                style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 15px', borderRadius: '6px', fontSize: '12px' }} 
                                hoverStyle={{ background: '#bae6fd', color: '#075985' }}
                            >
                                View summary
                            </HoverButton>
                        </div>
                    </div>
                )) : (
                     <div style={{ padding: '30px', textAlign: 'center', opacity: 0.6, fontFamily: 'sans-serif', fontSize: '14px' }}>
                         No past appointment history found.
                     </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}