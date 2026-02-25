'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../api';

export default function EditTherapistPage() {
  const router = useRouter();
  const params = useParams();
  const therapistId = params.id;

  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  // --- DYNAMIC STATES ---
  const [adminUser, setAdminUser] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'Therapist',
    license: '',
    specialization: '',
    status: 'Active'
  });

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return router.push('/login');

            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch Admin and Specific Therapist Data
            const [meRes, therapistRes] = await Promise.all([
                api.get('users/me/', config),
                api.get(`users/therapists/${therapistId}/`, config)
            ]);

            setAdminUser(meRes.data);

            const docData = therapistRes.data;

            // Map the backend data to our form fields
            setFormData({
                firstName: docData.user?.first_name || docData.first_name || '',
                lastName: docData.user?.last_name || docData.last_name || '',
                email: docData.user?.email || docData.email || '',
                role: docData.role || 'Therapist', // Or derive from backend logic
                license: docData.license_number || docData.license || '',
                specialization: docData.specialization || '',
                status: docData.status || 'Active'
            });

        } catch (error) {
            console.error("Failed to load therapist data:", error);
            alert("Could not load therapist details. They may have been deleted.");
            router.push('/admin/users');
        } finally {
            setLoadingData(false);
        }
    };

    if (therapistId) {
        fetchData();
    }
  }, [therapistId, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 2. HANDLE UPDATE ---
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const token = localStorage.getItem('access_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Construct payload (Adjust to match your DRF Serializer requirements)
        const updatePayload = {
            user: {
                first_name: formData.firstName,
                last_name: formData.lastName,
            },
            license_number: formData.license,
            specialization: formData.specialization,
            status: formData.status
        };

        await api.patch(`users/therapists/${therapistId}/`, updatePayload, config);

        alert("Staff profile updated successfully!");
        router.push('/admin/users');

    } catch (error) {
        console.error("Update failed:", error);
        alert("Failed to update staff profile. Please check your network or inputs.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- 3. HANDLE SUSPEND / DEACTIVATE ---
  const handleDeactivate = async () => {
      if (!confirm("Are you sure you want to deactivate this staff member? They will not be able to log in or see patients.")) return;

      try {
          const token = localStorage.getItem('access_token');
          const config = { headers: { Authorization: `Bearer ${token}` } };

          await api.patch(`users/therapists/${therapistId}/`, { status: 'Inactive' }, config);

          alert("Staff member deactivated.");
          router.push('/admin/users');
      } catch (error) {
          console.error("Deactivation failed", error);
          alert("Failed to deactivate staff member.");
      }
  };

  if (loadingData) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading staff profile...</div>;

  return (
    <>
      {/* --- PAGE HEADER --- */}
      <div className="header-card">
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '28px', color: '#354f42', margin: 0 }}>
          Edit Staff Profile
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{adminUser?.display_name || 'Admin'}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Administrator</div>
          </div>
          <img
              src={adminUser?.profile_image ? `http://100.112.34:8000${adminUser.profile_image}` : "/medical-profile-default.png"}
              alt="Admin"
              style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', background: '#e2e8f0' }}
              onError={(e) => { e.target.src = '/medical-profile-default.png'; }}
          />
        </div>
      </div>

      {/* --- FORM CONTENT --- */}
      <div className="content-card" style={{ marginTop: '24px', maxWidth: '800px' }}>

        <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', color: '#354f42', margin: '0 0 5px 0' }}>
                    Staff Settings
                </h3>
                <span style={{ fontSize: '13px', color: '#666' }}>Editing details for ID: <strong>TH-{therapistId}</strong></span>
            </div>

            {/* Deactivate Button */}
            <button
                onClick={handleDeactivate}
                type="button"
                style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#fecaca'}
                onMouseOut={(e) => e.currentTarget.style.background = '#fee2e2'}
            >
                Deactivate Account
            </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* ROW 1: Names */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>First Name</label>
                    <input
                        type="text" name="firstName" required
                        value={formData.firstName} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Last Name</label>
                    <input
                        type="text" name="lastName" required
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
                        type="email" name="email" required disabled
                        value={formData.email} onChange={handleChange}
                        title="Email cannot be changed directly"
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', background: '#f8fafc', color: '#94a3b8' }}
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
                    </select>
                </div>
            </div>

            {/* ROW 3: Professional Details & Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', background: '#f9fafa', padding: '20px', borderRadius: '12px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>License Number</label>
                    <input
                        type="text" name="license"
                        value={formData.license} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Specialization</label>
                    <input
                        type="text" name="specialization"
                        value={formData.specialization} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Account Status</label>
                    <select
                        name="status"
                        value={formData.status} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', background: 'white' }}
                    >
                        <option value="Active">Active</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* BUTTONS */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    onMouseEnter={() => setSaveHover(true)} onMouseLeave={() => setSaveHover(false)}
                    style={{
                        background: saveHover && !isSubmitting ? '#354f42' : '#4a6b5d', color: 'white', border: 'none',
                        padding: '12px 30px', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px',
                        transition: 'all 0.2s', opacity: isSubmitting ? 0.7 : 1
                    }}
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
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