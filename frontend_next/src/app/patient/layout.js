'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation'; // <-- ADDED usePathname
import api from '../../api';
import styles from './patient_dashboard.module.css';

export default function PatientLayout({ children }) {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname(); // <-- GETS CURRENT URL

  // Fetch User Data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
           router.push('/login');
           return;
        }

        const res = await api.get('users/me/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);

      } catch (error) {
        console.error("Auth Error:", error);
        router.push('/login');
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = () => {
      localStorage.clear();
      router.push('/');
  };

  // --- HELPER FUNCTION FOR ACTIVE LINKS ---
  const getLinkStyle = (path) => {
      // Checks if the current URL exactly matches the link, or is a sub-page of it
      const isActive = pathname === path || pathname.startsWith(path + '/');
      return {
          textDecoration: 'none',
          color: 'white',
          borderBottom: isActive ? '2px solid #ffffff' : '2px solid transparent',
          paddingBottom: '4px',
          transition: 'all 0.2s ease'
      };
  };

  // --- HELPER FUNCTION FOR PROFILE IMAGE ---
  const getProfileImage = () => {
      if (user && user.profile_image) {
          // If Django sends a relative URL, attach localhost:8000 to it
          return user.profile_image.startsWith('http')
              ? user.profile_image
              : `http://localhost:8000${user.profile_image}`;
      }
      return "https://i.pravatar.cc/150?img=12"; // Fallback image
  };

  return (
    <div style={{ fontFamily: 'Times New Roman, serif', minHeight: '100vh', position: 'relative' }}>

      {/* --- HEADER --- */}
      <header style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '25px 60px',
          borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}>

          <Link href="/patient/homepage" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: '40px', letterSpacing: '2px', color: 'white', cursor: 'pointer' }}>
                  LYFE
              </div>
          </Link>

          <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>

              <Link href="/patient/homepage" className={styles.navLink} style={getLinkStyle('/patient/homepage')}>
                  Home
              </Link>

              <Link href="/patient/dashboard" className={styles.navLink} style={getLinkStyle('/patient/dashboard')}>
                  Dashboard
              </Link>

              <Link href="/patient/booking" className={styles.navLink} style={getLinkStyle('/patient/booking')}>
                  Booking
              </Link>

              <Link href="/patient/messages" className={styles.navLink} style={getLinkStyle('/patient/messages')}>
                  Messages
              </Link>

              <Link href="/patient/contact" className={styles.navLink} style={getLinkStyle('/patient/contact')}>
                  Contact Us
              </Link>

              {/* --- PROFILE PICTURE & DROPDOWN AREA --- */}
              <div style={{ position: 'relative' }}>

                  <div
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      style={{
                          width: '45px', height: '45px', borderRadius: '50%',
                          overflow: 'hidden', cursor: 'pointer',
                          border: '2px solid white',
                          transition: 'transform 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                  >
                      <img
                          src={getProfileImage()} // <-- USING THE HELPER HERE
                          alt="Profile"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                  </div>

                  {isDropdownOpen && (
                      <div style={{
                          position: 'absolute', top: '60px', right: '-10px',
                          width: '300px',
                          backgroundColor: '#e4e4e4',
                          borderRadius: '20px',
                          padding: '30px 20px',
                          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                          display: 'flex', flexDirection: 'column', alignItems: 'center',
                          color: '#333',
                          zIndex: 100
                      }}>

                          <div style={{
                              width: '80px', height: '80px', borderRadius: '50%',
                              overflow: 'hidden', marginBottom: '15px', border: '2px solid white'
                          }}>
                              <img
                                  src={getProfileImage()} // <-- USING THE HELPER HERE
                                  alt="Profile"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                          </div>

                          <h3 style={{ margin: '0', fontFamily: 'Times New Roman, serif', fontSize: '22px', fontWeight: 'bold' }}>
                              {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
                          </h3>
                          <p style={{ margin: '5px 0 20px 0', fontSize: '13px', color: '#777', fontFamily: 'sans-serif' }}>
                              {user?.email || 'loading@email.com'}
                          </p>

                          <div style={{ width: '100%', textAlign: 'left', fontFamily: 'Times New Roman, serif', fontSize: '18px' }}>
                              <Link href="/patient/profile" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setIsDropdownOpen(false)}>
                                  <div style={{ padding: '12px 0', borderTop: '1px solid #ccc', cursor: 'pointer' }}>
                                      Edit Profile
                                  </div>
                              </Link>

                              <Link href="/patient/account-settings" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setIsDropdownOpen(false)}>
                                  <div style={{ padding: '12px 0', borderTop: '1px solid #ccc', cursor: 'pointer' }}>
                                      Account Settings
                                  </div>
                              </Link>

                              <Link href="/patient/change-password" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setIsDropdownOpen(false)}>
                                    <div style={{ padding: '12px 0', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc', cursor: 'pointer', marginBottom: '25px' }}>
                                        Change Password
                                    </div>
                                </Link>
                          </div>

                          <button
                              onClick={handleLogout}
                              style={{
                                  padding: '10px 25px', background: 'transparent',
                                  border: '1px solid #333', borderRadius: '8px',
                                  cursor: 'pointer', fontSize: '16px', fontFamily: 'Times New Roman, serif',
                                  display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.3s ease', color: '#333'
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.background = '#333'; e.currentTarget.style.color = 'white'; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#333'; }}
                          >
                              <span>→</span> Sign Out
                          </button>

                      </div>
                  )}
              </div>
          </nav>
      </header>

      {/* --- PAGE CONTENT --- */}
      <div onClick={() => setIsDropdownOpen(false)}> 
          {children}
      </div>

    </div>
  );
}