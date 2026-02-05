'use client';

import styles from '../patient_dashboard.module.css'; 

export default function ContactPage() {
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
            background: 'rgba(30, 30, 30, 0.5)', 
            backdropFilter: 'blur(4px)',         
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 0
      }}></div>


      {/* ================= 3. CONTENT ================= */}
      <div style={{ 
          position: 'relative', zIndex: 1, 
          paddingTop: '150px', 
          paddingLeft: '10%', paddingRight: '10%',
          color: 'white',
          maxWidth: '900px'
      }}>
        
        <h1 style={{ fontSize: '64px', fontWeight: 'normal', marginBottom: '40px' }}>
            Contact Us
        </h1>

        <p style={{ 
            fontSize: '18px', fontFamily: 'sans-serif', lineHeight: '1.6', 
            opacity: 0.9, marginBottom: '60px', maxWidth: '700px' 
        }}>
            If you need help booking an appointment or have questions about our mental wellness services, 
            please contact us using the details below. Our team is here to support you and ensure your 
            booking experience is smooth and comfortable.
        </p>

        {/* Contact Details */}
        <div style={{ 
            fontFamily: 'sans-serif', fontSize: '16px', lineHeight: '2', 
            marginBottom: '80px', paddingLeft: '2px'
        }}>
            <div><strong style={{ fontWeight: '600' }}>Phone:</strong> +95 XXX XXX XXX</div>
            <div><strong style={{ fontWeight: '600' }}>Email:</strong> appointments@lyfeclinic.com</div>
            <div><strong style={{ fontWeight: '600' }}>Office Hours:</strong> Monday – Friday, 9:00 AM – 5:00 PM</div>
            <div><strong style={{ fontWeight: '600' }}>Appointments:</strong> In-Clinic & Online Sessions Available</div>
        </div>

        {/* --- SOCIAL ICONS SECTION --- */}
        <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'normal', marginBottom: '20px', opacity: 0.9 }}>
                Our Socials
            </h3>
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                
                {/* Facebook */}
                <a href="#" style={{ transition: 'transform 0.2s' }}>
                    <img 
                        src="/icons/facebook_icon.jpg" 
                        alt="Facebook" 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', filter: 'invert(1)' }} 
                    />
                </a>

                {/* X (Twitter) */}
                <a href="#" style={{ transition: 'transform 0.2s' }}>
                    <img 
                        src="/icons/twitter_icon.jpg" 
                        alt="X" 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', filter: 'invert(1)' }} 
                    />
                </a>

                {/* Instagram */}
                <a href="#" style={{ transition: 'transform 0.2s' }}>
                    <img 
                        src="/icons/instargram_icon.jpg" 
                        alt="Instagram" 
                        style={{ width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer', filter: 'invert(1)' }} 
                    />
                </a>

                {/* WhatsApp */}
                <a href="#" style={{ transition: 'transform 0.2s' }}>
                    <img 
                        src="/icons/whatsup_icon.jpg" 
                        alt="WhatsApp" 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', filter: 'invert(1)' }} 
                    />
                </a>

            </div>
        </div>

      </div>
    </div>
  );
}