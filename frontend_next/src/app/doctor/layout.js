'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '../../api'; 
import '../styles/Dashboard.css'; 

export default function DoctorLayout({ children }) {
  const [doctorName, setDoctorName] = useState('Loading...');
  const [doctorAvatar, setDoctorAvatar] = useState('/medical-profile-default.png');
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) { router.push('/login'); return; }
            
            const response = await api.get('users/me/', {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDoctorName(response.data.display_name);

            // --- DYNAMIC IMAGE LOGIC ---
            if (response.data.profile_image) {
                let imgUrl = response.data.profile_image;

                // Grab the URL from your .env file, fallback to localhost
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

                // If Django sends a relative URL, attach the dynamic backend host
                if (imgUrl.startsWith('/')) {
                    imgUrl = `${backendUrl}${imgUrl}`;
                }

                setDoctorAvatar(imgUrl);
            }

        } catch (err) {
            console.error("Layout Load Error:", err);
        }
    };
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  return (
    <div className="dashboard-container">
      <div className="app-shell">

        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-header">Main Navigation</div>
          <div className="sidebar-nav">

            <Link href="/doctor/schedule" style={{textDecoration: 'none'}}>
                <div className={`sidebar-item ${pathname === '/doctor/schedule' ? 'sidebar-item-active' : ''}`}>
                    <iconify-icon icon="lucide:calendar-days" style={{fontSize: '18px'}}></iconify-icon>
                    <span>Schedule</span>
                </div>
            </Link>

            <Link href="/doctor/availability" style={{textDecoration: 'none'}}>
                <div className={`sidebar-item ${pathname === '/doctor/availability' ? 'sidebar-item-active' : ''}`}>
                    <iconify-icon icon="lucide:clock" style={{fontSize: '18px'}}></iconify-icon>
                    <span>My Hours</span>
                </div>
            </Link>

            <Link href="/doctor/message" style={{textDecoration: 'none'}}>
                <div className={`sidebar-item ${pathname.includes('message') ? 'sidebar-item-active' : ''}`}>
                    <iconify-icon icon="lucide:message-square" style={{fontSize: '18px'}}></iconify-icon>
                    <span>Messages</span>

                </div>
            </Link>

            <Link href="/doctor/patients" style={{textDecoration: 'none'}}>
                <div className={`sidebar-item ${pathname.includes('patients') ? 'sidebar-item-active' : ''}`}>
                    <iconify-icon icon="lucide:users" style={{fontSize: '18px'}}></iconify-icon>
                    <span>My Patients</span>
                </div>
            </Link>
          </div>

          <div style={{marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #ccc'}}>
            <div className="sidebar-item" onClick={handleLogout} style={{color: 'red'}}>
              <iconify-icon icon="lucide:log-out" style={{fontSize: '18px'}}></iconify-icon>
              <span>Logout</span>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="app-main" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            
            {/* TOP BAR */}
            <div className="header-bar" style={{ flexShrink: 0, justifyContent: 'space-between', padding: '15px 30px' }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <div className="logo-mark">T</div>
                    <h2 style={{fontSize: '18px', fontWeight: 'bold', color: '#334155'}}>Therapist Command Center</h2>
                </div>
                
                {/* PROFILE SECTION */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img 
                        src={doctorAvatar} 
                        alt="Profile"
                        onError={(e) => { e.target.src = '/medical-profile-default.png'; }} 
                        style={{
                            width: '42px', height: '42px', borderRadius: '50%',
                            objectFit: 'cover', border: '2px solid #fff',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                    />

                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.3' }}>
                        <span style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b' }}>
                            {doctorName}
                        </span>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                            Licensed Therapist
                        </span>
                    </div>

                    <Link href="/doctor/settings" style={{ textDecoration: 'none', display: 'flex' }}>
                        <div style={{ marginLeft: '12px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                             onMouseOver={(e) => e.currentTarget.style.color = '#334155'}
                             onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
                        >
                            <iconify-icon icon="lucide:settings" style={{fontSize: '20px'}}></iconify-icon>
                        </div>
                    </Link>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '0', backgroundColor: '#f8fafc' }}>
                {children}
            </div>

        </div>
      </div>
    </div>
  );
}