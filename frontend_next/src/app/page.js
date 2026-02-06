'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../api'; // Ensure this path matches your project structure
import styles from './styles/Homepage.module.css';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // --- FETCH USER (If Logged In) ---
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
          console.error("Homepage Auth Check:", error);
          // If error (e.g. expired token), we just stay as 'guest'
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsDropdownOpen(false);
    router.refresh();
  };

  return (
    <div style={{ fontFamily: 'Times New Roman, serif' }} onClick={() => setIsDropdownOpen(false)}> 
      
      {/* ================= HERO SECTION ================= */}
      <section style={{
        position: 'relative',
        height: '100vh',
        backgroundImage:"url('/first_background_homepage.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* FULL SCREEN GLASS OVERLAY */}
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(30, 30, 30, 0.5)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 1
        }}></div>

        {/* CONTENT */}
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>

            <header style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '25px 60px', borderBottom: '1px solid rgba(255,255,255,0.2)'
            }}>
                {/* --- 1. CLICKABLE LOGO --- */}
                <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
                    <div style={{ fontSize: '40px', letterSpacing: '2px', cursor: 'pointer' }}>LYFE</div>
                </Link>
                
                <nav style={{ display: 'flex', gap: '30px', alignItems: 'center'}}>
                    {/* Standard Links */}
                    <Link href="/" className={styles.navLink}>Home</Link>
                    
                    {/* DYNAMIC LINK: Hide "Sign In" if user is logged in */}
                    {!user && (
                        <Link href="/login" className={styles.navLink}>Sign In/ Register</Link>
                    )}

                    <Link href="/login" className={styles.navLink}>Booking</Link>
                    <Link href="/login" className={styles.navLink}>Contact Us</Link>
                    <Link href="/about" className={styles.navLink}>About Us</Link>

                    {/* --- 2. USER PROFILE DROPDOWN (If Logged In) --- */}
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
                                        {/* Dynamic Dashboard Link based on Role */}
                                        <Link href={user.is_superuser ? '/admin/dashboard' : (user.is_staff ? '/doctor/dashboard' : '/patient/dashboard')} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <div style={{ padding: '12px 0', borderTop: '1px solid #ccc', cursor: 'pointer', fontWeight: 'bold', color: '#0f766e' }}>
                                                Go to Dashboard
                                            </div>
                                        </Link>
                                        <Link href="/patient/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <div style={{ padding: '12px 0', borderTop: '1px solid #ccc', cursor: 'pointer' }}>Edit Profile</div>
                                        </Link>
                                    </div>

                                    <button onClick={handleLogout} style={{
                                        marginTop: '15px', padding: '8px 20px', background: 'transparent', border: '1px solid #333', 
                                        borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontFamily: 'Times New Roman, serif', 
                                        display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center'
                                    }}>
                                        <span>→</span> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </nav>
            </header>

            <div style={{
                flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                alignItems: 'flex-start', textAlign: 'left',
                paddingLeft: '50%', paddingRight: '10%'
            }}>
                <h3 style={{ fontSize: '14px', fontFamily: 'sans-serif', letterSpacing: '1px', opacity: 0.9, marginBottom: '15px' }}>
                    LYFE Wellness Clinic
                </h3>
                <h1 style={{ fontSize: '56px', fontWeight: '400', marginBottom: '40px', lineHeight: '1.2' }}>
                    Your Path to<br />Mental Health Wellness<br />Starts Here
                </h1>
                <Link href="/booking">
                    <button style={{
                        background: 'transparent', border: '1px solid white', color: 'white',
                        padding: '12px 35px', fontSize: '16px', fontFamily: 'sans-serif',
                        cursor: 'pointer', borderRadius: '50px', transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#585e54'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'white'; }}
                    >
                        Book Now
                    </button>
                </Link>
            </div>
        </div>
      </section>


      {/* ================= SERVICES SECTION ================= */}
      <section style={{
        position: 'relative', padding: '150px 10%', 
        backgroundImage: "url('/services_bg_homepage.jpg')",
        backgroundSize: 'cover', backgroundPosition: 'center',
        color: 'white', display: 'flex', flexDirection: 'column', gap: '40px'
      }}>
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(30, 30, 30, 0.5)', backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)', zIndex: 1
        }}></div>

        <div style={{ position: 'relative', zIndex: 2 }}>
            <div>
                <h2 style={{
                    fontSize: '50px', fontFamily: 'Times New Roman, serif', fontWeight: 'normal',
                    display: 'inline-block', borderBottom: '3px solid #fefefe', paddingBottom: '10px', marginBottom: '10px'
                }}>
                    Our Services
                </h2>
            </div>

            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '30px', textAlign: 'center', marginTop: '40px'
            }}>
                {/* Service Cards */}
                {[
                    { title: 'Individual Therapy', img: '/individual_therapy.jpg' },
                    { title: 'Stress & Anxiety Management', img: '/stress_anxiety.jpg' },
                    { title: 'Depression Support', img: '/depression_support.jpg' },
                    { title: 'Trauma-Informed Therapy', img: '/trauma.jpg' }
                ].map((svc, i) => (
                    <div key={i} className={styles.serviceCard} style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '100%', height: '300px', backgroundImage: `url('${svc.img}')`, backgroundSize: 'cover', borderRadius: '8px' }}></div>
                        <p style={{ fontFamily: 'sans-serif', fontSize: '14px' }}>{svc.title}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>


      {/* ================= CTA SECTION ================= */}
      <section style={{
        position: 'relative', height: '100vh', padding: '0 10%',
        backgroundColor: '#5a5a55', backgroundImage: "url('/CTA_bg_homepage.jpg')",
        backgroundSize: 'cover', backgroundPosition: 'center',
        color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center'
      }}>
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(30, 30, 30, 0.5)', backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)', zIndex: 1
        }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px' }}>
            <h2 style={{ fontSize: '48px', fontWeight: 'normal', lineHeight: '1.2', marginBottom: '20px' }}>
                You don’t have to navigate<br/>life’s challenges alone.<br/>We’re here to help.
            </h2>
            <p style={{ fontSize: '15px', fontFamily: 'sans-serif', opacity: 0.9, marginBottom: '40px' }}>
                Book an appointment with a licensed mental health professional today.
            </p>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '60px' }}>
                <Link href="/booking">
                    <button style={{
                        padding: '12px 30px', background: 'transparent', border: '1px solid white', color: 'white',
                        borderRadius: '50px', fontSize: '16px', cursor: 'pointer', fontFamily: 'sans-serif'
                    }}>
                        Book an Appointment
                    </button>
                </Link>
                <Link href="/contact">
                    <button style={{
                        padding: '12px 30px', background: 'transparent', border: '1px solid white', color: 'white',
                        borderRadius: '50px', fontSize: '16px', cursor: 'pointer', fontFamily: 'sans-serif'
                    }}>
                        Contact Us
                    </button>
                </Link>
            </div>

            {/* --- SOCIAL ICONS SECTION (Preserved your icon code) --- */}
            <div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <a href="#" style={{ transition: 'transform 0.2s' }}>
                        <img src="/icons/facebook_icon.jpg" alt="Facebook" style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', filter: 'invert(1)' }} />
                    </a>
                    <a href="#" style={{ transition: 'transform 0.2s' }}>
                        <img src="/icons/twitter_icon.jpg" alt="X" style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', filter: 'invert(1)' }} />
                    </a>
                    <a href="#" style={{ transition: 'transform 0.2s' }}>
                        <img src="/icons/instargram_icon.jpg" alt="Instagram" style={{ width: '30px', height: '30px', borderRadius: '12px', cursor: 'pointer', filter: 'invert(1)' }} />
                    </a>
                    <a href="#" style={{ transition: 'transform 0.2s' }}>
                        <img src="/icons/whatsup_icon.jpg" alt="WhatsApp" style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', filter: 'invert(1)' }} />
                    </a>
                </div>
            </div>
        </div>
      </section>

    </div>
  );
}