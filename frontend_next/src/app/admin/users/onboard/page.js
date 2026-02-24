'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../api';

export default function OnboardStaffPage() {
  const router = useRouter();

  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const [adminUser, setAdminUser] = useState(null);

  // --- ADDED PASSWORD TO FORM STATE ---
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Therapist',
    license: '',
    specialization: ''
  });

  const [showPass, setShowPass] = useState(false); // Toggle for eye icon

  useEffect(() => {
      const fetchAdminData = async () => {
          try {
              const token = localStorage.getItem('access_token');
              if (!token) return router.push('/login');

              const config = { headers: { Authorization: `Bearer ${token}` } };
              const res = await api.get('users/me/', config);

              setAdminUser(res.data);
          } catch (error) {
              console.error("Failed to load admin data:", error);
          } finally {
              setLoadingData(false);
          }
      };

      fetchAdminData();
  }, [router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
        return alert("Password must be at least 8 characters long.");
    }

    setIsSubmitting(true);

    try {
        const userPayload = {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
            role: "THERAPIST",
            licenseNo: formData.license || "PENDING",
            specialization: formData.specialization || "General"
        };

        await api.post('users/register/', userPayload);

        alert(`${formData.role} account created successfully!`);
        router.push('/admin/users');

    } catch (error) {
        console.error("Registration failed:", error);
        if (error.response && error.response.data) {
            const errorMsg = Object.values(error.response.data).flat().join('\n');
            alert(`Error: ${errorMsg}`);
        } else {
            alert("Failed to onboard staff. Please check the network.");
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loadingData) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading form...</div>;

  return (
    <>
      <div className="header-card">
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '28px', color: '#354f42', margin: 0 }}>
          Onboard Staff
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{adminUser?.display_name || 'Admin'}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Administrator</div>
          </div>
          <img
              src={adminUser?.profile_image ? `http://localhost:8000${adminUser.profile_image}` : "/medical-profile-default.png"}
              alt="Admin"
              style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', background: '#e2e8f0' }}
              onError={(e) => { e.target.src = '/medical-profile-default.png'; }}
          />
        </div>
      </div>

      <div className="content-card" style={{ marginTop: '24px', maxWidth: '800px' }}>

        <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', color: '#354f42', margin: '0 0 5px 0' }}>
                New Staff Profile
            </h3>
            <span style={{ fontSize: '13px', color: '#666' }}>Create a new account for a therapist or admin. Set a temporary password for them to log in.</span>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>First Name</label>
                    <input
                        type="text" name="firstName" required placeholder="e.g. Sarah"
                        value={formData.firstName} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Last Name</label>
                    <input
                        type="text" name="lastName" required placeholder="e.g. Connor"
                        value={formData.lastName} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>
            </div>

            {/* EMAIL AND PASSWORD ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Work Email</label>
                    <input
                        type="email" name="email" required placeholder="sarah.connor@calmclinic.org"
                        value={formData.email} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Initial Password</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPass ? "text" : "password"} name="password" required placeholder="••••••••"
                            value={formData.password} onChange={handleChange}
                            style={{ width: '100%', padding: '12px 40px 12px 12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                        />
                        <iconify-icon
                            icon={showPass ? "lucide:eye-off" : "lucide:eye"}
                            onClick={() => setShowPass(!showPass)}
                            style={{ position: 'absolute', right: '12px', top: '14px', cursor: 'pointer', color: '#888', fontSize: '18px' }}
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', background: '#f9fafa', padding: '20px', borderRadius: '12px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>System Role</label>
                    <select
                        name="role" value={formData.role} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', background: 'white' }}
                    >
                        <option value="Therapist">Therapist</option>
                        <option value="Senior Therapist">Senior Therapist</option>
                        <option value="Admin">Admin</option>
                        <option value="Support Staff">Support Staff</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>License Number</label>
                    <input
                        type="text" name="license" placeholder="e.g. LMFT-12345"
                        value={formData.license} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                        disabled={formData.role === 'Admin' || formData.role === 'Support Staff'}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Specialization</label>
                    <input
                        type="text" name="specialization" placeholder="e.g. CBT, Trauma"
                        value={formData.specialization} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                        disabled={formData.role === 'Admin' || formData.role === 'Support Staff'}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button
                    type="submit" disabled={isSubmitting}
                    onMouseEnter={() => setSaveHover(true)} onMouseLeave={() => setSaveHover(false)}
                    style={{
                        background: saveHover && !isSubmitting ? '#354f42' : '#4a6b5d', color: 'white', border: 'none',
                        padding: '12px 30px', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px',
                        transition: 'all 0.2s', opacity: isSubmitting ? 0.7 : 1
                    }}
                >
                    {isSubmitting ? 'Creating...' : 'Create Account'}
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