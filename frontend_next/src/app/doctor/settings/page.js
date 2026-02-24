'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../api'; // Ensure this points to your configured axios instance

// --- REUSABLE HOVER BUTTON COMPONENT ---
const HoverButton = ({ children, onClick, style, type = "button", disabled }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Default Base Styles
  const baseStyle = {
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.7 : 1,
    transform: isHovered && !disabled ? 'translateY(-1px)' : 'none',
    boxShadow: isHovered && !disabled ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
    ...style,
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile Form State
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    specialty: '',
    bio: ''
  });

  // --- NEW: Image States ---
  const [selectedImage, setSelectedImage] = useState(null); // The actual file to upload
  const [previewImage, setPreviewImage] = useState('/medical-profile-default.png'); // What the user sees

  // Security Tab States
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [passLoading, setPassLoading] = useState(false);

  // --- 1. FETCH PROFILE ON LOAD ---
  useEffect(() => {
      const fetchProfile = async () => {
          try {
              const token = localStorage.getItem('access_token');
              if (!token) return router.push('/login');

              const config = { headers: { Authorization: `Bearer ${token}` } };
              const res = await api.get('users/me/', config);

              setProfile({
                  first_name: res.data.first_name || '',
                  last_name: res.data.last_name || '',
                  email: res.data.email || '',
                  specialty: res.data.specialty || '',
                  bio: res.data.bio || ''
              });

              // Set the image from the database if it exists
              if (res.data.profile_image) {
                  setPreviewImage(res.data.profile_image);
              }

          } catch (error) {
              console.error("Failed to load profile", error);
          } finally {
              setLoading(false);
          }
      };
      fetchProfile();
  }, [router]);

  // --- NEW: HANDLE IMAGE SELECTION ---
  const handleImageChange = (e) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setSelectedImage(file); // Store file for submission
          setPreviewImage(URL.createObjectURL(file)); // Show instant preview
      }
  };

  // --- 2. HANDLE SAVE PROFILE ---
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
        const token = localStorage.getItem('access_token');

        // --- Convert to FormData for File Upload ---
        const formData = new FormData();
        formData.append('first_name', profile.first_name);
        formData.append('last_name', profile.last_name);
        formData.append('specialty', profile.specialty);
        formData.append('bio', profile.bio);

        if (selectedImage) {
            formData.append('profile_image', selectedImage);
        }

        // Send as multipart/form-data
        await api.patch('users/me/', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data' // Required for files
            }
        });

        alert('Profile updated successfully!');
        window.location.reload(); // Refresh to update sidebar avatar

    } catch (error) {
        console.error("Update failed", error);
        alert("Failed to update settings. Please try again.");
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading settings...</div>;

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>

        {/* --- HEADER WITH BACK BUTTON --- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <HoverButton
                onClick={() => router.push('/doctor/schedule')}
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
                            <img src={previewImage} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                            <div>
                                {/* Hidden File Input */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="profileImageInput"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />

                                {/* Clicking this label triggers the hidden input */}
                                <label htmlFor="profileImageInput">
                                    <div
                                        style={{
                                            padding: '8px 16px', border: '1px solid #e2e8f0', background: 'white',
                                            borderRadius: '6px', fontSize: '13px', fontWeight: '600', color: '#334155',
                                            cursor: 'pointer', display: 'inline-block', transition: 'background 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                    >
                                        Change Photo
                                    </div>
                                </label>
                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>JPG, GIF or PNG. Max 5MB.</div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>First Name</label>
                                <input type="text" value={profile.first_name} onChange={(e)=>setProfile({...profile, first_name: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Last Name</label>
                                <input type="text" value={profile.last_name} onChange={(e)=>setProfile({...profile, last_name: e.target.value})}
                                    style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }} />
                            </div>
                        </div>

                        {/* Email is read-only as changing it usually requires verification steps */}
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Email Address</label>
                            <input type="email" value={profile.email} disabled
                                style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', background: '#f8fafc', color: '#94a3b8' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Professional Title</label>
                            <input type="text" value={profile.specialty} onChange={(e)=>setProfile({...profile, specialty: e.target.value})}
                                style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Bio / Description</label>
                            <textarea value={profile.bio} onChange={(e)=>setProfile({...profile, bio: e.target.value})}
                                style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '6px', minHeight: '100px', resize: 'vertical', outline: 'none' }} />
                        </div>

                        <div style={{ paddingTop: '20px', borderTop: '1px solid #f1f5f9', textAlign: 'right' }}>
                            <HoverButton
                                type="submit"
                                disabled={saving}
                                style={{
                                    background: '#0f766e', hoverBackground: '#115e59',
                                    color: 'white', padding: '10px 24px', borderRadius: '8px',
                                    border: 'none', fontWeight: '600'
                                }}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </HoverButton>
                        </div>
                    </form>
                )}

                {/* --- SECURITY TAB  --- */}
                {activeTab === 'security' && (
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        if (passwords.new !== passwords.confirm) {
                            return alert("New passwords do not match!");
                        }
                        if (passwords.new.length < 8) {
                            return alert("Password must be at least 8 characters.");
                        }

                        setPassLoading(true);
                        try {
                            const token = localStorage.getItem('access_token');
                            const res = await api.post('users/change-password/', {
                                current_password: passwords.current,
                                new_password: passwords.new
                            }, { headers: { Authorization: `Bearer ${token}` } });

                            alert("Password changed successfully!");
                            setPasswords({ current: '', new: '', confirm: '' }); // Clear form
                        } catch (error) {
                            alert(error.response?.data?.error || "Failed to change password.");
                        } finally {
                            setPassLoading(false);
                        }
                    }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#334155', margin: 0, borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' }}>Security & Login</h3>

                        <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Current Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPass.current ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={passwords.current}
                                    onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                    required
                                    style={{ width: '100%', padding: '10px 40px 10px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }}
                                />
                                <iconify-icon
                                    icon={showPass.current ? "lucide:eye-off" : "lucide:eye"}
                                    onClick={() => setShowPass({...showPass, current: !showPass.current})}
                                    style={{ position: 'absolute', right: '12px', top: '12px', cursor: 'pointer', color: '#94a3b8', fontSize: '18px' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPass.new ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                        required
                                        style={{ width: '100%', padding: '10px 40px 10px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }}
                                    />
                                    <iconify-icon
                                        icon={showPass.new ? "lucide:eye-off" : "lucide:eye"}
                                        onClick={() => setShowPass({...showPass, new: !showPass.new})}
                                        style={{ position: 'absolute', right: '12px', top: '12px', cursor: 'pointer', color: '#94a3b8', fontSize: '18px' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#475569' }}>Confirm New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPass.confirm ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={passwords.confirm}
                                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                        required
                                        style={{ width: '100%', padding: '10px 40px 10px 10px', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }}
                                    />
                                    <iconify-icon
                                        icon={showPass.confirm ? "lucide:eye-off" : "lucide:eye"}
                                        onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})}
                                        style={{ position: 'absolute', right: '12px', top: '12px', cursor: 'pointer', color: '#94a3b8', fontSize: '18px' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                             <HoverButton type="submit" disabled={passLoading} style={{ background: '#0f766e', hoverBackground: '#115e59', color: 'white', padding: '10px 24px', borderRadius: '8px', border: 'none', fontWeight: '600' }}>
                                 {passLoading ? 'Updating...' : 'Update Password'}
                             </HoverButton>
                        </div>

                        <div style={{ marginTop: '20px', padding: '15px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px' }}>
                            <h4 style={{ fontSize: '14px', color: '#b91c1c', margin: '0 0 5px 0' }}>Two-Factor Authentication</h4>
                            <p style={{ fontSize: '12px', color: '#7f1d1d', margin: 0 }}>Protect your account with an extra layer of security.</p>
                            <HoverButton style={{ marginTop: '10px', background: 'white', hoverBackground: '#fff1f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>Enable 2FA</HoverButton>
                        </div>
                    </form>
                )}

                {/* --- NOTIFICATIONS TAB (Static Placeholder) --- */}
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