'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  
  // Hover State for "View All" link
  const [viewAllHover, setViewAllHover] = useState(false);

  // Static Data
  const logs = [
    { id: 1, event: 'Therapist A logged in', details: 'IP: 192.168.1.34', role: 'Therapist A', time: 'Today, 09:15', status: 'Success' },
    { id: 2, event: 'Failed login attempt', details: '3 attempts • IP: 172.16.0.5', role: 'Patient B', time: 'Today, 09:02', status: 'Warning' },
    { id: 3, event: 'New user created', details: 'Role: Therapist', role: 'Admin', time: 'Yesterday, 16:30', status: 'Info' },
    { id: 4, event: 'Password changed', details: 'Security policy enforced', role: 'Admin', time: 'Yesterday, 11:08', status: 'Success' },
    { id: 5, event: 'Blocked sign-in attempt', details: 'Geo: Outside clinic region', role: 'Unknown', time: 'Yesterday, 07:52', status: 'Blocked' },
  ];

  return (
    <>
      {/* --- TOP HEADER --- */}
      <div className="header-card">
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '28px', color: '#354f42', margin: 0 }}>
          Dashboard
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Adam Smith</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Admin</div>
          </div>
          <div style={{ width: '45px', height: '45px', background: '#354f42', borderRadius: '50%' }}></div>
        </div>
      </div>


      {/* --- DASHBOARD CONTENT --- */}
      <div className="dashboard-grid">
        
        {/* LEFT COLUMN: OPERATIONAL REPORT */}
        <div className="content-card" style={{ gap: '20px' }}>
          <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '22px', margin: 0, color: '#354f42' }}>
            Operational Report
          </h3>

          {/* 1. Line Chart Placeholder */}
          <div style={{ border: '1px solid #eee', borderRadius: '12px', padding: '15px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px' }}>Appointment This Week</h4>
            <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', gap: '10px', paddingBottom: '10px', borderBottom: '1px dashed #ccc' }}>
                <div style={{ width: '12%', height: '40%', background: '#dcfce7', borderRadius: '4px' }}></div>
                <div style={{ width: '12%', height: '60%', background: '#dcfce7', borderRadius: '4px' }}></div>
                <div style={{ width: '12%', height: '30%', background: '#dcfce7', borderRadius: '4px' }}></div>
                <div style={{ width: '12%', height: '80%', background: '#4a6b5d', borderRadius: '4px' }}></div>
                <div style={{ width: '12%', height: '50%', background: '#dcfce7', borderRadius: '4px' }}></div>
                <div style={{ width: '12%', height: '70%', background: '#dcfce7', borderRadius: '4px' }}></div>
                <div style={{ width: '12%', height: '90%', background: '#dcfce7', borderRadius: '4px' }}></div>
            </div>
            <div style={{ fontSize: '10px', color: '#888', marginTop: '5px', display: 'flex', justifyContent: 'space-between' }}>
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          {/* 2. Donut Chart Section */}
          <div style={{ border: '1px solid #eee', borderRadius: '12px', padding: '15px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ 
                  width: '100px', height: '100px', borderRadius: '50%', 
                  background: 'conic-gradient(#4a6b5d 0% 40%, #87b3a0 40% 70%, #ffaa99 70% 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                  <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '50%' }}></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '10px', height: '10px', background: '#4a6b5d', borderRadius: '50%' }}></span> CBT</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '10px', height: '10px', background: '#87b3a0', borderRadius: '50%' }}></span> Depression Support</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ width: '10px', height: '10px', background: '#ffaa99', borderRadius: '50%' }}></span> Trauma Informed</div>
              </div>
          </div>
        </div>


        {/* RIGHT COLUMN: RECENT SYSTEM ACTIVITY */}
        <div className="content-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
             <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '22px', margin: 0, color: '#354f42' }}>
                Recent System Activity
             </h3>
             <span style={{ fontSize: '12px', color: '#888' }}>Security Logs • Last 24 hours</span>
          </div>

          <div className="log-header">
              <span>Event</span>
              <span>User / Role</span>
              <span>Timestamp</span>
              <span style={{textAlign:'center'}}>Status</span>
          </div>

          <div style={{ flex: 1 }}>
            {logs.map(log => (
                <div key={log.id} className="log-row">
                    <div>
                        <div style={{ fontWeight: '600', color: '#333' }}>{log.event}</div>
                        <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{log.details}</div>
                    </div>
                    <div style={{ fontWeight: '500' }}>{log.role}</div>
                    <div>{log.time}</div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <span className={`badge ${
                            log.status === 'Success' ? 'badge-success' : 
                            log.status === 'Warning' ? 'badge-warning' : 
                            log.status === 'Blocked' ? 'badge-error' : 'badge-info'
                        }`}>
                            {log.status}
                        </span>
                    </div>
                </div>
            ))}
          </div>

          {/* --- VIEW ALL BUTTON --- */}
          <div 
            onClick={() => router.push('/admin/logs')} // Link to Logs Page
            onMouseEnter={() => setViewAllHover(true)}
            onMouseLeave={() => setViewAllHover(false)}
            style={{ 
                textAlign: 'right', marginTop: '15px', fontSize: '13px', 
                color: viewAllHover ? '#2c4a3b' : '#4a6b5d', 
                fontWeight: 'bold', cursor: 'pointer',
                transition: 'all 0.2s',
                textDecoration: viewAllHover ? 'underline' : 'none'
            }}
          >
             View all logs →
          </div>

        </div>

      </div>
    </>
  );
}