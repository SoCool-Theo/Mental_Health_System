'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../api';
import '../styles/Login.css';

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState('PATIENT');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dob: '', // For Patient
    licenseNo: '', // For Therapist
    specialization: '', // New: For Therapist
    gender: 'Any',
    focus_areas: [],
    profile_image: null,
    agreed: false
  });

  const [loading, setLoading] = useState(false);

  // --- NEW: PASSWORD VISIBILITY STATES ---
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- HANDLE STANDARD INPUTS ---
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file') {
        setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
        setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
        }));
    }
  };

  // --- HANDLE MULTIPLE FOCUS AREAS ---
  const toggleFocusArea = (area) => {
    setFormData(prev => {
        const currentAreas = prev.focus_areas;
        if (currentAreas.includes(area)) {
            return { ...prev, focus_areas: currentAreas.filter(a => a !== area) };
        } else {
            return { ...prev, focus_areas: [...currentAreas, area] };
        }
    });
  };

  // --- SUBMIT FORM ---
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

    const submitData = new FormData();
    submitData.append('role', role);
    submitData.append('firstName', formData.firstName);
    submitData.append('lastName', formData.lastName);
    submitData.append('email', formData.email);
    submitData.append('password', formData.password);

    if (role === 'PATIENT') {
        submitData.append('dob', formData.dob);
    } else {
        submitData.append('licenseNo', formData.licenseNo);
        submitData.append('specialization', formData.specialization); // Appended specialization
        submitData.append('gender', formData.gender);

        formData.focus_areas.forEach(area => {
            submitData.append('focus_areas', area);
        });

        if (formData.profile_image) {
            submitData.append('profile_image', formData.profile_image);
        }
    }

    try {
      const response = await api.post('users/register/', submitData);

      alert(`${role === 'PATIENT' ? 'Patient' : 'Doctor'} Registration Successful! Please log in.`);
      router.push('/login');
    } catch (error) {
      if (error.response) {
        console.error("Registration errors:", error.response.data);
        let errorMessage = "Registration failed:\n";
        for (const key in error.response.data) {
           errorMessage += `- ${key}: ${error.response.data[key]}\n`;
        }
        alert(errorMessage);
      } else {
        console.error("Network error:", error);
        alert("Network error. Please make sure the backend server is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- Toggle Switch Styles ---
  const toggleContainerStyle = { display: 'flex', background: 'rgba(30, 30, 30, 0.5)', borderRadius: '50px', padding: '4px', marginBottom: '25px', border: '1px solid rgba(23, 23, 23, 0.3)' };
  const activeToggleStyle = { flex: 1, padding: '10px', background: 'white', color: '#000000', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s ease', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' };
  const inactiveToggleStyle = { flex: 1, padding: '10px', background: 'transparent', color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.3s ease' };

  return (
    <div className="login-container">

      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/first_background_homepage.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -2 }}></div>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(30, 30, 30, 0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', zIndex: -1 }}></div>

      <div className="login-content" style={{ marginTop: '40px', marginBottom: '40px' }}>

          <div className="lyfe-title-group">
              <h1 className="lyfe-title">LYFE</h1>
              <div className="lyfe-subtitle">Wellness Clinic</div>
          </div>

          <div className="login-card">

            <div style={toggleContainerStyle}>
                <button type="button" onClick={() => setRole('PATIENT')} style={role === 'PATIENT' ? activeToggleStyle : inactiveToggleStyle}>I am a Patient</button>
                <button type="button" onClick={() => setRole('THERAPIST')} style={role === 'THERAPIST' ? activeToggleStyle : inactiveToggleStyle}>I am a Doctor</button>
            </div>

            <form onSubmit={handleRegister}>

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

              {/* === PATIENT FIELDS === */}
              {role === 'PATIENT' && (
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input type="date" name="dob" className="form-input" value={formData.dob} onChange={handleChange} required />
                  </div>
              )}

              {/* === THERAPIST FIELDS === */}
              {role === 'THERAPIST' && (
                  <>
                      <div className="form-group">
                        <label className="form-label">Medical License Number</label>
                        <input type="text" name="licenseNo" className="form-input" placeholder="Enter license number" value={formData.licenseNo} onChange={handleChange} required />
                      </div>

                      {/* NEW: SPECIALIZATION FIELD */}
                      <div className="form-group">
                        <label className="form-label">Specialization</label>
                        <input type="text" name="specialization" className="form-input" placeholder="e.g. CBT, Trauma, Child Psychology" value={formData.specialization} onChange={handleChange} required />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Gender</label>
                        <select name="gender" className="form-input" value={formData.gender} onChange={handleChange} style={{ color: '#333' }}>
                            <option value="Any">Prefer not to say</option>
                            <option value="Female therapist">Female</option>
                            <option value="Male therapist">Male</option>
                            <option value="Non-binary">Non-binary</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Focus Areas</label>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '5px' }}>
                            {['Anxiety', 'Depression', 'Stress & burnout'].map(tag => {
                                const isSelected = formData.focus_areas.includes(tag);
                                return (
                                    <button
                                        type="button"
                                        key={tag}
                                        onClick={() => toggleFocusArea(tag)}
                                        style={{
                                            background: isSelected ? '#0ea5e9' : 'rgba(255,255,255,0.1)',
                                            color: 'white',
                                            padding: '6px 12px',
                                            borderRadius: '15px',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            border: isSelected ? '1px solid #0ea5e9' : '1px solid rgba(255,255,255,0.3)'
                                        }}>
                                        {tag}
                                    </button>
                                )
                            })}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Profile Picture (Optional)</label>
                        <input
                            id="profilePicUpload"
                            type="file"
                            name="profile_image"
                            accept="image/*"
                            onChange={handleChange}
                            style={{ display: 'none' }}
                        />
                        <label
                            htmlFor="profilePicUpload"
                            style={{
                                display: 'block', background: 'rgba(255, 255, 255, 0.05)', border: '1px dashed rgba(255, 255, 255, 0.4)',
                                padding: '12px 15px', borderRadius: '8px', color: formData.profile_image ? 'white' : 'rgba(255,255,255,0.7)',
                                fontSize: '13px', marginTop: '5px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'; e.currentTarget.style.borderColor = 'white'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'; }}
                        >
                            {formData.profile_image ? `📁 ${formData.profile_image.name}` : 'Click to choose a file...'}
                        </label>
                      </div>
                  </>
              )}

              {/* === PASSWORD WITH EYE ICON === */}
              <div className="form-group" style={{ marginTop: '15px' }}>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-input"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ paddingRight: '40px' }} // Make room for the icon
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgb(83,81,81)' }}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                    </button>
                </div>
              </div>

              {/* === CONFIRM PASSWORD WITH EYE ICON === */}
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className="form-input"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        style={{ paddingRight: '40px' }} // Make room for the icon
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgb(83,81,81)' }}
                    >
                        {showConfirmPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                    </button>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                  <input type="checkbox" name="agreed" checked={formData.agreed} onChange={handleChange} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                  <span style={{ color: 'white', fontSize: '13px' }}>
                    Agree to Terms and Conditions
                  </span>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register'}
              </button>

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