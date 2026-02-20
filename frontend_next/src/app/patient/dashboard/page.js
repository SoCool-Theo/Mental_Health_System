'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../patient_dashboard.module.css'; 

// --- REUSABLE HOVER BUTTON COMPONENT ---
const HoverButton = ({ children, onClick, style, hoverStyle }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...style,
        ...(isHovered ? hoverStyle : {}),
        transition: 'all 0.2s ease', 
        cursor: 'pointer',
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

  const sensitiveStyle = {
    filter: privacyMode ? 'blur(4px)' : 'none', 
    transition: 'all 0.3s ease',
    userSelect: privacyMode ? 'none' : 'text', 
    opacity: privacyMode ? 0.7 : 1 
  };

  const history = [
    { id: 1, date: 'Oct 20, 2025', therapist: 'Dr. Alex Rivera', status: 'Completed', link: '/patient/dashboard/summary' },
    { id: 2, date: 'Oct 06, 2025', therapist: 'Dr. Alex Rivera', status: 'Completed', link: '/patient/dashboard/summary' },
    { id: 3, date: 'Sep 22, 2025', therapist: 'Dr. Alex Rivera', status: 'Completed', link: '/patient/dashboard/summary' },
    { id: 4, date: 'Sep 08, 2025', therapist: 'Dr. Alex Rivera', status: 'Completed', link: '/patient/dashboard/summary' },
  ];

  return (
    <div style={{ fontFamily: 'Times New Roman, serif', minHeight: '100vh', backgroundColor: '#333' }}>
      
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/first_background_homepage.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(30, 30, 30, 0.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 0 }}></div>

      <div style={{ position: 'relative', zIndex: 1, paddingTop: '120px', paddingBottom: '50px', paddingLeft: '60px', paddingRight: '60px', color: 'white' }}>
        
        {/* ... (Welcome Section Code remains same as previous step) ... */}
        <div style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
                <h1 style={{ fontSize: '56px', fontWeight: 'normal', marginBottom: '10px' }}>Welcome Back, Joe!</h1>
                <p style={{ fontFamily: 'sans-serif', fontSize: '16px', opacity: 0.8, marginBottom: '40px' }}>How are you feeling today?</p>
                <h2 style={{ fontSize: '32px', fontWeight: 'normal', marginBottom: '20px' }}>Next Session</h2>
                <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-start', fontFamily: 'sans-serif' }}>
                    <div>
                        <div style={{ fontSize: '20px', marginBottom: '5px', ...sensitiveStyle }}>5 Dec 2025, Friday.</div>
                        <div style={{ fontSize: '20px', opacity: 0.8, ...sensitiveStyle }}>14:00 - 15:00</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '20px', marginBottom: '5px', ...sensitiveStyle }}>Dr. Nick Evans</div>
                        <div style={{ fontSize: '20px', opacity: 0.8 }}>Individual Therapy Session</div>
                    </div>
                </div>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Next appointment</div>
                        <div style={{ fontFamily: 'sans-serif', fontSize: '13px', opacity: 0.8 }}>Telehealth session with your therapist</div>
                    </div>
                    <span style={{ background: '#e0e7ff', color: '#3730a3', padding: '4px 12px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', fontFamily: 'sans-serif', ...sensitiveStyle }}>
                        Tomorrow · 10:00 AM
                    </span>
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '5px', ...sensitiveStyle }}>Dr. Alex Rivera</div>
                    <div style={{ fontFamily: 'sans-serif', fontSize: '14px', opacity: 0.8 }}>Licensed Therapist · Cognitive Behavioral Therapy</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '25px', marginBottom: '25px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 12px', borderRadius: '8px', fontSize: '13px', fontFamily: 'sans-serif' }}>Telehealth</span>
                        <span style={{ background: 'rgba(255,255,255,0.15)', padding: '5px 12px', borderRadius: '8px', fontSize: '13px', fontFamily: 'sans-serif' }}>50 minutes</span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '15px' }}>
                        {/* --- UPDATED LINK FOR RESCHEDULE --- */}
                        <HoverButton 
                            onClick={() => router.push('/patient/dashboard/reschedule')}
                            style={{ padding: '10px 20px', background: '#0ea5e9', color: 'white' }}
                            hoverStyle={{ background: '#0284c7' }}
                        >
                            Reschedule
                        </HoverButton>
                        
                        <HoverButton 
                            style={{ padding: '10px 20px', background: '#ef4444', color: 'white' }}
                            hoverStyle={{ background: '#dc2626' }}
                        >
                            Cancel
                        </HoverButton>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Preparation</div>
                        <p style={{ fontFamily: 'sans-serif', fontSize: '13px', opacity: 0.6, margin: 0 }}>Find a quiet, private space and headphones ready 5 minutes before start.</p>
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '8px' }}>Session goal</div>
                        <p style={{ fontFamily: 'sans-serif', fontSize: '13px', opacity: 0.6, margin: 0, ...sensitiveStyle }}>Review coping plan for work-related anxiety and practice exposure steps.</p>
                    </div>
                </div>
            </div>
        </div>

        {/* ... (History Section remains same as previous step) ... */}
        <div>
            <h2 style={{ fontSize: '32px', fontWeight: 'normal', marginBottom: '10px' }}>History</h2>
            <p style={{ fontFamily: 'sans-serif', opacity: 0.8, fontSize: '14px', marginBottom: '25px' }}>Past sessions and visit summaries</p>
            <div className={styles.glassCard} style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 150px', padding: '15px 25px', background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)', fontFamily: 'sans-serif', fontSize: '13px', fontWeight: 'bold', opacity: 0.9 }}>
                    <div>Date</div><div>Therapist</div><div>Status</div><div style={{ textAlign: 'right' }}>Actions</div>
                </div>
                {history.map((item, index) => (
                    <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 150px', padding: '20px 25px', borderBottom: index !== history.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center', fontFamily: 'sans-serif', fontSize: '14px' }}>
                        <div style={{ color: '#93c5fd', ...sensitiveStyle }}>{item.date}</div>
                        <div style={sensitiveStyle}>{item.therapist}</div>
                        <div><span style={{ background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' }}>{item.status}</span></div>
                        <div style={{ textAlign: 'right' }}>
                            <HoverButton onClick={() => router.push(item.link)} style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 15px', borderRadius: '6px', fontSize: '12px' }} hoverStyle={{ background: '#bae6fd', color: '#075985' }}>View summary</HoverButton>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
}