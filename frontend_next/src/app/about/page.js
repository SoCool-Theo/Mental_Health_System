'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../api'; 
// Import the same CSS module used in Homepage for the hover effects
import styles from '../styles/Homepage.module.css'; 

export default function AboutPage() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // --- FETCH USER ---
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const res = await api.get('users/me/', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(res.data);
        } catch (error) {
          console.error("Auth Check:", error);
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsDropdownOpen(false);
    router.push('/');
  };

  return (
    <div style={{ fontFamily: 'Times New Roman, serif', minHeight: '100vh', backgroundColor: '#333' }} onClick={() => setIsDropdownOpen(false)}>
      
      {/* ================= FIXED BACKGROUND ================= */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/first_background_homepage.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(30, 30, 30, 0.6)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 0 }}></div>

      {/* ================= CONTENT CONTAINER ================= */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* --- HEADER (MATCHING HOMEPAGE EXACTLY) --- */}
        <header style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '25px 60px', borderBottom: '1px solid rgba(255,255,255,0.2)', color: 'white'
        }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
                <div style={{ fontSize: '40px', letterSpacing: '2px', cursor: 'pointer' }}>LYFE</div>
            </Link>
            
            <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                
                {/* 1. Standard Links with Hover Class */}
                <Link href="/" className={styles.navLink}>Home</Link>
                
                {!user && (
                    <Link href="/login" className={styles.navLink}>Sign In/ Register</Link>
                )}

                <Link href="/login" className={styles.navLink}>Booking</Link>
                <Link href="/login" className={styles.navLink}>Contact Us</Link>
                
                {/* Active Link (About Us) - Optional: add inline style to show it's active */}
                <Link href="/about" className={styles.navLink} style={{ borderBottom: '1px solid white' }}>
                    About Us
                </Link>

                {/* 2. USER PROFILE DROPDOWN */}
                {user && (
                    <div style={{ position: 'relative', marginLeft: '10px' }} onClick={(e) => e.stopPropagation()}>
                        <div 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{ 
                                width: '45px', height: '45px', borderRadius: '50%', 
                                overflow: 'hidden', cursor: 'pointer', border: '2px solid white', 
                                transition: 'transform 0.2s' 
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                        >
                            <img 
                                src={user?.profile_image || "https://i.pravatar.cc/150?img=12"} 
                                alt="Profile" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        </div>

                        {isDropdownOpen && (
                            <div style={{
                                position: 'absolute', top: '60px', right: '-10px', width: '280px', 
                                backgroundColor: '#e4e4e4', borderRadius: '20px', padding: '25px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.5)', color: '#333',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 100
                            }}>
                                <div style={{ width: '70px', height: '70px', borderRadius: '50%', overflow: 'hidden', marginBottom: '15px', border: '2px solid white' }}>
                                    <img src={user?.profile_image || "https://i.pravatar.cc/150?img=12"} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <h3 style={{ margin: '0', fontSize: '20px', fontWeight: 'bold' }}>{user.first_name} {user.last_name}</h3>
                                <p style={{ margin: '5px 0 20px 0', fontSize: '13px', color: '#666', fontFamily: 'sans-serif' }}>{user.email}</p>
                                
                                <div style={{ width: '100%', textAlign: 'left', fontSize: '16px' }}>
                                    <Link href={user.is_superuser ? '/admin/dashboard' : (user.is_staff ? '/doctor/dashboard' : '/patient/dashboard')} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div style={{ padding: '12px 0', borderTop: '1px solid #ccc', cursor: 'pointer', fontWeight: 'bold', color: '#0f766e' }}>Go to Dashboard</div>
                                    </Link>
                                </div>

                                <button 
                                    onClick={handleLogout} 
                                    style={{
                                        marginTop: '15px', padding: '8px 20px', 
                                        background: 'transparent', border: '1px solid #333', color: '#333',
                                        borderRadius: '8px', cursor: 'pointer', fontSize: '14px', 
                                        fontFamily: 'Times New Roman, serif', width: '100%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.background = '#333';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#333';
                                    }}
                                >
                                    <span>→</span> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </header>


        {/* --- MAIN SCROLLABLE CONTENT --- */}
        <div style={{ flex: 1, padding: '80px 10%', color: 'white', display: 'flex', flexDirection: 'column', gap: '100px' }}>
            
            {/* 1. HERO TEXT */}
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '64px', marginBottom: '20px', fontWeight: 'normal' }}>Heal. Grow. Thrive.</h1>
                <p style={{ fontSize: '18px', fontFamily: 'sans-serif', lineHeight: '1.6', opacity: 0.9 }}>
                    At LYFE, we believe mental wellness is a journey, not a destination. 
                    We are dedicated to providing accessible, compassionate, and personalized care 
                    to help you navigate life's challenges with resilience.
                </p>
            </div>

            {/* 2. MISSION & VISION */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
                    padding: '40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <h2 style={{ fontSize: '32px', marginBottom: '15px' }}>Our Mission</h2>
                    <p style={{ fontFamily: 'sans-serif', lineHeight: '1.6', opacity: 0.8 }}>
                        To destigmatize mental health care and empower individuals by providing 
                        a safe, supportive environment where they can find clarity and strength.
                    </p>
                </div>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
                    padding: '40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <h2 style={{ fontSize: '32px', marginBottom: '15px' }}>Our Vision</h2>
                    <p style={{ fontFamily: 'sans-serif', lineHeight: '1.6', opacity: 0.8 }}>
                        A world where mental health is prioritized as a fundamental human right, 
                        accessible to everyone regardless of their background or circumstances.
                    </p>
                </div>
            </div>

            {/* 3. OUR VALUES */}
            <div>
                <h2 style={{ fontSize: '48px', textAlign: 'center', marginBottom: '50px' }}>Core Values</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
                    {[
                        { title: 'Compassion', desc: 'We listen with empathy and without judgment.' },
                        { title: 'Integrity', desc: 'We uphold the highest ethical standards in our practice.' },
                        { title: 'Innovation', desc: 'We embrace modern technology to make care accessible.' }
                    ].map((val, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                            <div style={{ 
                                width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', 
                                margin: '0 auto 20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' 
                            }}>
                                ✦
                            </div>
                            <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>{val.title}</h3>
                            <p style={{ fontFamily: 'sans-serif', opacity: 0.7, fontSize: '14px' }}>{val.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. MEET THE TEAM PREVIEW */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.05)', borderRadius: '30px', padding: '60px',
                display: 'flex', alignItems: 'center', gap: '50px'
            }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '42px', marginBottom: '20px' }}>Meet Our Specialists</h2>
                    <p style={{ fontFamily: 'sans-serif', lineHeight: '1.6', opacity: 0.8, marginBottom: '30px' }}>
                        Our team consists of licensed psychologists, psychiatrists, and therapists 
                        specializing in diverse areas such as anxiety, trauma, and family counseling.
                    </p>
                    
                    {/* GET IN TOUCH BUTTON WITH HOVER */}
                    <Link href="/contact">
                        <button 
                            style={{
                                padding: '12px 30px', 
                                background: 'white', color: '#333', 
                                border: '1px solid white',
                                borderRadius: '50px', fontSize: '16px', fontWeight: 'bold', 
                                cursor: 'pointer', transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'white';
                                e.currentTarget.style.color = '#333';
                            }}
                        >
                            Get in Touch
                        </button>
                    </Link>
                </div>
                
                {/* Image Grid */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div style={{ height: '180px', background: '#ccc', borderRadius: '15px', backgroundImage: 'url(https://i.pravatar.cc/300?img=5)', backgroundSize: 'cover' }}></div>
                    <div style={{ height: '180px', background: '#ccc', borderRadius: '15px', backgroundImage: 'url(https://i.pravatar.cc/300?img=9)', backgroundSize: 'cover', marginTop: '30px' }}></div>
                    <div style={{ height: '180px', background: '#ccc', borderRadius: '15px', backgroundImage: 'url(https://i.pravatar.cc/300?img=3)', backgroundSize: 'cover', marginTop: '-30px' }}></div>
                    <div style={{ height: '180px', background: '#ccc', borderRadius: '15px', backgroundImage: 'url(https://i.pravatar.cc/300?img=8)', backgroundSize: 'cover' }}></div>
                </div>
            </div>

        </div>

        {/* --- FOOTER --- */}
        <footer style={{ padding: '40px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', fontFamily: 'sans-serif', fontSize: '12px' }}>
            © 2026 LYFE Wellness Clinic. All rights reserved.
        </footer>

      </div>
    </div>
  );
}