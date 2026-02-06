'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// --- REUSABLE HOVER BUTTON COMPONENT ---
const HoverButton = ({ children, onClick, style, type = "button", disabled }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Default Base Styles
  const baseStyle = {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.7 : 1,
    transform: isHovered && !disabled ? 'translateY(-1px)' : 'none',
    boxShadow: isHovered && !disabled ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
    ...style,
    // Apply hover background if provided, otherwise default darken effect
    background: isHovered && !disabled 
      ? (style.hoverBackground || style.background) 
      : style.background
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={baseStyle}
    >
      {children}
    </button>
  );
};

export default function DoctorSettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile'); 
  const [loading, setLoading] = useState(false);

  // Profile Form State
  const [profile, setProfile] = useState({
    firstName: 'Stephen',
    lastName: 'Strange',
    email: 'stephen.strange@hospital.com',
    specialty: 'Neurosurgeon / Therapist',
    bio: 'Experienced in trauma recovery and cognitive behavioral therapy.'
  });

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        alert('Settings updated successfully!');
    }, 1000);
  };

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* --- HEADER WITH BACK BUTTON --- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <HoverButton 
                onClick={() => router.push('/doctor/dashboard')}
                style={{ 
                    background: 'white', hoverBackground: '#f8fafc',
                    border: '1px solid #e2e8f0', borderRadius: '8px', 
                    padding: '8px 12px', display: 'flex', alignItems: 'center', 
                    gap: '6px', fontSize: '14px', fontWeight: '600', color: '#475569'
                }}
            >
                <span>←</span> Back
            </HoverButton>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Account Settings</h2>
        </div>

        {/* Settings Layout */}
        <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
            
            {/* Sidebar Menu */}
            <div style={{ width: '250px', background: 'white', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                {['profile', 'security', 'notifications'].map(tab => (
                    <div 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{ 
                            padding: '12px 16px', borderRadius: '8px', cursor: 'pointer',
                            color: activeTab === tab ? '#0f766e' : '#64748b',
                            background: activeTab === tab ? '#f0fdfa' : 'transparent',
                            fontWeight: activeTab === tab ? '600' : '500',
                            textTransform: 'capitalize', marginBottom: '4px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { if(activeTab !== tab) e.currentTarget.style.background = '#f8fafc' }}
                        onMouseLeave={(e) => { if(activeTab !== tab) e.currentTarget.style.background = 'transparent' }}
                    >
                        {tab}
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, background: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                
                {/* --- PROFILE TAB --- */}
                {activeTab === 'profile' && (
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', margin: 0, borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>Public Profile</h3>
                        
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <img src="/medical-profile-default.png" alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                            <div>
                                <HoverButton 
                                    style={{ 
                                        padding: '8px 16px', border: '1px solid #e2e8f0', background: 'white', hoverBackground: '#f1f5f9',
                                        borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#334155' 
                                    }}
                                >
                                    Change Photo
                                </HoverButton>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>JPG, GIF or PNG. Max 1MB.</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>First Name</label>
                                <input type="text" value={profile.firstName} onChange={(e)=>setProfile({...profile, firstName: e.target.value})} 
                                    style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Last Name</label>
                                <input type="text" value={profile.lastName} onChange={(e)=>setProfile({...profile, lastName: e.target.value})} 
                                    style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Professional Title</label>
                            <input type="text" value={profile.specialty} onChange={(e)=>setProfile({...profile, specialty: e.target.value})} 
                                style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Bio / Description</label>
                            <textarea value={profile.bio} onChange={(e)=>setProfile({...profile, bio: e.target.value})} 
                                style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '100px', resize: 'vertical' }} />
                        </div>

                        <div style={{ paddingTop: '20px', borderTop: '1px solid #f1f5f9', textAlign: 'right' }}>
                            <HoverButton 
                                type="submit" 
                                disabled={loading}
                                style={{ 
                                    background: '#0f766e', hoverBackground: '#115e59', // Darker Teal on Hover
                                    color: 'white', padding: '10px 24px', borderRadius: '8px', 
                                    border: 'none', fontWeight: '600'
                                }}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </HoverButton>
                        </div>
                    </form>
                )}

                {/* --- SECURITY TAB --- */}
                {activeTab === 'security' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', margin: 0, borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>Security & Login</h3>
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Current Password</label>
                            <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>New Password</label>
                                <input type="password" style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Confirm New Password</label>
                                <input type="password" style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', padding: '15px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px' }}>
                            <h4 style={{ fontSize: '14px', color: '#b91c1c', margin: '0 0 5px 0' }}>Two-Factor Authentication</h4>
                            <p style={{ fontSize: '12px', color: '#7f1d1d', margin: 0 }}>Protect your account with an extra layer of security.</p>
                            <HoverButton 
                                style={{ 
                                    marginTop: '10px', background: 'white', hoverBackground: '#fff1f2',
                                    border: '1px solid #fca5a5', color: '#b91c1c', padding: '6px 12px', 
                                    borderRadius: '6px', fontSize: '12px', fontWeight: '600'
                                }}
                            >
                                Enable 2FA
                            </HoverButton>
                        </div>
                    </div>
                )}

                {/* --- NOTIFICATIONS TAB --- */}
                {activeTab === 'notifications' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', margin: 0, borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>Email Notifications</h3>
                        
                        {['New appointment scheduled', 'Patient sends a message', 'Daily agenda summary', 'System updates'].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f8fafc' }}>
                                <span style={{ fontSize: '14px', color: '#334155' }}>{item}</span>
                                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                            </div>
                        ))}
                    </div>
                )}

            </div>

        </div>
    </div>
  );
}