'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import styles from '../../patient_dashboard.module.css'; // Adjust path if needed based on folder structure

export default function SessionSummaryPage() {
  const [privacyMode, setPrivacyMode] = useState(false);
  const router = useRouter(); // Initialize router

  // --- UPDATED BLUR STYLE ---
  const sensitiveStyle = {
    filter: privacyMode ? 'blur(3px)' : 'none', 
    transition: 'all 0.3s ease',
    userSelect: privacyMode ? 'none' : 'text', 
    opacity: privacyMode ? 0.8 : 1 
  };

  return (
    <div style={{ fontFamily: 'Times New Roman, serif', minHeight: '100vh', backgroundColor: '#333' }}>
      
      {/* ================= 1. FIXED BACKGROUND ================= */}
      <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "url('/first_background_homepage.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
      }}></div>
      
      {/* ================= 2. BACKGROUND BLUR OVERLAY ================= */}
      <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(30, 30, 30, 0.4)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 0
      }}></div>


      {/* ================= 3. SCROLLABLE CONTENT ================= */}
      <div style={{ position: 'relative', zIndex: 1, paddingTop: '120px', paddingBottom: '50px' }}>
        
        {/* --- BACK BUTTON --- */}
        <div style={{ padding: '0 60px', marginBottom: '20px' }}>
            <button 
                onClick={() => router.push('/patient/dashboard')} 
                style={{
                    background: 'rgba(255,255,255,0.1)', 
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '30px',
                    padding: '8px 20px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontFamily: 'sans-serif',
                    transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#333';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = 'white';
                }}
            >
                <span>←</span> Back to Dashboard
            </button>
        </div>
        
        {/* --- SECTION 1: SESSION SUMMARY --- */}
        <div style={{ padding: '0 60px', color: 'white' }}>
            
            {/* Header + Privacy Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '36px', fontWeight: 'normal' }}>Session Summary</h2>
                
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '10px', 
                    background: 'rgba(255,255,255,0.2)', padding: '8px 15px', borderRadius: '30px',
                    backdropFilter: 'blur(10px)'
                }}>
                    <span style={{ fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
                        {privacyMode ? 'Privacy On' : 'Privacy Mode'}
                    </span>
                    <div onClick={() => setPrivacyMode(!privacyMode)} style={{ 
                        width: '40px', height: '20px', background: privacyMode ? '#4ade80' : '#ccc', 
                        borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
                    }}>
                        <div style={{ 
                            width: '16px', height: '16px', background: 'white', borderRadius: '50%', 
                            position: 'absolute', top: '2px', left: privacyMode ? '22px' : '2px', transition: 'left 0.3s'
                        }}></div>
                    </div>
                </div>
            </div>

            {/* --- THE GRID LAYOUT FOR BOXES --- */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
                
                {/* 1. Main Card */}
                <div className={styles.glassCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <div style={{ fontWeight: 'bold', fontFamily: 'sans-serif' }}>Oct 20, 2025 • 3:00 - 3:50 PM</div>
                        <span style={{ background: '#22c55e', color: 'white', padding: '2px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold' }}>Completed</span>
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '20px' }}>Completed appointment with Dr. Morgan Patel</div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px', fontFamily: 'sans-serif' }}>
                        <div><div style={{ opacity: 0.6, fontSize: '12px' }}>Therapist</div><div>Dr. Morgan Patel</div></div>
                        <div><div style={{ opacity: 0.6, fontSize: '12px' }}>Service</div><div>CBT Therapy • 50 min</div></div>
                        <div><div style={{ opacity: 0.6, fontSize: '12px' }}>Location</div><div>Video visit</div></div>
                        
                        {/* Sensitive Billing Info */}
                        <div>
                            <div style={{ opacity: 0.6, fontSize: '12px' }}>Billing status</div>
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
                    <div style={{ fontSize: '14px', fontFamily: 'sans-serif', marginTop: '20px' }}>
                        
                        <div style={{ opacity: 0.6, fontSize: '12px', marginBottom: '5px' }}>Diagnosis code</div>
                        {/* SENSITIVE DATA */}
                        <div style={{ marginBottom: '20px', ...sensitiveStyle }}>
                            F41.1 • Generalized anxiety disorder
                        </div>

                        <div style={{ opacity: 0.6, fontSize: '12px', marginBottom: '5px' }}>Record status</div>
                        <div>Signed & locked by provider</div>
                    </div>
                </div>

                {/* 3. Related Visits */}
                <div className={styles.glassCard} style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', opacity: 0.8 }}>Related visits</h3>
                    <div style={{ fontFamily: 'sans-serif', fontSize: '14px', ...sensitiveStyle }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Recent sessions with this therapist</p>
                        <ul style={{ paddingLeft: '20px', opacity: 0.9 }}>
                            <li>Oct 13, 2025 - CBT Therapy <span style={{opacity:0.7, fontSize:'12px'}}>(Focus: breathing practice)</span></li>
                            <li>Oct 6, 2025 - CBT Therapy <span style={{opacity:0.7, fontSize:'12px'}}>(Focus: worry log)</span></li>
                        </ul>
                    </div>
                </div>

                {/* 4. Bottom Three Columns (HIGHLY SENSITIVE) */}
                <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    
                    <div className={styles.glassCard}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Subjective summary</h3>
                        <p style={{ fontSize: '13px', lineHeight: '1.5', opacity: 0.8, fontFamily: 'sans-serif', ...sensitiveStyle }}>
                            Patient reports ongoing anxiety most evenings, particularly before bed. Notices racing thoughts around work.
                        </p>
                    </div>

                    <div className={styles.glassCard}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Therapist observations</h3>
                        <p style={{ fontSize: '13px', lineHeight: '1.5', opacity: 0.8, fontFamily: 'sans-serif', ...sensitiveStyle }}>
                            Patient appeared engaged and open during session. Able to identify specific triggers for anxiety with prompting.
                        </p>
                    </div>

                     <div className={styles.glassCard}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Treatment plan</h3>
                        <p style={{ fontSize: '13px', lineHeight: '1.5', opacity: 0.8, fontFamily: 'sans-serif', ...sensitiveStyle }}>
                            Continue weekly CBT sessions. Homework: complete worry log for at least 3 situations.
                        </p>
                    </div>

                </div>

            </div>
        </div>

      </div>
    </div>
  );
}