'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPatientPage() {
  const router = useRouter();
  
  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    plan: 'Standard Plan',
    assignedTherapist: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Registering Patient:", formData);
    // Add API call here
    router.push('/admin/users');
  };

  return (
    <>
      {/* --- PAGE HEADER --- */}
      <div className="header-card">
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '28px', color: '#354f42', margin: 0 }}>
          Register Patient
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
                New Patient Intake
            </h3>
            <span style={{ fontSize: '13px', color: '#666' }}>Manually register a patient. They will receive an email to set their password.</span>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* ROW 1: Names */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>First Name</label>
                    <input 
                        type="text" name="firstName" required
                        placeholder="e.g. John"
                        value={formData.firstName} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Last Name</label>
                    <input 
                        type="text" name="lastName" required
                        placeholder="e.g. Doe"
                        value={formData.lastName} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>
            </div>

            {/* ROW 2: Email & DOB */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Personal Email</label>
                    <input 
                        type="email" name="email" required
                        placeholder="john.doe@email.com"
                        value={formData.email} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Date of Birth</label>
                    <input 
                        type="date" name="dob" required
                        value={formData.dob} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', color: '#555' }}
                    />
                </div>
            </div>

            {/* ROW 3: Plan & Assignment */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f9fafa', padding: '20px', borderRadius: '12px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Subscription Plan</label>
                    <select 
                        name="plan" 
                        value={formData.plan} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', background: 'white' }}
                    >
                        <option value="Standard Plan">Standard Plan</option>
                        <option value="Premium Plan">Premium Plan</option>
                        <option value="Crisis Support">Crisis Support</option>
                        <option value="Pay-Per-Session">Pay-Per-Session</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Assign Therapist (Optional)</label>
                    <select 
                        name="assignedTherapist" 
                        value={formData.assignedTherapist} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', background: 'white' }}
                    >
                        <option value="">-- Unassigned --</option>
                        <option value="1">Alex Lee (Senior)</option>
                        <option value="2">Riya Mehta (Child Specialist)</option>
                        <option value="3">Jordan Blake (Family)</option>
                    </select>
                </div>
            </div>

            {/* BUTTONS */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button 
                    type="submit"
                    onMouseEnter={() => setSaveHover(true)} onMouseLeave={() => setSaveHover(false)}
                    style={{ 
                        background: saveHover ? '#354f42' : '#4a6b5d', color: 'white', border: 'none', 
                        padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px',
                        transition: 'all 0.2s'
                    }}
                >
                    Register Patient
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