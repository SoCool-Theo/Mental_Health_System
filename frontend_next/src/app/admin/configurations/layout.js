'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ConfigurationsLayout({ children }) {
  const pathname = usePathname();

  // Helper to check active state
  const isActive = (path) => pathname === path;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      
      {/* --- SHARED HEADER --- */}
      <div className="header-card">
        <h2 style={{ fontFamily: 'Times New Roman, serif', fontSize: '28px', color: '#354f42', margin: 0 }}>
          Configurations
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Adam Smith</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Admin</div>
          </div>
          <div style={{ width: '45px', height: '45px', background: '#354f42', borderRadius: '50%' }}></div>
        </div>
      </div>

      {/* --- SPLIT CONTENT --- */}
      <div style={{ display: 'flex', gap: '24px', flex: 1, alignItems: 'flex-start' }}>
        
        {/* --- SHARED SUB-MENU (Left Column) --- */}
        <div className="content-card" style={{ width: '280px', padding: '24px 16px' }}>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '20px', color: '#354f42', margin: '0 0 20px 8px' }}>
                Clinic Configurations
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', color: '#555' }}>
                
                <div style={{ padding: '10px 15px', cursor: 'pointer', opacity: 0.6 }}>General Settings</div>
                
                {/* Appointment Types Link */}
                <Link href="/admin/configurations" style={{ textDecoration: 'none' }}>
                    <div style={{ 
                        padding: '10px 15px', cursor: 'pointer', borderRadius: '30px', 
                        display: 'flex', justifyContent: 'space-between', transition: 'all 0.2s',
                        // Active Styles
                        border: isActive('/admin/configurations') ? '1px solid #4a6b5d' : '1px solid transparent',
                        color: isActive('/admin/configurations') ? '#4a6b5d' : '#555',
                        fontWeight: isActive('/admin/configurations') ? 'bold' : 'normal',
                        background: isActive('/admin/configurations') ? 'rgba(74, 107, 93, 0.05)' : 'transparent'
                    }}>
                        Appointment Types {isActive('/admin/configurations') && <span>›</span>}
                    </div>
                </Link>

                {/* Locations Link */}
                <Link href="/admin/configurations/locations" style={{ textDecoration: 'none' }}>
                    <div style={{ 
                        padding: '10px 15px', cursor: 'pointer', borderRadius: '30px', 
                        display: 'flex', justifyContent: 'space-between', transition: 'all 0.2s',
                        // Active Styles
                        border: isActive('/admin/configurations/locations') ? '1px solid #4a6b5d' : '1px solid transparent',
                        color: isActive('/admin/configurations/locations') ? '#4a6b5d' : '#555',
                        fontWeight: isActive('/admin/configurations/locations') ? 'bold' : 'normal',
                        background: isActive('/admin/configurations/locations') ? 'rgba(74, 107, 93, 0.05)' : 'transparent'
                    }}>
                        Locations {isActive('/admin/configurations/locations') && <span>›</span>}
                    </div>
                </Link>
                

                {/* Operating Hours Link */}
                <Link href="/admin/configurations/operating-hours" style={{ textDecoration: 'none' }}>
                    <div style={{ 
                        padding: '10px 15px', cursor: 'pointer', borderRadius: '30px', 
                        display: 'flex', justifyContent: 'space-between', transition: 'all 0.2s',
                        // Active Styles
                        border: isActive('/admin/configurations/operating-hours') ? '1px solid #4a6b5d' : '1px solid transparent',
                        color: isActive('/admin/configurations/operating-hours') ? '#4a6b5d' : '#555',
                        fontWeight: isActive('/admin/configurations/operating-hours') ? 'bold' : 'normal',
                        background: isActive('/admin/configurations/operating-hours') ? 'rgba(74, 107, 93, 0.05)' : 'transparent'
                    }}>
                        Operating Hours {isActive('/admin/configurations/operating-hours') && <span>›</span>}
                    </div>
                </Link>
            </div>
        </div>

        {/* --- DYNAMIC RIGHT CONTENT --- */}
        <div className="content-card" style={{ flex: 1, minHeight: '600px' }}>
            {children}
        </div>

      </div>
    </div>
  );
}