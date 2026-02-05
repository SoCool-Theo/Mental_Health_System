'use client';

import { useState } from 'react';
import styles from '../patient_dashboard.module.css';

export default function PatientDashboard() {
  const [privacyMode, setPrivacyMode] = useState(false);

  return (
    <div style={{ fontFamily: 'Times New Roman, serif', minHeight: '100vh', backgroundColor: '#333' }}>
      
      {/* ================= 1. FIXED BACKGROUND ================= */}
      <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "url('/first_background_homepage.jpg')", // Ensure this path is correct!
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
      }}></div>
      
      {/* ================= 2. BACKGROUND BLUR OVERLAY ================= */}
      {/* This is the code you asked for to blur the background image slightly */}
      <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(30, 30, 30, 0.4)', // Dark tint
            backdropFilter: 'blur(4px)',         // The Blur
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 0
      }}></div>


      {/* ================= 3. SCROLLABLE CONTENT ================= */}
      <div style={{ position: 'relative', zIndex: 1, paddingTop: '120px', paddingBottom: '50px' }}>
        
        {/* --- SECTION 1: WELCOME (Top Part of Design) --- */}
        <div style={{ padding: '0 60px', marginBottom: '60px', color: 'white' }}>
            <h1 style={{ fontSize: '56px', fontWeight: 'normal', marginBottom: '10px' }}>
                Welcome Back, Joe!
            </h1>
            <p style={{ fontFamily: 'sans-serif', fontSize: '16px', opacity: 0.8, marginBottom: '40px' }}>
                How are you feeling today?
            </p>

            {/* Next Session Info */}
            <h2 style={{ fontSize: '32px', fontWeight: 'normal', marginBottom: '20px' }}>Next Session</h2>
            <div style={{ display: 'flex', gap: '60px', alignItems: 'flex-start', fontFamily: 'sans-serif' }}>
                <div>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>5 Dec 2025, Friday.</div>
                    <div style={{ fontSize: '20px', opacity: 0.8 }}>14:00 - 15:00</div>
                </div>
                <div>
                    <div style={{ fontSize: '20px', marginBottom: '5px' }}>Dr. Nick Evans</div>
                    <div style={{ fontSize: '20px', opacity: 0.8 }}>Individual Therapy Session</div>
                </div>
            </div>
        </div>


        {/* --- SECTION 2: SESSION SUMMARY ( The Glass Boxes ) --- */}
        <div style={{ padding: '0 60px', color: 'white' }}>
            
            {/* Header + Privacy Toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '36px', fontWeight: 'normal' }}>Session Summary</h2>
                
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '10px', 
                    background: 'rgba(255,255,255,0.2)', padding: '8px 15px', borderRadius: '30px',
                    backdropFilter: 'blur(10px)'
                }}>
                    <span style={{ fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>Privacy Mode</span>
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
                
                {/* 1. Main Card (Top Left) */}
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
                        <div><div style={{ opacity: 0.6, fontSize: '12px' }}>Billing status</div><div>Processed</div></div>
                    </div>
                </div>

                {/* 2. Session Details (Top Right) */}
                <div className={styles.glassCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px' }}>Session details</h3>
                        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: '10px', fontSize: '12px' }}>Read-only</span>
                    </div>
                    <div style={{ fontSize: '14px', fontFamily: 'sans-serif', marginTop: '20px' }}>
                        <div style={{ opacity: 0.6, fontSize: '12px', marginBottom: '5px' }}>Diagnosis code</div>
                        <div style={{ marginBottom: '20px' }}>F41.1 • Generalized anxiety disorder</div>
                        <div style={{ opacity: 0.6, fontSize: '12px', marginBottom: '5px' }}>Record status</div>
                        <div>Signed & locked by provider</div>
                    </div>
                </div>

                {/* 3. Related Visits (Full Width) */}
                <div className={styles.glassCard} style={{ gridColumn: 'span 2' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', opacity: 0.8 }}>Related visits</h3>
                    <div style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>Recent sessions with this therapist</p>
                        <ul style={{ paddingLeft: '20px', opacity: 0.9 }}>
                            <li>Oct 13, 2025 - CBT Therapy <span style={{opacity:0.7, fontSize:'12px'}}>(Focus: breathing practice)</span></li>
                            <li>Oct 6, 2025 - CBT Therapy <span style={{opacity:0.7, fontSize:'12px'}}>(Focus: worry log)</span></li>
                        </ul>
                    </div>
                </div>

                {/* 4. Bottom Three Columns */}
                <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    
                    <div className={styles.glassCard}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Subjective summary</h3>
                        <p style={{ fontSize: '13px', lineHeight: '1.5', opacity: 0.8, fontFamily: 'sans-serif' }}>
                            Patient reports ongoing anxiety most evenings, particularly before bed. Notices racing thoughts around work.
                        </p>
                    </div>

                    <div className={styles.glassCard}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Therapist observations</h3>
                        <p style={{ fontSize: '13px', lineHeight: '1.5', opacity: 0.8, fontFamily: 'sans-serif' }}>
                            Patient appeared engaged and open during session. Able to identify specific triggers for anxiety with prompting.
                        </p>
                    </div>

                     <div className={styles.glassCard}>
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Treatment plan</h3>
                        <p style={{ fontSize: '13px', lineHeight: '1.5', opacity: 0.8, fontFamily: 'sans-serif' }}>
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