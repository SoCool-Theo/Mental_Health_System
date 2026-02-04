'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../api'; 

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. Fetch Patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) { router.push('/login'); return; }

        const response = await api.get('patients/', {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (Array.isArray(response.data)) setPatients(response.data);
        else if (response.data.results) setPatients(response.data.results);

      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, [router]);

  // 2. Filter Logic
  const filteredPatients = patients.filter(p => 
    (p.full_name || p.user_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}> 
        
        {/* 1. TOP SEARCH BAR (Floating Style) */}
        <div style={{ 
            background: 'white', 
            padding: '12px 20px', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
            <span style={{ fontSize: '18px', display:'flex', color:'#94a3b8' }}>🔍</span>
            <input 
                type="text" 
                placeholder="Search patients by name..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    width: '100%',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    color: '#334155'
                }}
            />
        </div>

        {/* 2. MAIN CARD */}
        <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            
            {/* Card Header Section */}
            <div style={{ padding: '24px', borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}>
                    Patient Directory
                </h2>
                <p style={{ fontSize: '14px', color: '#64748b' }}>
                    View and manage patients assigned to you.
                </p>
            </div>

            {/* Table Section */}
            {loading ? <p style={{padding:'30px', color:'#64748b'}}>Loading directory...</p> : (
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead>
                        <tr style={{textAlign: 'left', background: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
                            <th style={{padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform:'uppercase', letterSpacing:'0.5px'}}>Name</th>
                            <th style={{padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform:'uppercase', letterSpacing:'0.5px'}}>Status</th>
                            <th style={{padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform:'uppercase', letterSpacing:'0.5px'}}>Phone</th>
                            <th style={{padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform:'uppercase', letterSpacing:'0.5px', textAlign: 'right'}}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPatients.length === 0 ? (
                            <tr><td colSpan="4" style={{padding:'40px', textAlign:'center', color:'#94a3b8'}}>No patients found matching "{search}".</td></tr>
                        ) : (
                            filteredPatients.map(p => (
                                <tr key={p.id} style={{borderBottom: '1px solid #f1f5f9'}}>
                                    
                                    {/* Name Column */}
                                    <td style={{padding: '20px 24px', fontWeight: '600', color: '#334155', fontSize: '15px'}}>
                                        {p.full_name || p.user_name || "Unknown"}
                                    </td>

                                    {/* Status Column (Pill Style) */}
                                    <td style={{padding: '20px 24px'}}>
                                        <span style={{
                                            background: '#dcfce7', color: '#15803d', 
                                            padding: '6px 12px', borderRadius: '20px', 
                                            fontSize: '13px', fontWeight: '600',
                                            display: 'inline-block'
                                        }}>
                                            Active
                                        </span>
                                    </td>

                                    {/* Phone Column */}
                                    <td style={{padding: '20px 24px', color: '#64748b', fontSize: '14px'}}>
                                        {p.phone_number || "N/A"}
                                    </td>

                                    {/* Action Column */}
                                    <td style={{padding: '20px 24px', textAlign: 'right'}}>
                                        <Link href={`/doctor/patients/${p.id}`}>
                                            <button style={{
                                                background: '#0e7490', // A nice teal/blue
                                                color: 'white', 
                                                border: 'none', 
                                                padding: '8px 16px', 
                                                borderRadius: '6px', 
                                                cursor: 'pointer',
                                                fontSize: '13px', 
                                                fontWeight: '600',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseOver={(e) => e.target.style.background = '#155e75'}
                                            onMouseOut={(e) => e.target.style.background = '#0e7490'}
                                            >
                                                View Notes
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
        </div>
    </div>
  );
}