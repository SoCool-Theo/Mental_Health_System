'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter(); 

  const [formData, setFormData] = useState({
    fullName: 'Joe D. Augustine',
    dob: '1997-05-24',
    gender: 'Male',
    email: 'joeaug@somemail.com',
    phone: '+66-8-1234-5678',
    address: 'No.21, Main Street, Bangkok.'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNavigation = (e) => {
    e.preventDefault();
    router.push('/patient/homepage');
  };

  return (
    <div style={{ fontFamily: 'Times New Roman, serif', minHeight: '100vh', backgroundColor: '#333' }}>
      
      {/* ================= BACKGROUND ================= */}
      <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "url('/first_background_homepage.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0
      }}></div>
      
      <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(30, 30, 30, 0.5)', 
            backdropFilter: 'blur(6px)',         
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 0
      }}></div>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div style={{ 
          position: 'relative', zIndex: 1, 
          paddingTop: '120px', paddingBottom: '60px',
          paddingLeft: '5%', paddingRight: '5%',
          color: 'white',
          maxWidth: '1200px',
          margin: '0 auto',
          
          // --- SPLIT LAYOUT SETTINGS ---
          display: 'flex',          
          alignItems: 'flex-end', // Aligns buttons to the bottom of the form
          gap: '40px'             // Space between form and buttons
      }}>

        {/* ================= LEFT SIDE: FORM BOX ================= */}
        <div style={{
            flex: 1, // Takes up remaining space
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(10px)',            
            WebkitBackdropFilter: 'blur(10px)',
            padding: '40px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        }}>

            {/* --- SECTION 1: PERSONAL DETAILS --- */}
            <h2 style={{ fontSize: '32px', fontWeight: 'normal', marginBottom: '25px', marginTop: 0 }}>
                Personal details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px', fontFamily: 'sans-serif' }}>
                
                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Full Name</label>
                    <input 
                        type="text" name="fullName" value={formData.fullName} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)' }} 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Date of Birth</label>
                    <input 
                        type="date" name="dob" value={formData.dob} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)' }} 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Gender</label>
                    <select 
                        name="gender" value={formData.gender} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)' }}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                    </select>
                </div>

            </div>


            {/* --- SECTION 2: CONTACT --- */}
            <h2 style={{ fontSize: '32px', fontWeight: 'normal', marginBottom: '25px' }}>
                Contact
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px', fontFamily: 'sans-serif' }}>
                
                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Email address</label>
                    <input 
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)' }} 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Phone Number</label>
                    <input 
                        type="tel" name="phone" value={formData.phone} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)' }} 
                    />
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Address</label>
                    <input 
                        type="text" name="address" value={formData.address} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)' }} 
                    />
                </div>

            </div>
        </div>


        {/* ================= RIGHT SIDE: BUTTONS ================= */}
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px',
            paddingBottom: '20px' // Slight adjustment to lift from very bottom edge
        }}>
            
            {/* Save Button */}
            <button 
                onClick={handleNavigation}
                style={{ 
                    background: 'white', color: '#333', border: 'none', 
                    padding: '15px 30px', borderRadius: '12px', 
                    fontSize: '16px', fontWeight: 'bold', fontFamily: 'Times New Roman, serif',
                    display: 'flex', alignItems: 'center', gap: '10px', 
                    cursor: 'pointer', whiteSpace: 'nowrap',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                }}
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Save Changes
            </button>

            {/* Discard Button */}
            <button 
                onClick={handleNavigation}
                style={{ 
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', 
                    color: 'white', padding: '15px 30px', borderRadius: '12px', 
                    fontSize: '16px', fontFamily: 'Times New Roman, serif',
                    cursor: 'pointer', backdropFilter: 'blur(5px)', whiteSpace: 'nowrap',
                    transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
                Discard Changes
            </button>

        </div>

      </div>
    </div>
  );
}