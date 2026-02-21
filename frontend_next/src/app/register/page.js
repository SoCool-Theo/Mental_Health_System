'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../styles/Login.css';

export default function RegisterPage() {
  const router = useRouter();

  // Added role state to toggle between Patient and Therapist
  const [role, setRole] = useState('PATIENT');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '', // For Patient
    licenseNo: '', // For Therapist
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
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!formData.agreed) {
      alert("You must agree to the Terms and Conditions.");
      return;
    }

    setLoading(true);

    // Prepare the payload based on the selected role
    const payload = {
      role: role,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      ...(role === 'PATIENT' ? {
        dob: formData.dob
      } : {
        licenseNo: formData.licenseNo
      })
    };

    console.log("Registering payload:", payload);

    // --- REAL API CALL TO DJANGO ---
    try {
      const response = await fetch('http://localhost:8000/api/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Success (Status 201)
        alert(`${role === 'PATIENT' ? 'Patient' : 'Doctor'} Registration Successful! Please log in.`);
        router.push('/login');
      } else {
        // Validation Errors from Django (Status 400)
        console.error("Registration errors:", data);
        
        // Format the errors so the user can read them (e.g., "email: A user with this email already exists.")
        let errorMessage = "Registration failed:\n";
        for (const key in data) {
           errorMessage += `- ${key}: ${data[key]}\n`;
        }
        alert(errorMessage);
      }
    } catch (error) {
      // Network Errors (e.g., Django server isn't running)
      console.error("Network error:", error);
      alert("Network error. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  // --- New Toggle Switch Styles ---
  const toggleContainerStyle = {
    display: 'flex',
    background: 'rgba(30, 30, 30, 0.5)', // Lighter shade of the theme blue for the track
    borderRadius: '50px',
    padding: '4px',
    marginBottom: '25px',
    border: '1px solid rgba(23, 23, 23, 0.3)' // Subtle border
  };

  const activeToggleStyle = {
    flex: 1,
    padding: '10px',
    background: 'white', // White "pill" for active state
    color: '#000000', // Theme blue text
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  };

  const inactiveToggleStyle = {
    flex: 1,
    padding: '10px',
    background: 'transparent', // Transparent for inactive state
    color: 'white', // White text
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease'
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

      <div className="login-content" style={{ marginTop: '40px', marginBottom: '40px' }}>
          
          <div className="lyfe-title-group">
              <h1 className="lyfe-title">LYFE</h1>
              <div className="lyfe-subtitle">Wellness Clinic</div>
          </div>
          
          <div className="login-card">
            
            {/* NEW ROLE TOGGLE SWITCH */}
            <div style={toggleContainerStyle}>
                <button 
                    type="button" 
                    onClick={() => setRole('PATIENT')} 
                    style={role === 'PATIENT' ? activeToggleStyle : inactiveToggleStyle}
                >
                    I am a Patient
                </button>
                <button 
                    type="button" 
                    onClick={() => setRole('THERAPIST')} 
                    style={role === 'THERAPIST' ? activeToggleStyle : inactiveToggleStyle}
                >
                    I am a Doctor
                </button>
            </div>

            <form onSubmit={handleRegister}>
                
              {/* Name Row */}
              <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">First Name</label>
                    <input type="text" name="firstName" className="form-input" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Last Name</label>
                    <input type="text" name="lastName" className="form-input" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                  </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="form-input" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
              </div>

              {/* CONDITIONAL FIELDS BASED ON ROLE */}
              {role === 'PATIENT' && (
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" name="dob" className="form-input" value={formData.dob} onChange={handleChange} required />
                  </div>
              )}

              {role === 'THERAPIST' && (
                  <div className="form-group">
                    <label className="form-label">Medical License Number</label>
                    <input type="text" name="licenseNo" className="form-input" placeholder="Enter license number" value={formData.licenseNo} onChange={handleChange} required />
                  </div>
              )}

              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" name="password" className="form-input" placeholder="Create password" value={formData.password} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input type="password" name="confirmPassword" className="form-input" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} required />
              </div>

              {/* Checkbox */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <input type="checkbox" name="agreed" checked={formData.agreed} onChange={handleChange} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                  <span style={{ color: 'white', fontSize: '13px' }}>
                    Agree to Terms and Conditions
                  </span>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register'}
              </button>

              {/* --- CENTERED TEXT LINKS --- */}
              <div className="auth-links" style={{ alignItems: 'center', marginTop: '20px' }}>
                  <span style={{ color: '#eee', fontSize: '14px' }}>Already have an account?</span>
                  <div className="auth-link" onClick={() => router.push('/login')} style={{ fontSize: '14px', cursor: 'pointer' }}>
                    Sign in here
                  </div>
              </div>

            </form>
          </div>
      </div>
    </div>
  );
}