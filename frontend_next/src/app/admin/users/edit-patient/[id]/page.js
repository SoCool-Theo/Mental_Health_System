'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../api'; // Adjusted path based on typical deep nesting

export default function EditPatientPage() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id;

  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  // --- DYNAMIC STATES ---
  const [adminUser, setAdminUser] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dob: '',
    plan: 'Standard Plan',
    assignedTherapist: '',
    status: 'Active'
  });

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return router.push('/login');

            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch Admin, Therapists, and Specific Patient Data
            const [meRes, therapistsRes, patientRes] = await Promise.all([
                api.get('users/me/', config),
                api.get('users/therapists/', config),
                api.get(`users/patients/${patientId}/`, config)
            ]);

            setAdminUser(meRes.data);
            setTherapists(therapistsRes.data.results || therapistsRes.data);

            const patientData = patientRes.data;

            // Map the backend data to our form fields
            setFormData({
                firstName: patientData.user?.first_name || patientData.first_name || '',
                lastName: patientData.user?.last_name || patientData.last_name || '',
                email: patientData.user?.email || patientData.email || '',
                dob: patientData.date_of_birth || '',
                plan: patientData.plan || 'Standard Plan',
                assignedTherapist: patientData.therapist?.id || patientData.therapist || '',
                status: patientData.status || 'Active'
            });

        } catch (error) {
            console.error("Failed to load patient data:", error);
            alert("Could not load patient details. They may have been deleted.");
            router.push('/admin/users');
        } finally {
            setLoadingData(false);
        }
    };

    if (patientId) {
        fetchData();
    }
  }, [patientId, router]);

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

        // Construct payload. Note: Adjust this based on how your backend expects nested user updates
        const updatePayload = {
            user: {
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email
            },
            date_of_birth: formData.dob,
            plan: formData.plan,
            therapist: formData.assignedTherapist || null, // Handle unassigned
            status: formData.status
        };

        await api.patch(`users/patients/${patientId}/`, updatePayload, config);

        alert("Patient updated successfully!");
        router.push('/admin/users');

    } catch (error) {
        console.error("Update failed:", error);
        alert("Failed to update patient. Please check your network or inputs.");
    } finally {
        setIsSubmitting(false);
    }
  };

  // --- 3. HANDLE ARCHIVE ---
  const handleArchive = async () => {
      if (!confirm("Are you sure you want to archive this patient? They will lose access to the system.")) return;

      try {
          const token = localStorage.getItem('access_token');
          const config = { headers: { Authorization: `Bearer ${token}` } };

          // Using PATCH to change status rather than hard DELETE is usually safer for medical records
          await api.patch(`users/patients/${patientId}/`, { status: 'Archived' }, config);

          alert("Patient archived successfully.");
          router.push('/admin/users');
      } catch (error) {
          console.error("Archive failed", error);
          alert("Failed to archive patient.");
      }
  };

  if (loadingData) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading patient profile...</div>;

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
      {/* --- PAGE HEADER --- */}
      <div className="header-card">
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '28px', color: '#354f42', margin: 0 }}>
          Edit Patient
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

      {/* --- FORM CONTENT --- */}
      <div className="content-card" style={{ marginTop: '24px', maxWidth: '800px' }}>

        <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', color: '#354f42', margin: '0 0 5px 0' }}>
                    Patient Profile
                </h3>
                <span style={{ fontSize: '13px', color: '#666' }}>Editing details for ID: <strong>PT-{patientId}</strong></span>
            </div>

            {/* Delete/Archive Button */}
            <button
                onClick={handleArchive}
                type="button"
                style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.background = '#fecaca'}
                onMouseOut={(e) => e.currentTarget.style.background = '#fee2e2'}
            >
                Archive Account
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

            {/* ROW 2: Email & DOB */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Email Address</label>
                    <input
                        type="email" name="email" required disabled
                        value={formData.email} onChange={handleChange}
                        title="Email cannot be changed directly"
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', background: '#f8fafc', color: '#94a3b8' }}
                    />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Date of Birth</label>
                    <input
                        type="date" name="dob"
                        value={formData.dob} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', color: '#555' }}
                    />
                </div>
            </div>

            {/* ROW 3: Account Settings */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', background: '#f9fafa', padding: '20px', borderRadius: '12px' }}>
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
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Assigned Therapist</label>
                    <select
                        name="assignedTherapist"
                        value={formData.assignedTherapist} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', background: 'white' }}
                    >
                        <option value="">-- Unassigned --</option>
                        {therapists.map(doc => (
                            <option key={doc.id} value={doc.id}>
                                Dr. {doc.user?.first_name} {doc.user?.last_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#444' }}>Account Status</label>
                    <select
                        name="status"
                        value={formData.status} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', background: 'white' }}
                    >
                        <option value="Active">Active</option>
                        <option value="Pending">Pending</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Archived">Archived</option>
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