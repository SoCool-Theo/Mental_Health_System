'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../api';

export default function ChangePasswordPage() {
  const router = useRouter();

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- NEW: State for Eye Icons ---
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleNavigation = () => {
    router.push('/patient/homepage');
  };

  const handleUpdatePassword = async () => {
      if (!passwords.current || !passwords.new || !passwords.confirm) {
          return alert("Please fill in all password fields.");
      }
      if (passwords.new.length < 8) {
          return alert("New password must be at least 8 characters long.");
      }
      if (passwords.new !== passwords.confirm) {
          return alert("The new passwords do not match. Please try again.");
      }

      setIsSubmitting(true);

      try {
          const token = localStorage.getItem('access_token');
          if (!token) return router.push('/login');

          const config = { headers: { Authorization: `Bearer ${token}` } };

          const payload = {
              current_password: passwords.current,
              new_password: passwords.new
          };

          await api.post('users/change-password/', payload, config);

          alert("Password updated successfully!");
          router.push('/patient/homepage');

      } catch (error) {
          console.error("Password update failed:", error);
          if (error.response && error.response.data && error.response.data.error) {
              alert(error.response.data.error);
          } else {
              alert("Failed to update password. Please check your network connection.");
          }
      } finally {
          setIsSubmitting(false);
      }
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

      {/* ================= MAIN CONTENT ================= */}
      <div style={{
          position: 'relative', zIndex: 1,
          paddingTop: '120px', paddingBottom: '60px',
          paddingLeft: '5%', paddingRight: '5%',
          color: 'white',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '40px'
      }}>

        {/* ================= LEFT SIDE: PASSWORD FORM ================= */}
        <div style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            padding: '40px', borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        }}>

            <h1 style={{ fontSize: '36px', fontWeight: 'normal', marginBottom: '10px', marginTop: 0 }}>Change Password</h1>
            <p style={{ fontFamily: 'sans-serif', fontSize: '14px', opacity: 0.8, marginBottom: '40px' }}>
                Ensure your account is secure by using a strong password.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', fontFamily: 'sans-serif', maxWidth: '600px' }}>

                {/* Current Password */}
                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Current Password</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showCurrent ? "text" : "password"} name="current"
                            value={passwords.current} onChange={handleChange} placeholder="••••••••"
                            style={{ width: '100%', padding: '12px 40px 12px 12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)', outline: 'none' }}
                        />
                        <iconify-icon
                            icon={showCurrent ? "lucide:eye-off" : "lucide:eye"}
                            onClick={() => setShowCurrent(!showCurrent)}
                            style={{ position: 'absolute', right: '12px', top: '13px', cursor: 'pointer', color: '#888', fontSize: '18px' }}
                        />
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)', margin: '10px 0' }}></div>

                {/* New Password */}
                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>New Password</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showNew ? "text" : "password"} name="new"
                            value={passwords.new} onChange={handleChange} placeholder="Enter new password"
                            style={{ width: '100%', padding: '12px 40px 12px 12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)', outline: 'none' }}
                        />
                        <iconify-icon
                            icon={showNew ? "lucide:eye-off" : "lucide:eye"}
                            onClick={() => setShowNew(!showNew)}
                            style={{ position: 'absolute', right: '12px', top: '13px', cursor: 'pointer', color: '#888', fontSize: '18px' }}
                        />
                    </div>
                    <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '5px' }}>Must be at least 8 characters long.</p>
                </div>

                {/* Confirm New Password */}
                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Confirm New Password</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showConfirm ? "text" : "password"} name="confirm"
                            value={passwords.confirm} onChange={handleChange} placeholder="Re-enter new password"
                            style={{ width: '100%', padding: '12px 40px 12px 12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)', outline: 'none' }}
                        />
                        <iconify-icon
                            icon={showConfirm ? "lucide:eye-off" : "lucide:eye"}
                            onClick={() => setShowConfirm(!showConfirm)}
                            style={{ position: 'absolute', right: '12px', top: '13px', cursor: 'pointer', color: '#888', fontSize: '18px' }}
                        />
                    </div>
                </div>

            </div>
        </div>

        {/* ================= RIGHT SIDE: BUTTONS ================= */}
        <div style={{
            width: '220px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            paddingBottom: '20px'
        }}>

            <button
                onClick={handleUpdatePassword}
                disabled={isSubmitting}
                style={{
                    background: 'white', color: '#333', border: 'none',
                    padding: '15px 20px', borderRadius: '12px',
                    fontSize: '16px', fontWeight: 'bold', fontFamily: 'Times New Roman, serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s',
                    opacity: isSubmitting ? 0.7 : 1
                }}
                onMouseOver={(e) => { if(!isSubmitting) e.currentTarget.style.transform = 'scale(1.03)' }}
                onMouseOut={(e) => { if(!isSubmitting) e.currentTarget.style.transform = 'scale(1)' }}
            >
                {isSubmitting ? 'Updating...' : 'Update Password'}
            </button>

            <button 
                onClick={handleNavigation}
                style={{ 
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', 
                    color: 'white', padding: '15px 20px', borderRadius: '12px', 
                    fontSize: '16px', fontFamily: 'Times New Roman, serif',
                    cursor: 'pointer', backdropFilter: 'blur(5px)',
                    transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
                Cancel
            </button>
        </div>

      </div>
    </div>
  );
}