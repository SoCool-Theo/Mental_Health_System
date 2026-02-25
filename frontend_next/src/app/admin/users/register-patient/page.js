'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../api';

export default function RegisterPatientPage() {
  const router = useRouter();

  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  const [adminUser, setAdminUser] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    dob: '',
    plan: 'Standard Plan',
    assignedTherapist: ''
  });

  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const token = localStorage.getItem('access_token');
              if (!token) return router.push('/login');

              const config = { headers: { Authorization: `Bearer ${token}` } };
              const [meRes, therapistsRes] = await Promise.all([
                  api.get('users/me/', config),
                  api.get('users/therapists/', config)
              ]);

              setAdminUser(meRes.data);
              setTherapists(therapistsRes.data.results || therapistsRes.data);

          } catch (error) {
              console.error("Failed to load data:", error);
          } finally {
              setLoadingData(false);
          }
      };
      fetchData();
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
        // --- THIS IS THE CRITICAL PART ---
        // These keys MUST exactly match the RegistrationSerializer
        const userPayload = {
            email: formData.email,
            firstName: formData.firstName, // Must be camelCase
            lastName: formData.lastName,   // Must be camelCase
            password: formData.password,
            role: "PATIENT",               // Must be ALL CAPS
            dob: formData.dob || null,
            plan: formData.plan,
            assignedTherapist: formData.assignedTherapist ? parseInt(formData.assignedTherapist) : null
        };

        // Note: Check your Network tab in Chrome Dev Tools if this fails again!
        await api.post('users/register/', userPayload);

        alert("Patient registered successfully!");
        router.push('/admin/users');

    } catch (error) {
        console.error("Registration failed:", error);

        // Let's make the error alert smarter so it tells you WHICH fields are failing
        if (error.response && error.response.data) {
            let errorMessage = "Registration Error:\n";
            for (const [field, messages] of Object.entries(error.response.data)) {
                errorMessage += `- ${field}: ${messages.join(' ')}\n`;
            }
            alert(errorMessage);
        } else {
            alert("Failed to register patient. Please check the network.");
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loadingData) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading form...</div>;

  // --- DYNAMIC PROFILE IMAGE HELPER ---
  const getAdminAvatar = () => {
      if (!adminUser?.profile_image) return "/medical-profile-default.png";

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      return adminUser.profile_image.startsWith('http')
          ? adminUser.profile_image
          : `${backendUrl}${adminUser.profile_image}`;
  };

  return (
    <>
      <div className="header-card">
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '28px', color: '#354f42', margin: 0 }}>
          Register Patient
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{adminUser?.display_name || 'Admin'}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Administrator</div>
          </div>
          <img
              src={getAdminAvatar()} // <-- USING THE DYNAMIC HELPER
              alt="Admin"
              style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', background: '#e2e8f0' }}
              onError={(e) => { e.target.src = '/medical-profile-default.png'; }}
          />
        </div>
      </div>

      <div className="content-card" style={{ marginTop: '24px', maxWidth: '800px' }}>

        <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', color: '#354f42', margin: '0 0 5px 0' }}>
                New Patient Intake
            </h3>
            <span style={{ fontSize: '13px', color: '#666' }}>Manually register a patient and set their initial login password.</span>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>First Name</label>
                    <input
                        type="text" name="firstName" required placeholder="e.g. John"
                        value={formData.firstName} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Last Name</label>
                    <input
                        type="text" name="lastName" required placeholder="e.g. Doe"
                        value={formData.lastName} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>
            </div>

            {/* EMAIL AND PASSWORD ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Personal Email</label>
                    <input
                        type="email" name="email" required placeholder="john.doe@email.com"
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f9fafa', padding: '20px', borderRadius: '12px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Date of Birth</label>
                    <input
                        type="date" name="dob" required
                        value={formData.dob} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', color: '#555' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Subscription Plan</label>
                    <select
                        name="plan" value={formData.plan} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', background: 'white' }}
                    >
                        <option value="Standard Plan">Standard Plan</option>
                        <option value="Premium Plan">Premium Plan</option>
                        <option value="Crisis Support">Crisis Support</option>
                        <option value="Pay-Per-Session">Pay-Per-Session</option>
                    </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Assign Therapist (Optional)</label>
                    <select
                        name="assignedTherapist" value={formData.assignedTherapist} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', background: 'white' }}
                    >
                        <option value="">-- Unassigned --</option>
                        {therapists.map(doc => (
                            <option key={doc.id} value={doc.id}>
                                Dr. {doc.user?.first_name} {doc.user?.last_name} ({doc.specialization || 'Therapist'})
                            </option>
                        ))}
                    </select>
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
                    {isSubmitting ? 'Registering...' : 'Register Patient'}
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