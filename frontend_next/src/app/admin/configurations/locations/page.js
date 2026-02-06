'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LocationsPage() {
  const router = useRouter();
  
  // State for hover effect
  const [isHovered, setIsHovered] = useState(false);

  const [locations] = useState([
    { id: 1, name: 'Main Clinic (Bangkok)', address: 'No.21 Main St.', rooms: 5, status: 'Open' },
    { id: 2, name: 'North Branch', address: '455 Mountain Rd.', rooms: 3, status: 'Maintenance' },
  ]);

  return (
    <>
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', color: '#354f42', margin: 0 }}>
                Manage Locations
            </h3>
            
            {/* + Add Location Button with Hover */}
            <button 
                onClick={() => router.push('/admin/configurations/locations/add')} // LINKS TO NEW PAGE
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ 
                    background: isHovered ? '#354f42' : '#4a6b5d', // Darker green on hover
                    color: 'white', border: 'none', 
                    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                    transition: 'background 0.2s ease',
                    boxShadow: isHovered ? '0 4px 12px rgba(74, 107, 93, 0.3)' : 'none'
                }}
            >
                + Add Location
            </button>
        </div>

        {/* Table */}
        <div style={{ border: '1px solid #4a6b5d', borderRadius: '12px', padding: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontWeight: 'bold', fontFamily: 'Times New Roman, serif' }}>Clinic Sites</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', fontSize: '12px', color: '#666', marginBottom: '10px', paddingLeft: '15px' }}>
                <span>Location Name</span>
                <span>Address</span>
                <span>Rooms</span>
                <span>Status</span>
                <span>Actions</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {locations.map(loc => (
                    <div key={loc.id} style={{ 
                        display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', alignItems: 'center',
                        background: '#fcfdfc', border: '1px solid #eee', padding: '12px 15px', borderRadius: '8px', fontSize: '14px', color: '#333'
                    }}>
                        <div style={{ fontWeight: '600' }}>{loc.name}</div>
                        <div style={{ fontSize: '13px', color: '#555' }}>{loc.address}</div>
                        <div>{loc.rooms}</div>
                        <div>
                            <span style={{ 
                                background: loc.status === 'Open' ? '#dcfce7' : '#fee2e2', 
                                color: loc.status === 'Open' ? '#166534' : '#991b1b',
                                padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold'
                            }}>
                                {loc.status}
                            </span>
                        </div>
                        <div style={{ fontSize: '16px', cursor: 'pointer' }}>⚙️</div>
                    </div>
                ))}
            </div>
        </div>
    </>
  );
}