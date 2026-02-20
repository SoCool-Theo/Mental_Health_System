'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import '../styles/Login.css'; 

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreed: false
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.agreed) {
        alert("You must agree to the Terms and Conditions.");
        return;
    }
    setLoading(true);
    
    // Simulate API Call
    console.log("Registering:", formData);
    setTimeout(() => {
        setLoading(false);
        alert("Registration Successful! Please log in.");
        router.push('/login');
    }, 1000);
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
              <div className="lyfe-subtitle">Wellness Clinic</div>
          </div>
          
          <div className="login-card">
            <form onSubmit={handleRegister}>
                
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" name="email"
                  className="form-input" 
                  placeholder="Enter email"
                  value={formData.email} onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" name="password"
                  className="form-input" 
                  placeholder="Create password"
                  value={formData.password} onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input 
                  type="password" name="confirmPassword"
                  className="form-input" 
                  placeholder="Confirm password"
                  value={formData.confirmPassword} onChange={handleChange}
                  required
                />
              </div>

              {/* Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <input 
                    type="checkbox" name="agreed"
                    checked={formData.agreed} onChange={handleChange}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <span style={{ color: 'white', fontSize: '13px' }}>
                    Agree to Terms and Conditions
                  </span>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register'}
              </button>

              {/* --- CENTERED TEXT LINKS --- */}
              <div className="auth-links" style={{ alignItems: 'center' }}>
                  <span style={{ color: '#eee', fontSize: '14px' }}>Already have an account?</span>
                  <div 
                    className="auth-link" 
                    onClick={() => router.push('/login')}
                    style={{ fontSize: '14px' }}
                  >
                    Sign in here
                  </div>
              </div>

            </form>
          </div>
      </div>
    </div>
  );
}