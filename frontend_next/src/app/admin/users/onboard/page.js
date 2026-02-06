'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardStaffPage() {
  const router = useRouter();
  
  // Hover States
  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Therapist',
    license: '',
    specialization: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Onboarding Staff:", formData);
    // Add API call here
    router.push('/admin/users');
  };

  return (
    <>
      {/* --- PAGE HEADER --- */}
      <div className="header-card">
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '28px', color: '#354f42', margin: 0 }}>
          Onboard Staff
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Adam Smith</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Admin</div>
          </div>
          <div style={{ width: '45px', height: '45px', background: '#354f42', borderRadius: '50%' }}></div>
        </div>
      </div>

      {/* --- FORM CONTENT --- */}
      <div className="content-card" style={{ marginTop: '24px', maxWidth: '800px' }}>
        
        <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', color: '#354f42', margin: '0 0 5px 0' }}>
                New Staff Profile
            </h3>
            <span style={{ fontSize: '13px', color: '#666' }}>Create a new account for a therapist or admin.</span>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* ROW 1: Names */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>First Name</label>
                    <input 
                        type="text" name="firstName" required
                        placeholder="e.g. Sarah"
                        value={formData.firstName} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Last Name</label>
                    <input 
                        type="text" name="lastName" required
                        placeholder="e.g. Connor"
                        value={formData.lastName} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>
            </div>

            {/* ROW 2: Email & Role */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Work Email</label>
                    <input 
                        type="email" name="email" required
                        placeholder="sarah.connor@calmclinic.org"
                        value={formData.email} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>System Role</label>
                    <select 
                        name="role" 
                        value={formData.role} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', background: 'white' }}
                    >
                        <option value="Therapist">Therapist</option>
                        <option value="Senior Therapist">Senior Therapist</option>
                        <option value="Admin">Admin</option>
                        <option value="Support Staff">Support Staff</option>
                    </select>
                </div>
            </div>

            {/* ROW 3: Professional Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>License Number</label>
                    <input 
                        type="text" name="license" 
                        placeholder="e.g. LMFT-12345"
                        value={formData.license} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Specialization</label>
                    <input 
                        type="text" name="specialization" 
                        placeholder="e.g. CBT, Trauma"
                        value={formData.specialization} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>
            </div>

            {/* BUTTONS */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                <button 
                    type="submit"
                    onMouseEnter={() => setSaveHover(true)} onMouseLeave={() => setSaveHover(false)}
                    style={{ 
                        background: saveHover ? '#354f42' : '#4a6b5d', color: 'white', border: 'none', 
                        padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px',
                        transition: 'all 0.2s'
                    }}
                >
                    Create Account
                </button>
                <button 
                    type="button" onClick={() => router.back()}
                    onMouseEnter={() => setCancelHover(true)} onMouseLeave={() => setCancelHover(false)}
                    style={{ 
                        background: cancelHover ? '#f5f5f5' : 'white', color: '#555', border: '1px solid #ccc', 
                        padding: '12px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px',
                        transition: 'all 0.2s'
                    }}
                >
                    Cancel
                </button>
            </div>

        </form>
      </div>
    </>
  );
}