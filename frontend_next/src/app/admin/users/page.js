'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../api'; // Adjusted path based on your folder structure

export default function UsersPage() {
  const router = useRouter();

  // --- DYNAMIC STATES ---
  const [activeTab, setActiveTab] = useState('therapists'); // 'therapists' or 'patients'
  const [isHovered, setIsHovered] = useState(false);

  const [adminUser, setAdminUser] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
      const fetchUsersData = async () => {
          try {
              const token = localStorage.getItem('access_token');
              if (!token) return router.push('/login');

              const config = { headers: { Authorization: `Bearer ${token}` } };

              // Fetch Admin info, Therapists, and Patients all at once
              const [meRes, therapistsRes, patientsRes] = await Promise.all([
                  api.get('users/me/', config),
                  api.get('users/therapists/', config),
                  api.get('users/patients/', config)
              ]);

              setAdminUser(meRes.data);
              setTherapists(therapistsRes.data.results || therapistsRes.data);
              setPatients(patientsRes.data.results || patientsRes.data);

          } catch (error) {
              console.error("Failed to load user data:", error);
              if (error.response?.status === 401 || error.response?.status === 403) {
                  router.push('/login');
              }
          } finally {
              setLoading(false);
          }
      };

      fetchUsersData();
  }, [router]);

  // --- HELPER TO COLOR-CODE STATUS BADGES ---
  const getStatusBadgeClass = (status) => {
      const s = (status || '').toLowerCase();
      if (s === 'active') return 'badge-success'; // Green
      if (s === 'pending' || s === 'on leave') return 'badge-warning'; // Yellow/Orange
      if (s === 'inactive' || s === 'archived' || s === 'locked') return 'badge-error'; // Red
      return 'badge-info'; // Gray/Blue fallback
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>Loading User Directory...</div>;

  return (
    <>
      {/* --- TOP HEADER --- */}
      <div className="header-card">
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '28px', color: '#354f42', margin: 0 }}>
          User Management
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


      {/* --- MAIN CONTENT --- */}
      <div className="content-card" style={{ marginTop: '24px', minHeight: '600px' }}>

        {/* Title & Dynamic Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', color: '#354f42', margin: 0 }}>
                {activeTab === 'therapists' ? 'Staff Directory' : 'Patient Records'}
            </h3>

            <button
                onClick={() => router.push(activeTab === 'therapists' ? '/admin/users/onboard' : '/admin/users/register-patient')}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    background: isHovered ? '#354f42' : '#4a6b5d',
                    color: 'white', border: 'none',
                    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                    transition: 'all 0.2s ease', boxShadow: isHovered ? '0 4px 12px rgba(74, 107, 93, 0.3)' : 'none'
                }}
            >
                {activeTab === 'therapists' ? '+ Onboard New Staff' : '+ Register Patient'}
            </button>

        </div>

        {/* Custom Tabs */}
        <div style={{ marginBottom: '25px', display: 'flex', gap: '5px', background: '#f5f7f6', width: 'fit-content', padding: '4px', borderRadius: '30px' }}>
            {['therapists', 'patients'].map((tab) => (
                <div
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                        padding: '8px 25px', borderRadius: '25px', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                        background: activeTab === tab ? 'white' : 'transparent',
                        color: activeTab === tab ? '#354f42' : '#888',
                        boxShadow: activeTab === tab ? '0 2px 5px rgba(0,0,0,0.05)' : 'none',
                        border: activeTab === tab ? '1px solid #ddd' : '1px solid transparent',
                        textTransform: 'capitalize', transition: 'all 0.2s'
                    }}
                >
                    {tab}
                </div>
            ))}
        </div>

        {/* --- DYNAMIC TABLE HEADER --- */}
        <div style={{
            display: 'grid',
            gridTemplateColumns: activeTab === 'therapists' ? '2.5fr 1.5fr 2fr 1fr 2fr 1fr' : '2.5fr 1.5fr 2fr 1fr 2fr 1fr',
            fontSize: '11px', color: '#888', marginBottom: '10px', padding: '0 15px', fontWeight: 'bold'
        }}>
            <span>User / ID</span>
            <span>{activeTab === 'therapists' ? 'Role' : 'Plan Type'}</span>
            <span>{activeTab === 'therapists' ? 'Email' : 'Assigned Therapist'}</span>
            <span>Status</span>
            <span>{activeTab === 'therapists' ? 'Last Activity' : 'Next Appointment'}</span>
            <span style={{ textAlign: 'right' }}>Actions</span>
        </div>

        {/* --- DYNAMIC ROWS --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* THERAPIST ROWS */}
            {activeTab === 'therapists' && therapists.length === 0 && <div style={{padding: '20px', color: '#999'}}>No therapists found.</div>}
            {activeTab === 'therapists' && therapists.map(doc => {
                const fullName = `${doc.user?.first_name || ''} ${doc.user?.last_name || ''}`.trim() || doc.user?.username;
                const docStatus = doc.status || 'Active'; // Default to active if missing

                return (
                    <div key={doc.id} className="log-row" style={{ gridTemplateColumns: '2.5fr 1.5fr 2fr 1fr 2fr 1fr' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#4a6b5d' }}>
                                {fullName?.charAt(0).toUpperCase() || 'D'}
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{fullName}</div>
                                <div style={{ fontSize: '11px', color: '#666' }}>TH-{doc.id}</div>
                            </div>
                        </div>
                        <div><span style={{ background: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', border: '1px solid #fff' }}>{doc.specialization || 'Therapist'}</span></div>
                        <div style={{ fontWeight: '600', fontSize: '13px' }}>{doc.user?.email || 'N/A'}</div>

                        {/* DYNAMIC THERAPIST STATUS */}
                        <div>
                            <span className={`badge ${getStatusBadgeClass(docStatus)}`}>
                                {docStatus}
                            </span>
                        </div>

                        <div style={{ color: '#666', fontSize: '12px' }}>--</div> {/* Placeholder for activity logs */}
                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            {/* EDIT BUTTON FOR THERAPIST */}
                            <button
                                onClick={() => router.push(`/admin/users/edit-therapist/${doc.id}`)}
                                style={{
                                    background: 'white', border: 'none', borderRadius: '50%',
                                    width: '24px', height: '24px', cursor: 'pointer', color: '#555',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#f0f0f0'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                title="Edit Therapist"
                            >
                                ✎
                            </button>
                        </div>
                    </div>
                );
            })}

            {/* PATIENT ROWS */}
            {activeTab === 'patients' && patients.length === 0 && <div style={{padding: '20px', color: '#999'}}>No patients found.</div>}
            {activeTab === 'patients' && patients.map(patient => {
                const fullName = patient.full_name ||
                                 patient.user_name ||
                                 `${patient.user?.first_name || ''} ${patient.user?.last_name || ''}`.trim() ||
                                 patient.user?.username ||
                                 'Unknown Patient';

                const patStatus = patient.status || 'Active'; // Default to active if missing

                return (
                    <div key={patient.id} className="log-row" style={{ gridTemplateColumns: '2.5fr 1.5fr 2fr 1fr 2fr 1fr' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', background: '#e0f7fa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#006064' }}>
                                {fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{fullName}</div>
                                <div style={{ fontSize: '11px', color: '#666' }}>PT-{patient.id}</div>
                            </div>
                        </div>

                        {/* Plan Badge (Placeholder) */}
                        <div>
                            <span style={{ background: '#f0f4f8', color: '#334155', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                                Standard Plan
                            </span>
                        </div>

                        {/* Assigned Therapist (Placeholder) */}
                        <div style={{ fontSize: '13px' }}>
                            <span style={{ color: '#999', fontStyle: 'italic' }}>View profile</span>
                        </div>

                        {/* DYNAMIC PATIENT STATUS */}
                        <div>
                            <span className={`badge ${getStatusBadgeClass(patStatus)}`}>
                                {patStatus}
                            </span>
                        </div>

                        {/* Next Appointment (Placeholder) */}
                        <div style={{ color: '#555', fontSize: '12px', fontWeight: '500' }}>--</div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            {/* EDIT BUTTON */}
                            <button
                                onClick={() => router.push(`/admin/users/edit-patient/${patient.id}`)}
                                style={{
                                    background: 'white', border: 'none', borderRadius: '50%',
                                    width: '24px', height: '24px', cursor: 'pointer', color: '#555',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#f0f0f0'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                title="Edit Patient"
                            >
                                ✎
                            </button>
                        </div>
                    </div>
                );
            })}

        </div>

      </div>
    </>
  );
}