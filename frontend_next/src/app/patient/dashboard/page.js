'use client';

// Import styles from the file beside layout.js (one level up)
import styles from '../patient_dashboard.module.css'; 

export default function PatientDashboard() {
  return (
    <div style={{ fontFamily: 'Times New Roman, serif' }}> 
      
      {/* ================= HERO SECTION ================= */}
      <section style={{
        position: 'relative',
        height: '100vh',
        backgroundImage:"url('/first_background_homepage.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* FULL SCREEN GLASS OVERLAY */}
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(30, 30, 30, 0.5)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 1
        }}></div>

        {/* CONTENT */}
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>

            {/* HEADER REMOVED (Handled by layout.js) */}

            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'flex-center',
                paddingTop: '35vh',
                alignItems: 'flex-start', textAlign: 'left',
                paddingLeft: '50%', // Keeps your original layout alignment
                paddingRight: '10%'
            }}>
                <h3 style={{ fontSize: '14px', fontFamily: 'sans-serif', letterSpacing: '1px', opacity: 0.9, marginBottom: '15px' }}>
                    LYFE Wellness Clinic
                </h3>
                <h1 style={{ fontSize: '56px', fontWeight: '400', marginBottom: '40px', lineHeight: '1.2' }}>
                    Your Path to<br />Mental Health Wellness<br />Starts Here
                </h1>
                
                {/* BUTTON WITH HOVER EFFECT (Inline JS) */}
                <button style={{
                    background: 'transparent', border: '1px solid white', color: 'white',
                    padding: '12px 35px', fontSize: '16px', fontFamily: 'sans-serif',
                    cursor: 'pointer', borderRadius: '50px', transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#585e54'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'white'; }}
                >
                    Book Session
                </button>
            </div>
        </div>
      </section>


      {/* ================= SERVICES SECTION ================= */}
      <section style={{
        position: 'relative',
        padding: '150px 10%', 
        backgroundImage: "url('/services_bg_homepage.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
      }}>
        
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(30, 30, 30, 0.5)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 1
        }}></div>

        <div style={{ position: 'relative', zIndex: 2 }}>
            <div>
                <h2 style={{
                    fontSize: '50px', fontFamily: 'Times New Roman, serif', fontWeight: 'normal',
                    display: 'inline-block', borderBottom: '3px solid #fefefe', paddingBottom: '10px', marginBottom: '10px'
                }}>
                    Our Services
                </h2>
            </div>

            {/* SERVICE CARDS (Using CSS Module for Hover) */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '30px',
                textAlign: 'center',
                marginTop: '40px'
            }}>
                <div className={styles.serviceCard} style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '100%', height: '300px', backgroundImage: "url('/individual_therapy.jpg')", backgroundSize: 'cover', borderRadius: '8px' }}></div>
                    <p style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>Individual Therapy</p>
                </div>

                <div className={styles.serviceCard} style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '100%', height: '300px', backgroundImage: "url('/stress_anxiety.jpg')", backgroundSize: 'cover', borderRadius: '8px' }}></div>
                    <p style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>Stress & Anxiety<br/>Management</p>
                </div>

                <div className={styles.serviceCard} style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '100%', height: '300px', backgroundImage: "url('/depression_support.jpg')", backgroundSize: 'cover', borderRadius: '8px' }}></div>
                    <p style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>Depression<br/>Support</p>
                </div>

                <div className={styles.serviceCard} style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    <div style={{ width: '100%', height: '300px', backgroundImage: "url('/trauma.jpg')", backgroundSize: 'cover', borderRadius: '8px' }}></div>
                    <p style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>Trauma-Informed<br/>Therapy</p>
                </div>
            </div>
        </div>
      </section>


      {/* ================= CTA SECTION ================= */}
      <section style={{
        position: 'relative',
        height: '100vh',
        padding: '0 10%',
        backgroundColor: '#5a5a55', 
        backgroundImage: "url('/CTA_bg_homepage.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>

        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(30, 30, 30, 0.5)', 
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 1
        }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: 'normal', lineHeight: '1.2', marginBottom: '20px' }}>
                You don’t have to navigate<br/>life’s challenges alone.<br/>We’re here to help.
            </h2>

            <p style={{ fontSize: '15px', fontFamily: 'sans-serif', opacity: 0.9, marginBottom: '40px' }}>
                Book an appointment with a licensed mental health professional today.
            </p>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '60px' }}>
                <button style={{
                    padding: '12px 30px', background: 'transparent', border: '1px solid white', color: 'white',
                    borderRadius: '50px', fontSize: '16px', cursor: 'pointer', fontFamily: 'sans-serif'
                }}>
                    Book an Appointment
                </button>
                <button style={{
                    padding: '12px 30px', background: 'transparent', border: '1px solid white', color: 'white',
                    borderRadius: '50px', fontSize: '16px', cursor: 'pointer', fontFamily: 'sans-serif'
                }}>
                    Contact Us
                </button>
            </div>

            <div style={{ display: 'flex', gap: '25px', fontSize: '20px' }}>
                 <span style={{cursor:'pointer'}}>f</span> 
                 <span style={{cursor:'pointer'}}>𝕏</span>
                 <span style={{cursor:'pointer'}}>📷</span>
                 <span style={{cursor:'pointer'}}>💬</span>
            </div>
        </div>
      </section>

    </div>
  );
}