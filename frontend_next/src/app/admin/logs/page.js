'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LogsPage() {
  const router = useRouter();
  
  // 1. Search State
  const [searchTerm, setSearchTerm] = useState('');

  // Static Full Data
  const [logs] = useState([
    { id: 1, event: 'Therapist A logged in', details: 'IP: 192.168.1.34', role: 'Therapist A', time: 'Today, 09:15', status: 'Success' },
    { id: 2, event: 'Failed login attempt', details: '3 attempts • IP: 172.16.0.5', role: 'Patient B', time: 'Today, 09:02', status: 'Warning' },
    { id: 3, event: 'New user created', details: 'Role: Therapist', role: 'Admin', time: 'Yesterday, 16:30', status: 'Info' },
    { id: 4, event: 'Password changed', details: 'Security policy enforced', role: 'Admin', time: 'Yesterday, 11:08', status: 'Success' },
    { id: 5, event: 'Blocked sign-in attempt', details: 'Geo: Outside clinic region', role: 'Unknown', time: 'Yesterday, 07:52', status: 'Blocked' },
    { id: 6, event: 'Database Backup', details: 'Routine maintenance', role: 'System', time: 'Yesterday, 03:00', status: 'Info' },
    { id: 7, event: 'API Error', details: 'Timeout on /appointments', role: 'System', time: '2 days ago', status: 'Warning' },
    { id: 8, event: 'Patient Profile Updated', details: 'Updated insurance info', role: 'Patient C', time: '2 days ago', status: 'Success' },
    { id: 9, event: 'Role Permission Change', details: 'Granted Access: Admin', role: 'SuperUser', time: '3 days ago', status: 'Info' },
    { id: 10, event: 'Failed login attempt', details: 'IP: 10.0.0.55', role: 'Unknown', time: '3 days ago', status: 'Warning' },
  ]);

  // 2. Filter Logic
  const filteredLogs = logs.filter(log => 
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* --- PAGE HEADER --- */}
      <div className="header-card">
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '28px', color: '#354f42', margin: 0 }}>
          System Logs
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button 
             onClick={() => router.back()}
             style={{ 
                 padding: '8px 16px', borderRadius: '6px', border: '1px solid #4a6b5d', 
                 background: 'transparent', color: '#4a6b5d', cursor: 'pointer', fontWeight: 'bold' 
             }}
          >
             ← Back
          </button>
        </div>
      </div>

      {/* --- LOGS TABLE --- */}
      <div className="content-card" style={{ marginTop: '24px', minHeight: '600px' }}>
        
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', color: '#333', margin: 0 }}>Audit Trail & Security Events</h3>
            
            {/* 3. Search Input */}
            <input 
                type="text" 
                placeholder="🔍 Search logs..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                    padding: '10px 12px', borderRadius: '6px', border: '1px solid #ccc', 
                    width: '300px', fontSize: '14px', outline: 'none'
                }}
            />
        </div>

        {/* Table Header */}
        <div className="log-header" style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr' }}>
            <span>Event Description</span>
            <span>User / Role</span>
            <span>Timestamp</span>
            <span style={{textAlign:'center'}}>Status</span>
        </div>

        {/* Rows (Using filteredLogs) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            
            {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                    <div key={log.id} className="log-row" style={{ gridTemplateColumns: '2fr 1.5fr 1fr 1fr' }}>
                        <div>
                            <div style={{ fontWeight: '600', color: '#333' }}>{log.event}</div>
                            <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{log.details}</div>
                        </div>
                        <div style={{ fontWeight: '500' }}>{log.role}</div>
                        <div style={{ fontSize: '13px' }}>{log.time}</div>
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
                ))
            ) : (
                // 4. No Results State
                <div style={{ textAlign: 'center', padding: '40px', color: '#888', fontStyle: 'italic' }}>
                    No logs found matching "{searchTerm}"
                </div>
            )}

        </div>
        
        {/* Pagination Footer */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#666' }}>
            Showing {filteredLogs.length} of {logs.length} logs
        </div>

      </div>
    </>
  );
}