'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountSettingsPage() {
  const router = useRouter();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactor: true,
    profileVisibility: false, 
    language: 'English (US)',
    timezone: 'Bangkok (GMT+7)'
  });

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleNavigation = () => {
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

      {/* ================= MAIN CONTENT ================= */}
      <div style={{ 
          position: 'relative', zIndex: 1, 
          paddingTop: '120px', paddingBottom: '60px',
          paddingLeft: '5%', paddingRight: '5%',
          color: 'white',
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex', 
          alignItems: 'flex-end', // ALIGNS BUTTONS TO BOTTOM
          gap: '40px' 
      }}>

        {/* ================= LEFT SIDE: SETTINGS FORM ================= */}
        <div style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            padding: '40px', borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        }}>

            <h1 style={{ fontSize: '36px', fontWeight: 'normal', marginBottom: '10px', marginTop: 0 }}>Account Settings</h1>
            <p style={{ fontFamily: 'sans-serif', fontSize: '14px', opacity: 0.8, marginBottom: '40px' }}>Manage your notifications, security, and preferences.</p>

            {/* --- SECTION 1: NOTIFICATIONS --- */}
            <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '22px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px', marginBottom: '20px' }}>Notifications</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontFamily: 'sans-serif' }}>
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: '600' }}>Email Notifications</div>
                        <div style={{ fontSize: '13px', opacity: 0.7 }}>Receive appointment reminders & updates via email.</div>
                    </div>
                    <div onClick={() => toggle('emailNotifications')} style={{ 
                        width: '50px', height: '26px', borderRadius: '20px', cursor: 'pointer', position: 'relative', transition: '0.3s',
                        background: settings.emailNotifications ? '#4ade80' : 'rgba(255,255,255,0.2)'
                    }}>
                        <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', transition: '0.3s', left: settings.emailNotifications ? '27px' : '3px' }}></div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontFamily: 'sans-serif' }}>
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: '600' }}>SMS Alerts</div>
                        <div style={{ fontSize: '13px', opacity: 0.7 }}>Get urgent messages sent to your phone.</div>
                    </div>
                    <div onClick={() => toggle('smsNotifications')} style={{ 
                        width: '50px', height: '26px', borderRadius: '20px', cursor: 'pointer', position: 'relative', transition: '0.3s',
                        background: settings.smsNotifications ? '#4ade80' : 'rgba(255,255,255,0.2)'
                    }}>
                        <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', transition: '0.3s', left: settings.smsNotifications ? '27px' : '3px' }}></div>
                    </div>
                </div>
            </div>


            {/* --- SECTION 2: SECURITY --- */}
            <div style={{ marginBottom: '40px' }}>
                <h3 style={{ fontSize: '22px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px', marginBottom: '20px' }}>Security & Privacy</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontFamily: 'sans-serif' }}>
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: '600' }}>Two-Factor Authentication</div>
                        <div style={{ fontSize: '13px', opacity: 0.7 }}>Add an extra layer of security to your account.</div>
                    </div>
                    <div onClick={() => toggle('twoFactor')} style={{ 
                        width: '50px', height: '26px', borderRadius: '20px', cursor: 'pointer', position: 'relative', transition: '0.3s',
                        background: settings.twoFactor ? '#4ade80' : 'rgba(255,255,255,0.2)'
                    }}>
                        <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '3px', transition: '0.3s', left: settings.twoFactor ? '27px' : '3px' }}></div>
                    </div>
                </div>
            </div>


            {/* --- SECTION 3: REGIONAL --- */}
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '22px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px', marginBottom: '20px' }}>Regional Preferences</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontFamily: 'sans-serif' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Language</label>
                        <select 
                            name="language" value={settings.language} onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)' }}
                        >
                            <option>English (US)</option>
                            <option>Thai</option>
                            <option>Spanish</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Timezone</label>
                        <select 
                            name="timezone" value={settings.timezone} onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)' }}
                        >
                            <option>Bangkok (GMT+7)</option>
                            <option>London (GMT+0)</option>
                            <option>New York (GMT-5)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* DANGER ZONE */}
            <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid rgba(255,50,50,0.3)' }}>
                <h4 style={{ color: '#ff6b6b', margin: '0 0 10px 0' }}>Danger Zone</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '13px', fontFamily: 'sans-serif', margin: 0, opacity: 0.8 }}>
                        Once you delete your account, there is no going back.
                    </p>
                    <button 
                        style={{ 
                            background: 'transparent', border: '1px solid #ff6b6b', color: '#ff6b6b', 
                            padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => { e.target.style.background = 'rgba(255, 107, 107, 0.1)'; }}
                        onMouseOut={(e) => { e.target.style.background = 'transparent'; }}
                    >
                        Delete Account
                    </button>
                </div>
            </div>

        </div>

        {/* ================= RIGHT SIDE: BUTTONS (Aligned Bottom) ================= */}
        <div style={{ 
            width: '220px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '20px',
            paddingBottom: '20px' // Lift from very bottom slightly
        }}>
            
            {/* Save Button */}
            <button 
                onClick={handleNavigation}
                style={{ 
                    background: 'white', color: '#333', border: 'none', 
                    padding: '15px 20px', borderRadius: '12px', 
                    fontSize: '16px', fontWeight: 'bold', fontFamily: 'Times New Roman, serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', 
                    cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                Save Changes
            </button>

            {/* Cancel Button */}
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