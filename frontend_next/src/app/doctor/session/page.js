'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Helper for the Round Control Buttons (Mic, Cam, etc.)
const ControlBtn = ({ icon, isActive, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <button 
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ 
        width: '55px', height: '55px', 
        borderRadius: '50%', 
        border: 'none', 
        background: isActive ? (hover ? '#e2e8f0' : '#f1f5f9') : '#fee2e2', // Red background if inactive/off
        cursor: 'pointer', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
        boxShadow: hover ? '0 4px 10px rgba(0,0,0,0.1)' : 'none',
        color: isActive ? '#334155' : '#b91c1c'
      }}
    >
      <iconify-icon icon={icon} style={{ fontSize: '24px' }}></iconify-icon>
    </button>
  );
};

// Helper for Quick Action Buttons (Already created previously)
const QuickActionBtn = ({ icon, label, isRisk }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        padding: '12px', 
        border: isRisk ? '1px solid #fee2e2' : '1px solid #e2e8f0', 
        background: isHovered ? (isRisk ? '#fef2f2' : '#f8fafc') : 'white', 
        borderRadius: '8px', 
        fontSize: '13px', 
        color: isRisk ? '#b91c1c' : '#475569', 
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)', 
        boxShadow: isHovered ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
      }}
    >
      <span>{icon}</span> {label}
    </button>
  );
};

export default function SessionModePage() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('notes'); 
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [endHover, setEndHover] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notes':
        return (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Private Clinical Notes (Auto-saved)</div>
              <textarea 
                  placeholder="Type notes here... (e.g., Patient reports improved sleep, mood stable...)"
                  style={{ 
                      flex: 1, resize: 'none', border: '1px solid #e2e8f0', borderRadius: '8px', 
                      padding: '15px', fontSize: '14px', outline: 'none', background: '#f8fafc',
                      fontFamily: 'sans-serif', lineHeight: '1.6', color: '#334155'
                  }}
              ></textarea>
          </div>
        );
      case 'history':
        return (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fadeIn 0.3s' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Past Sessions</div>
              <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#334155' }}>Oct 20, 2023</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>45 mins</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#475569' }}>Focus: Anxiety triggers at work. Introduced breathing techniques.</div>
              </div>
          </div>
        );
      case 'files':
        return (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fadeIn 0.3s' }}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '5px' }}>Shared Documents</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', background: '#fff' }}>
                  <span style={{ fontSize: '20px' }}>📄</span>
                  <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Intake_Form_Signed.pdf</div>
                  </div>
                  <span style={{ color: '#0f766e', fontSize: '18px' }}>⬇</span>
              </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', gap: '20px', padding: '20px' }}>
        
        {/* --- LEFT: VIDEO CALL AREA --- */}
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Jamie Lee</h2>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>00:12:45 • Weekly Check-in • GAD</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        🔴 REC
                    </span>
                    <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        Excellent Connection
                    </span>
                </div>
            </div>

            {/* Video Placeholder */}
            <div style={{ 
                flex: 1, background: '#1e293b', borderRadius: '16px', position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <span style={{ color: '#94a3b8', fontSize: '14px' }}>Patient Video Feed</span>
                <div style={{ 
                    position: 'absolute', bottom: '20px', right: '20px', 
                    width: '180px', height: '120px', background: '#334155', 
                    borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <span style={{ color: '#fff', fontSize: '10px' }}>You</span>
                </div>
            </div>

            {/* --- UPDATED CONTROLS BAR WITH ICONS --- */}
            <div style={{ 
                background: '#fff', padding: '15px', borderRadius: '12px', 
                display: 'flex', justifyContent: 'center', gap: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' 
            }}>
                {/* 1. Microphone */}
                <ControlBtn 
                    icon={micOn ? "lucide:mic" : "lucide:mic-off"} 
                    isActive={micOn} 
                    onClick={() => setMicOn(!micOn)} 
                />
                
                {/* 2. Camera */}
                <ControlBtn 
                    icon={camOn ? "lucide:video" : "lucide:video-off"} 
                    isActive={camOn} 
                    onClick={() => setCamOn(!camOn)} 
                />
                
                {/* 3. Screen Share */}
                <ControlBtn 
                    icon="lucide:monitor-up" 
                    isActive={true} 
                    onClick={() => {}} 
                />

                {/* 4. Chat */}
                <ControlBtn 
                    icon="lucide:message-square" 
                    isActive={true} 
                    onClick={() => {}} 
                />
                
                <div style={{ width: '1px', background: '#e2e8f0', margin: '0 10px' }}></div>

                {/* End Session Button */}
                <button 
                    onClick={() => router.back()} 
                    onMouseEnter={() => setEndHover(true)}
                    onMouseLeave={() => setEndHover(false)}
                    style={{ 
                        background: endHover ? '#b91c1c' : '#ef4444', color: 'white', 
                        padding: '0 25px', borderRadius: '30px', border: 'none', 
                        fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' 
                    }}
                >
                    End Session
                </button>
            </div>

        </div>

        {/* --- RIGHT: CLINICAL TOOLS --- */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', background: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
                {['notes', 'history', 'files'].map((tab) => (
                    <div 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{ 
                            padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s',
                            textTransform: 'capitalize',
                            color: activeTab === tab ? '#0f766e' : '#64748b',
                            borderBottom: activeTab === tab ? '2px solid #0f766e' : '2px solid transparent'
                        }}
                    >
                        {tab === 'notes' ? 'Session Notes' : tab}
                    </div>
                ))}
            </div>
            {renderTabContent()}
            <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '10px' }}>QUICK ACTIONS</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <QuickActionBtn icon="📅" label="Schedule Follow-up" />
                    <QuickActionBtn icon="💊" label="Prescribe Meds" />
                    <QuickActionBtn icon="📝" label="Send Homework" />
                    <QuickActionBtn icon="⚠️" label="Flag Risk" isRisk={true} />
                </div>
            </div>
        </div>

    </div>
  );
}