'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import api from '../../../api';

export default function ConfigurationsLayout({ children }) {
  const pathname = usePathname();

  // --- DYNAMIC ADMIN STATE ---
  const [adminData, setAdminData] = useState({
    name: 'Loading...',
    role: 'Admin',
    profileImage: null // NEW: Track the image
  });

  // --- FETCH ADMIN DATA ON LOAD ---
  useEffect(() => {
    const fetchAdminInfo = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const response = await api.get('users/me/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = response.data;
        const fullName = `${data.first_name} ${data.last_name}`.trim() || data.username;

        setAdminData({
          name: fullName,
          role: 'Administrator',
          // NEW: Grab the profile image if the backend provides it
          profileImage: data.profile_image || null
        });
      } catch (error) {
        console.error("Failed to fetch admin info:", error);
        setAdminData({ name: 'Admin User', role: 'Admin', profileImage: null });
      }
    };

    fetchAdminInfo();
  }, []);

  // Helper to check active state
  const isActive = (path) => pathname === path;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>

      {/* --- SHARED HEADER --- */}
      <div className="header-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '20px 30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '28px', color: '#354f42', margin: 0 }}>
          Configurations
        </h2>

        {/* --- DYNAMIC ADMIN PROFILE --- */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#333', fontFamily: 'sans-serif' }}>
              {adminData.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666', fontFamily: 'sans-serif' }}>
              {adminData.role}
            </div>
          </div>

          {/* NEW: Avatar with dynamic image or default fallback */}
          <div style={{
              width: '45px', height: '45px',
              borderRadius: '50%',
              backgroundColor: '#ccc', // Fallback background color before image loads
              backgroundImage: `url(${adminData.profileImage ? adminData.profileImage : '/medical-profile-default.png'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: 'none'
          }}>
          </div>
        </div>
      </div>

      {/* --- SPLIT CONTENT --- */}
      <div style={{ display: 'flex', gap: '24px', flex: 1, alignItems: 'flex-start' }}>

        {/* --- SHARED SUB-MENU (Left Column) --- */}
        <div className="content-card" style={{ width: '280px', padding: '24px 16px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '20px', color: '#354f42', margin: '0 0 20px 8px' }}>
                Clinic Configurations
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#555', fontFamily: 'sans-serif' }}>

                <div style={{ padding: '10px 15px', cursor: 'default', opacity: 0.6 }}>General Settings</div>

                {/* Appointment Types Link */}
                <Link href="/admin/configurations" style={{ textDecoration: 'none' }}>
                    <div style={{
                        padding: '10px 15px', cursor: 'pointer', borderRadius: '30px',
                        display: 'flex', justifyContent: 'space-between', transition: 'all 0.2s',
                        border: isActive('/admin/configurations') ? '1px solid #4a6b5d' : '1px solid transparent',
                        color: isActive('/admin/configurations') ? '#4a6b5d' : '#555',
                        fontWeight: isActive('/admin/configurations') ? 'bold' : 'normal',
                        background: isActive('/admin/configurations') ? 'rgba(74, 107, 93, 0.05)' : 'transparent'
                    }}>
                        Appointment Types {isActive('/admin/configurations') && <span>›</span>}
                    </div>
                </Link>

                {/* Locations Link */}
                <Link href="/admin/configurations/locations" style={{ textDecoration: 'none' }}>
                    <div style={{
                        padding: '10px 15px', cursor: 'pointer', borderRadius: '30px',
                        display: 'flex', justifyContent: 'space-between', transition: 'all 0.2s',
                        border: isActive('/admin/configurations/locations') ? '1px solid #4a6b5d' : '1px solid transparent',
                        color: isActive('/admin/configurations/locations') ? '#4a6b5d' : '#555',
                        fontWeight: isActive('/admin/configurations/locations') ? 'bold' : 'normal',
                        background: isActive('/admin/configurations/locations') ? 'rgba(74, 107, 93, 0.05)' : 'transparent'
                    }}>
                        Locations {isActive('/admin/configurations/locations') && <span>›</span>}
                    </div>
                </Link>

                {/* Operating Hours Link */}
                <Link href="/admin/configurations/operating-hours" style={{ textDecoration: 'none' }}>
                    <div style={{
                        padding: '10px 15px', cursor: 'pointer', borderRadius: '30px',
                        display: 'flex', justifyContent: 'space-between', transition: 'all 0.2s',
                        border: isActive('/admin/configurations/operating-hours') ? '1px solid #4a6b5d' : '1px solid transparent',
                        color: isActive('/admin/configurations/operating-hours') ? '#4a6b5d' : '#555',
                        fontWeight: isActive('/admin/configurations/operating-hours') ? 'bold' : 'normal',
                        background: isActive('/admin/configurations/operating-hours') ? 'rgba(74, 107, 93, 0.05)' : 'transparent'
                    }}>
                        Operating Hours {isActive('/admin/configurations/operating-hours') && <span>›</span>}
                    </div>
                </Link>
            </div>
        </div>

        {/* --- DYNAMIC RIGHT CONTENT --- */}
        <div className="content-card" style={{ flex: 1, minHeight: '600px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', padding: '24px' }}>
            {children}
        </div>

      </div>
    </div>
  );
}