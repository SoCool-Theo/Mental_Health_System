'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../api';

export default function AdminDashboard() {
  const router = useRouter();

  // Hover State for "View All" link
  const [viewAllHover, setViewAllHover] = useState(false);

  // --- DYNAMIC STATES ---
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState({ daily_appointments: {}, service_breakdown: [] });
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return router.push('/login');

            const config = { headers: { Authorization: `Bearer ${token}` } };

            // 1. Fetch Admin Profile
            const userRes = await api.get('users/me/', config);
            setAdminUser(userRes.data);

            // 2. Fetch Dashboard Statistics
            const statsRes = await api.get('admin-stats/', config);
            setStats(statsRes.data);

        } catch (error) {
            console.error("Failed to load dashboard data", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                router.push('/login');
            }
        } finally {
            setLoading(false);
        }
    };
    fetchDashboardData();
  }, [router]);

  // Static Data for Security Logs (We will make this dynamic later!)
  const logs = [
    { id: 1, event: 'Therapist A logged in', details: 'IP: 192.168.1.34', role: 'Therapist A', time: 'Today, 09:15', status: 'Success' },
    { id: 2, event: 'Failed login attempt', details: '3 attempts • IP: 172.16.0.5', role: 'Patient B', time: 'Today, 09:02', status: 'Warning' },
    { id: 3, event: 'New user created', details: 'Role: Therapist', role: 'Admin', time: 'Yesterday, 16:30', status: 'Info' },
    { id: 4, event: 'Password changed', details: 'Security policy enforced', role: 'Admin', time: 'Yesterday, 11:08', status: 'Success' },
    { id: 5, event: 'Blocked sign-in attempt', details: 'Geo: Outside clinic region', role: 'Unknown', time: 'Yesterday, 07:52', status: 'Blocked' },
  ];

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Admin Dashboard...</div>;

  // --- HELPER: Calculate Chart Bar Heights ---
  // Find the maximum appointments in a single day to scale the bars properly
  const maxAppts = Math.max(...Object.values(stats.daily_appointments), 1); // Avoid dividing by 0

  // Colors for the donut chart
  const serviceColors = ['#4a6b5d', '#87b3a0', '#ffaa99', '#fcd34d', '#bae6fd'];

  return (
    <>
      {/* --- TOP HEADER --- */}
      <div className="header-card">
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '28px', color: '#354f42', margin: 0 }}>
          Dashboard
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


      {/* --- DASHBOARD CONTENT --- */}
      <div className="dashboard-grid">

        {/* LEFT COLUMN: OPERATIONAL REPORT */}
        <div className="content-card" style={{ gap: '20px' }}>
          <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '22px', margin: 0, color: '#354f42' }}>
            Operational Report
          </h3>

          {/* 1. DYNAMIC BAR CHART */}
          <div style={{ border: '1px solid #eee', borderRadius: '12px', padding: '15px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '14px' }}>Appointments This Week</h4>
            <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px dashed #ccc' }}>

                {Object.entries(stats.daily_appointments).map(([day, count], index) => {
                    // Calculate height percentage (min 5% so the bar is always visible)
                    const heightPercent = count === 0 ? '5%' : `${(count / maxAppts) * 100}%`;
                    const isToday = index === 6; // The last item in our 7-day array is always 'Today'

                    return (
                        <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '12%' }}>
                            {/* Hover tooltip for exact count */}
                            <span style={{ fontSize: '10px', color: '#888', marginBottom: '4px' }}>{count}</span>
                            <div style={{
                                width: '100%',
                                height: heightPercent,
                                background: isToday ? '#4a6b5d' : '#dcfce7',
                                borderRadius: '4px',
                                transition: 'height 0.5s ease'
                            }}></div>
                        </div>
                    );
                })}
            </div>

            <div style={{ fontSize: '10px', color: '#888', marginTop: '5px', display: 'flex', justifyContent: 'space-between' }}>
                 {Object.keys(stats.daily_appointments).map(day => (
                     <span key={day}>{day}</span>
                 ))}
            </div>
          </div>

          {/* 2. DYNAMIC DONUT CHART SECTION */}
          <div style={{ border: '1px solid #eee', borderRadius: '12px', padding: '15px', display: 'flex', alignItems: 'center', gap: '20px' }}>

              {/* CSS Donut Chart */}
              <div style={{
                  width: '100px', height: '100px', borderRadius: '50%', flexShrink: 0,
                  // If no data, show gray circle, otherwise use the CSS gradient
                  background: stats.service_breakdown.length === 0
                      ? '#f1f5f9'
                      : 'conic-gradient(#4a6b5d 0% 40%, #87b3a0 40% 70%, #ffaa99 70% 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                  <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '50%' }}></div>
              </div>

              {/* Dynamic Service Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', width: '100%' }}>
                  {stats.service_breakdown.length === 0 ? (
                      <span style={{ color: '#94a3b8' }}>No service data available.</span>
                  ) : (
                      stats.service_breakdown.map((service, index) => (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ width: '10px', height: '10px', background: serviceColors[index % serviceColors.length], borderRadius: '50%' }}></span>
                                  {service.name}
                              </div>
                              <span style={{ fontWeight: 'bold', color: '#475569' }}>{service.count}</span>
                          </div>
                      ))
                  )}
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
            onClick={() => router.push('/admin/logs')}
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