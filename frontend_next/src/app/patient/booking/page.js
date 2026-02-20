'use client';

import { useState } from 'react';
import styles from '../patient_dashboard.module.css'; 

export default function BookingPage() {
  const [privacyMode, setPrivacyMode] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null); 

  // --- PRIVACY BLUR STYLE (Same as Dashboard) ---
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
      
      {/* ================= 2. BLUR OVERLAY ================= */}
      <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(30, 30, 30, 0.4)', 
            backdropFilter: 'blur(4px)',         
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 0
      }}></div>


      {/* ================= 3. SCROLLABLE CONTENT ================= */}
      <div style={{ position: 'relative', zIndex: 1, paddingTop: '120px', paddingBottom: '50px', paddingLeft: '60px', paddingRight: '60px' }}>
        
        {/* --- HEADER --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
                <h1 style={{ fontSize: '42px', fontWeight: 'normal', margin: 0 }}>Book a new appointment</h1>
                <div style={{ fontFamily: 'sans-serif', fontSize: '14px', opacity: 0.8 }}>
                    <span style={{ fontWeight: 'bold' }}>1 Filters</span> &nbsp;›&nbsp; 2 Choose therapist &nbsp;›&nbsp; 3 Confirm
                </div>
            </div>

            {/* Privacy Toggle */}
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

        {/* --- MAIN GRID LAYOUT --- */}
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
            
            {/* ================= LEFT COLUMN: FILTERS ================= */}
            <div className={styles.glassCard} style={{ height: 'fit-content' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Step 1 · Filters</h3>
                <p style={{ fontSize: '12px', opacity: 0.7, fontFamily: 'sans-serif', marginBottom: '25px' }}>Narrow down your therapist matches</p>

                {/* Filter Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'sans-serif' }}>
                    
                    <div>
                        <label style={{ fontSize: '12px', opacity: 0.8, display: 'block', marginBottom: '8px' }}>Specialty</label>
                        <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', fontSize: '14px' }}>
                            <option>Anxiety, Depression</option>
                            <option>Trauma</option>
                            <option>Relationship Issues</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', opacity: 0.8, display: 'block', marginBottom: '8px' }}>Focus areas</label>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {['Anxiety', 'Depression', 'Stress & burnout'].map(tag => (
                                <span key={tag} style={{ background: 'white', color: '#333', padding: '5px 10px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold' }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', opacity: 0.8, display: 'block', marginBottom: '8px' }}>Therapist gender</label>
                        <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', fontSize: '14px' }}>
                            <option>Female therapist</option>
                            <option>Male therapist</option>
                            <option>Non-binary</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', opacity: 0.8, display: 'block', marginBottom: '8px' }}>Session type</label>
                        <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', fontSize: '14px' }}>
                            <option>Telehealth (video)</option>
                            <option>In-person</option>
                        </select>
                    </div>

                      <div>
                        <label style={{ fontSize: '12px', opacity: 0.8, display: 'block', marginBottom: '8px' }}>Date range</label>
                        <input type="text" placeholder="Next 7 days" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', fontSize: '14px' }} />
                    </div>

                </div>
            </div>


            {/* ================= RIGHT COLUMN: LIST & CONFIRM ================= */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* --- Step 2: Choose Therapist --- */}
                <div className={styles.glassCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Step 2 · Choose a therapist</h3>
                            <p style={{ fontSize: '12px', opacity: 0.7, fontFamily: 'sans-serif' }}>Showing matches based on your filters</p>
                        </div>
                        <input type="text" placeholder="🔍 Search by name" style={{ padding: '8px 15px', borderRadius: '20px', border: 'none', outline: 'none' }} />
                    </div>

                    {/* Therapist Card 1 */}
                    <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '12px', padding: '15px', color: '#333', marginBottom: '15px', display: 'flex', gap: '15px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#ccc', backgroundImage: 'url(https://i.pravatar.cc/150?img=5)', backgroundSize: 'cover' }}></div>
                        
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                <h4 style={{ margin: 0, fontSize: '16px' }}>Dr. Alex Rivera</h4>
                                <span style={{ fontSize: '11px', background: '#eee', padding: '2px 8px', borderRadius: '4px' }}>Next available</span>
                            </div>
                            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0', fontFamily: 'sans-serif' }}>Licensed therapist · Cognitive Behavioral Therapy</p>
                            
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                                {['Anxiety', 'Depression', 'Work stress'].map(t => (
                                    <span key={t} style={{ fontSize: '10px', border: '1px solid #ddd', padding: '2px 6px', borderRadius: '4px' }}>{t}</span>
                                ))}
                            </div>
                            
                            <div style={{ fontSize: '11px', color: '#888', fontFamily: 'sans-serif' }}>Telehealth · 50 min · Rated 4.9/5</div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
                             <div style={{ fontSize: '10px', color: '#666' }}>Next available slot</div>
                             <button 
                                onClick={() => setSelectedSlot('alex-10am')}
                                style={{ 
                                    background: selectedSlot === 'alex-10am' ? '#333' : 'white', 
                                    color: selectedSlot === 'alex-10am' ? 'white' : '#333',
                                    border: '1px solid #333', padding: '5px 10px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' 
                                }}>
                                Tomorrow · 10:00 AM
                             </button>
                             <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>Or choose</div>
                             <div style={{ display: 'flex', gap: '5px' }}>
                                <button style={{ background: 'transparent', border: '1px solid #ccc', padding: '3px 8px', borderRadius: '15px', fontSize: '10px' }}>Fri · 9:00 AM</button>
                                <button style={{ background: 'transparent', border: '1px solid #ccc', padding: '3px 8px', borderRadius: '15px', fontSize: '10px' }}>Mon · 2:00 PM</button>
                             </div>
                        </div>
                    </div>

                    {/* Therapist Card 2 */}
                    <div style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '12px', padding: '15px', color: '#333', display: 'flex', gap: '15px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#ccc', backgroundImage: 'url(https://i.pravatar.cc/150?img=3)', backgroundSize: 'cover' }}></div>
                        <div style={{ flex: 1 }}>
                            <h4 style={{ margin: 0, fontSize: '16px' }}>Dr. Maya Chen</h4>
                            <p style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0', fontFamily: 'sans-serif' }}>Clinical Psychologist · Trauma-informed care</p>
                            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                                {['Trauma', 'Anxiety'].map(t => (<span key={t} style={{ fontSize: '10px', border: '1px solid #ddd', padding: '2px 6px', borderRadius: '4px' }}>{t}</span>))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
                             <button style={{ background: 'white', border: '1px solid #ccc', padding: '5px 10px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' }}>Sat · 10:30 AM</button>
                        </div>
                    </div>

                </div>


                {/* --- Step 3: Confirm Booking (SENSITIVE DATA) --- */}
                <div className={styles.glassCard}>
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '15px', marginBottom: '15px' }}>
                         <h3 style={{ margin: '0', fontSize: '18px' }}>Step 3 · Confirm booking</h3>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'sans-serif', fontSize: '14px', marginBottom: '20px' }}>
                        <div>
                            <p style={{ opacity: 0.6, fontSize: '12px', marginBottom: '5px' }}>Confirm your session with</p>
                            {/* BLURRED NAME */}
                            <p style={{ fontSize: '16px', fontWeight: 'bold', ...sensitiveStyle }}>Dr. Alex Rivera</p>
                        </div>
                        <div>
                            <span style={{ background: 'white', color: '#333', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>Telehealth · 50 min</span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '13px', fontFamily: 'sans-serif', marginBottom: '25px' }}>
                        <div>
                            <div style={{ opacity: 0.6, marginBottom: '3px' }}>Date & time</div>
                            {/* BLURRED TIME */}
                            <div style={sensitiveStyle}>Tomorrow · 10:00 AM</div>
                        </div>
                        <div>
                            <div style={{ opacity: 0.6, marginBottom: '3px' }}>Session link</div>
                            <div>Secure video link will appear here</div>
                        </div>
                        <div>
                            <div style={{ opacity: 0.6, marginBottom: '3px' }}>Reason for visit</div>
                            {/* BLURRED REASON */}
                            <div style={sensitiveStyle}>Anxiety & low mood check-in</div>
                        </div>
                        <div>
                            <div style={{ opacity: 0.6, marginBottom: '3px' }}>Location</div>
                            <div>Online · Join from a private space</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', opacity: 0.8, cursor: 'pointer' }}>
                             <input type="checkbox" />
                             I agree to the 24-hour cancellation policy.
                         </label>

                         <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                             <button style={{ background: 'transparent', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer' }}>Back to slots</button>
                             <button style={{ background: 'white', color: '#333', border: 'none', padding: '10px 25px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>✔ Confirm booking</button>
                         </div>
                    </div>

                </div>

            </div>

        </div>

      </div>
    </div>
  );
}