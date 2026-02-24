'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import api from '../../api';        
import '../styles/Login.css'; 

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(''); 

    try {
      const res = await api.post('token/', { username, password });
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);

      const userRes = await api.get('users/me/', {
        headers: { Authorization: `Bearer ${res.data.access}` }
      });
      const user = userRes.data;

      if (user.is_superuser) {
          router.push('/admin/dashboard');
      } else if (user.is_therapist || user.is_staff) {
          router.push('/doctor/schedule');
      } else {
          router.push('/patient/homepage');
      }

    } catch (error) {
      console.error("Login Error:", error);
      if (error.response && error.response.status === 401) {
        setErrorMessage("Wrong username or password.");
      } else {
        setErrorMessage("Connection failed. Please check your network.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      
      {/* ================= BACKGROUND LAYERS ================= */}
      <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: "url('/first_background_homepage.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -2
      }}></div>

      <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(30, 30, 30, 0.4)',  
            backdropFilter: 'blur(8px)',          
            WebkitBackdropFilter: 'blur(8px)',
            zIndex: -1
      }}></div>
      {/* ===================================================== */}

      {/* --- NEW BACK BUTTON --- */}
      <button 
        onClick={() => router.push('/')} // Go back to Homepage
        style={{
            position: 'absolute', top: '30px', left: '30px', zIndex: 10,
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)',
            color: 'white', padding: '10px 20px', borderRadius: '30px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '14px', fontFamily: 'sans-serif', backdropFilter: 'blur(4px)',
            transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#333';
        }}
        onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = 'white';
        }}
      >
        <span>←</span> Back to Home
      </button>
      {/* ----------------------- */}

      <div className="login-content">
          
          <div className="lyfe-title-group">
              <h1 className="lyfe-title">LYFE</h1>
              <div className="lyfe-subtitle">Wellness Clinic</div>
          </div>
          
          <div className="login-card">
            <form onSubmit={handleLogin}>
                
              {errorMessage && (
                <div className="error-msg">
                    {errorMessage}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Username / Email</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              {/* --- CENTERED LINKS --- */}
              <div className="auth-links" style={{ alignItems: 'center' }}>
                  <div 
                      className="auth-link" 
                      onClick={() => router.push('/forgot-password')} 
                  >
                      Forgot password?
                  </div>
                  <div 
                    className="auth-link" 
                    onClick={() => router.push('/register')}
                  >
                    Register new account
                  </div>
              </div>

            </form>
          </div>
      </div>
    </div>
  );
}