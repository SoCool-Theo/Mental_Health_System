'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../patient_dashboard.module.css'; 

// --- REUSABLE HOVER BUTTON ---
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
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
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

export default function ReschedulePage() {
  const router = useRouter();
  const [privacyMode, setPrivacyMode] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);

  const sensitiveStyle = {
    filter: privacyMode ? 'blur(4px)' : 'none', 
    transition: 'all 0.3s ease',
    userSelect: privacyMode ? 'none' : 'text', 
    opacity: privacyMode ? 0.7 : 1 
  };

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        alert("Appointment Rescheduled Successfully!");
        router.push('/patient/dashboard');
    }, 1500);
  };

  return (
    <div style={{ fontFamily: 'Times New Roman, serif', minHeight: '100vh', backgroundColor: '#333' }}>
      
      {/* ================= BACKGROUND LAYERS ================= */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/first_background_homepage.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(30, 30, 30, 0.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 0 }}></div>

      {/* ================= CONTENT ================= */}
      {/* CHANGED: Increased paddingTop from 100px to 150px */}
      <div style={{ position: 'relative', zIndex: 1, paddingTop: '150px', paddingBottom: '50px', paddingLeft: '60px', paddingRight: '60px', color: 'white' }}>
        
        {/* --- HEADER --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <HoverButton 
                    onClick={() => router.back()}
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '10px 15px' }}
                    hoverStyle={{ background: 'white', color: '#333' }}
                >
                    ← Back
                </HoverButton>
                <h1 style={{ fontSize: '42px', fontWeight: 'normal', margin: 0 }}>Reschedule Appointment</h1>
            </div>

            {/* Privacy Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.2)', padding: '8px 15px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
                <span style={{ fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
                    {privacyMode ? 'Privacy On' : 'Privacy Mode'}
                </span>
                <div onClick={() => setPrivacyMode(!privacyMode)} style={{ width: '40px', height: '20px', background: privacyMode ? '#4ade80' : '#ccc', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}>
                    <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: privacyMode ? '22px' : '2px', transition: 'left 0.3s' }}></div>
                </div>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
            
            {/* --- LEFT COLUMN: CURRENT DETAILS --- */}
            <div className={styles.glassCard} style={{ height: 'fit-content' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>Current Appointment</h3>
                
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ccc', backgroundImage: 'url(https://i.pravatar.cc/150?img=5)', backgroundSize: 'cover' }}></div>
                    <div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px', ...sensitiveStyle }}>Dr. Alex Rivera</div>
                        <div style={{ fontSize: '13px', opacity: 0.8, fontFamily: 'sans-serif' }}>Licensed Therapist</div>
                    </div>
                </div>

                <div style={{ fontFamily: 'sans-serif', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <div style={{ opacity: 0.6, fontSize: '12px', marginBottom: '3px' }}>Original Time</div>
                        <div style={{ fontWeight: 'bold', color: '#f87171', ...sensitiveStyle }}>Tomorrow · 10:00 AM</div>
                    </div>
                    <div>
                        <div style={{ opacity: 0.6, fontSize: '12px', marginBottom: '3px' }}>Service</div>
                        <div>Telehealth · 50 min</div>
                    </div>
                    <div>
                        <div style={{ opacity: 0.6, fontSize: '12px', marginBottom: '3px' }}>Reason</div>
                        <div style={sensitiveStyle}>Anxiety follow-up</div>
                    </div>
                </div>
            </div>


            {/* --- RIGHT COLUMN: SELECT NEW TIME --- */}
            <div className={styles.glassCard}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>Select New Time</h3>
                <p style={{ fontSize: '13px', opacity: 0.7, fontFamily: 'sans-serif', marginBottom: '30px' }}>Choose a new available slot for Dr. Rivera</p>

                {/* Day Groups */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* Day 1 */}
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', borderLeft: '4px solid #0ea5e9', paddingLeft: '10px' }}>
                            Thursday, Dec 7
                        </div>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            {['1:00 PM', '2:30 PM', '4:00 PM'].map((time) => (
                                <HoverButton
                                    key={time}
                                    onClick={() => setSelectedSlot(`Dec 7, ${time}`)}
                                    style={{ 
                                        background: selectedSlot === `Dec 7, ${time}` ? '#0ea5e9' : 'rgba(255,255,255,0.1)', 
                                        border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', borderRadius: '30px' 
                                    }}
                                    hoverStyle={{ background: '#0ea5e9' }}
                                >
                                    {time}
                                </HoverButton>
                            ))}
                        </div>
                    </div>

                    {/* Day 2 */}
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', borderLeft: '4px solid #0ea5e9', paddingLeft: '10px' }}>
                            Friday, Dec 8
                        </div>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                             {['9:00 AM', '11:00 AM'].map((time) => (
                                <HoverButton
                                    key={time}
                                    onClick={() => setSelectedSlot(`Dec 8, ${time}`)}
                                    style={{ 
                                        background: selectedSlot === `Dec 8, ${time}` ? '#0ea5e9' : 'rgba(255,255,255,0.1)', 
                                        border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', borderRadius: '30px' 
                                    }}
                                    hoverStyle={{ background: '#0ea5e9' }}
                                >
                                    {time}
                                </HoverButton>
                            ))}
                        </div>
                    </div>

                </div>

                {/* CONFIRMATION AREA */}
                <div style={{ marginTop: '50px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '25px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
                    {selectedSlot && (
                        <div style={{ fontSize: '14px' }}>
                            Rescheduling to: <span style={{ fontWeight: 'bold', color: '#4ade80' }}>{selectedSlot}</span>
                        </div>
                    )}
                    <HoverButton
                        onClick={handleConfirm}
                        disabled={!selectedSlot || loading}
                        style={{ 
                            background: 'white', color: '#333', padding: '12px 30px', borderRadius: '50px', fontSize: '16px' 
                        }}
                        hoverStyle={{ background: '#e2e8f0' }}
                    >
                        {loading ? 'Confirming...' : 'Confirm Change'}
                    </HoverButton>
                </div>

            </div>

        </div>

      </div>
    </div>
  );
}