'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const router = useRouter();

  // State
  const [activeTab, setActiveTab] = useState('therapists'); // 'therapists' or 'patients'
  const [isHovered, setIsHovered] = useState(false);

  // --- DATA: THERAPISTS ---
  const therapists = [
    { id: 'TH-1023', name: 'Alex Lee', role: 'Senior Therapist', email: 'alex.lee@calmclinic.org', status: 'Active', activity: 'Today · 09:42' },
    { id: 'TH-1008', name: 'Riya Mehta', role: 'Child Specialist', email: 'riya.mehta@calmclinic.org', status: 'Active', activity: 'Today · 08:17' },
    { id: 'TH-0994', name: 'Jordan Blake', role: 'Family Therapy', email: 'jordan.blake@calmclinic.org', status: 'Locked', activity: 'Yesterday · 21:12' },
  ];

  // --- DATA: PATIENTS (Different Fields) ---
  const patients = [
    { id: 'PT-4401', name: 'John Doe', plan: 'Standard Plan', therapist: 'Alex Lee', status: 'Active', nextAppt: 'Tomorrow, 10:00 AM' },
    { id: 'PT-4405', name: 'Jane Smith', plan: 'Premium Plan', therapist: 'Riya Mehta', status: 'Active', nextAppt: 'Feb 12, 02:00 PM' },
    { id: 'PT-4408', name: 'Michael Brown', plan: 'Standard Plan', therapist: 'Unassigned', status: 'Pending', nextAppt: 'No appointment' },
    { id: 'PT-4412', name: 'Emily Davis', plan: 'Crisis Support', therapist: 'Jordan Blake', status: 'Inactive', nextAppt: 'Account Paused' },
  ];

  return (
    <>
      {/* --- TOP HEADER --- */}
      <div className="header-card">
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '28px', color: '#354f42', margin: 0 }}>
          User Management
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Adam Smith</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Admin</div>
          </div>
          <div style={{ width: '45px', height: '45px', background: '#354f42', borderRadius: '50%' }}></div>
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
            {activeTab === 'therapists' && therapists.map(user => (
                <div key={user.id} className="log-row" style={{ gridTemplateColumns: '2.5fr 1.5fr 2fr 1fr 2fr 1fr' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#4a6b5d' }}>
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                            <div style={{ fontSize: '11px', color: '#666' }}>{user.id}</div>
                        </div>
                    </div>
                    <div><span style={{ background: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', border: '1px solid #fff' }}>{user.role}</span></div>
                    <div style={{ fontWeight: '600' }}>{user.email}</div>
                    <div><span className={`badge ${user.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{user.status}</span></div>
                    <div style={{ color: '#666', fontSize: '12px' }}>{user.activity}</div>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button style={{ background: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}>⋮</button>
                    </div>
                </div>
            ))}

            {/* PATIENT ROWS */}
            {activeTab === 'patients' && patients.map(user => (
                <div key={user.id} className="log-row" style={{ gridTemplateColumns: '2.5fr 1.5fr 2fr 1fr 2fr 1fr' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', background: '#e0f7fa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#006064' }}>
                            {user.name.charAt(0)}
                        </div>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                            <div style={{ fontSize: '11px', color: '#666' }}>{user.id}</div>
                        </div>
                    </div>
                    {/* Plan Badge */}
                    <div>
                        <span style={{ 
                            background: user.plan.includes('Premium') ? '#f3e8ff' : '#f0f4f8', 
                            color: user.plan.includes('Premium') ? '#6b21a8' : '#334155',
                            padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' 
                        }}>
                            {user.plan}
                        </span>
                    </div>
                    
                    {/* Assigned Therapist */}
                    <div style={{ fontSize: '13px' }}>
                        {user.therapist !== 'Unassigned' ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ width: '6px', height: '6px', background: '#4a6b5d', borderRadius: '50%' }}></span>
                                {user.therapist}
                            </span>
                        ) : (
                            <span style={{ color: '#999', fontStyle: 'italic' }}>Unassigned</span>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <span className={`badge ${
                            user.status === 'Active' ? 'badge-success' : 
                            user.status === 'Pending' ? 'badge-warning' : 'badge-error'
                        }`}>
                            {user.status}
                        </span>
                    </div>

                    {/* Next Appointment */}
                    <div style={{ color: '#555', fontSize: '12px', fontWeight: '500' }}>{user.nextAppt}</div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {/* EDIT BUTTON - NOW LINKED */}
                        <button 
                            onClick={() => router.push(`/admin/users/edit-patient/${user.id}`)} // Navigate to Edit Page
                            style={{ 
                                background: 'white', border: 'none', borderRadius: '50%', 
                                width: '24px', height: '24px', cursor: 'pointer', color: '#555',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#f0f0f0'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                        >
                            ✎
                        </button>
                        <button style={{ background: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', color: '#555' }}>⋮</button>
                    </div>
                </div>
            ))}

        </div>

      </div>
    </>
  );
}