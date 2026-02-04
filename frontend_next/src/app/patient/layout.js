'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../api'; 
import styles from './patient_dashboard.module.css'; // <--- Importing your new CSS

export default function PatientLayout({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // 1. Fetch User Data (Global for all patient pages)
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

  // Logout Handler
  const handleLogout = () => {
      localStorage.clear();
      router.push('/login');
  };

  return (
    <div style={{ fontFamily: 'Times New Roman, serif', minHeight: '100vh', position: 'relative' }}>
      
      {/* --- EXTRACTED HEADER --- */}
      <header style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '25px 60px', 
          borderBottom: '1px solid rgba(255,255,255,0.2)'
      }}>
          <div style={{ fontSize: '40px', letterSpacing: '2px', color: 'white' }}>LYFE</div>
          
          <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
              
              <Link href="/patient/dashboard" className={styles.navLink}>
                  Home
              </Link>
              
              {/* CHANGED: Shows Profile Name instead of Sign In */}
              <Link href="/patient/profile" className={styles.navLink}>
                  {user ? `Profile (${user.first_name})` : 'Profile'}
              </Link>

              <Link href="/patient/booking" className={styles.navLink}>
                  Booking
              </Link>
              
              <Link href="/patient/messages" className={styles.navLink}>
                  Messages
              </Link>

              <Link href="/patient/contact" className={styles.navLink}>
                  Contact Us
              </Link>
              
              <button onClick={handleLogout} style={{ 
                  background: 'transparent', border: '1px solid #ffcccc', color: '#ffcccc', 
                  padding: '5px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', marginLeft: '10px'
              }}>
                  Sign Out
              </button>
              

          </nav>
      </header>

      {/* --- PAGE CONTENT --- */}
      {children}

    </div>
  );
}