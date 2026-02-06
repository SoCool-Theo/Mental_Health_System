'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import '../styles/Login.css'; // Re-use the existing styles

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API Call
    console.log("Requesting password reset for:", email);
    
    setTimeout(() => {
        setLoading(false);
        alert(`If an account exists for ${email}, you will receive a reset link shortly.`);
        router.push('/login'); // Redirect back to login
    }, 1500);
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

      <div className="login-content">
          
          <div className="lyfe-title-group">
              <h1 className="lyfe-title">LYFE</h1>
              <div className="lyfe-subtitle">Account Recovery</div>
          </div>
          
          <div className="login-card">
            <form onSubmit={handleReset}>
                
              <div style={{ textAlign: 'center', marginBottom: '20px', color: '#eee', fontSize: '14px' }}>
                  Enter your email address and we'll send you a link to reset your password.
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sending Link...' : 'Send Reset Link'}
              </button>

              {/* --- CENTERED BACK LINK --- */}
              <div className="auth-links" style={{ alignItems: 'center', marginTop: '25px' }}>
                  <div 
                    className="auth-link" 
                    onClick={() => router.push('/login')}
                    style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    ← Back to Sign In
                  </div>
              </div>

            </form>
          </div>
      </div>
    </div>
  );
}