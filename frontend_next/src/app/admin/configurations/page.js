'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AppointmentTypesPage() {
  const router = useRouter();
  
  // State for button hover
  const [isHovered, setIsHovered] = useState(false);

  const [services] = useState([
    { id: 1, name: 'Consultation', duration: '30 mins', cost: '$50', status: 'Active' },
    { id: 2, name: 'CBT Therapy', duration: '60 mins', cost: '$100', status: 'Active' },
    { id: 3, name: 'Group Session', duration: '90 mins', cost: '$40', status: 'Inactive' },
  ]);

  return (
    <>
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', color: '#354f42', margin: 0 }}>
                Manage Appointment Types
            </h3>
            
            {/* + Add Button with Hover */}
            <button 
                onClick={() => router.push('/admin/configurations/add')} // Links to new page
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ 
                    background: isHovered ? '#354f42' : '#4a6b5d', // Darkens on hover
                    color: 'white', border: 'none', 
                    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                    transition: 'all 0.2s ease',
                    transform: isHovered ? 'translateY(-1px)' : 'none',
                    boxShadow: isHovered ? '0 4px 12px rgba(74, 107, 93, 0.3)' : 'none'
                }}
            >
                + Add New Type
            </button>
        </div>

        {/* Table Container */}
        <div style={{ border: '1px solid #4a6b5d', borderRadius: '12px', padding: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontWeight: 'bold', fontFamily: 'Times New Roman, serif' }}>Master Data</span>
                <span style={{ fontSize: '11px', background: '#eee', padding: '4px 8px', borderRadius: '4px', color: '#666' }}>
                    Changes apply globally
                </span>
            </div>

            {/* Table Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', fontSize: '12px', color: '#666', marginBottom: '10px', paddingLeft: '15px' }}>
                <span>Service Name</span>
                <span>Duration</span>
                <span>Cost</span>
                <span>Status</span>
                <span>Actions</span>
            </div>

            {/* Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {services.map(service => (
                    <div key={service.id} style={{ 
                        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', alignItems: 'center',
                        background: '#d4e0d9', padding: '12px 15px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#333'
                    }}>
                        <div>{service.name}</div>
                        <div>{service.duration}</div>
                        <div>{service.cost}</div>
                        <div>
                            <span style={{ background: service.status === 'Active' ? '#00c853' : '#ccc', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px' }}>
                                {service.status}
                            </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', display: 'flex', gap: '10px', cursor: 'pointer' }}>
                            {/* EDIT LINK - UPDATED */}
                            <span 
                                onClick={() => router.push(`/admin/configurations/edit/${service.id}`)} // Navigate to Edit Page
                                style={{ 
                                    textDecoration: 'underline', 
                                    color: '#4a6b5d', 
                                    fontWeight: 'bold',
                                    transition: 'color 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.color = '#2c4a3b'}
                                onMouseOut={(e) => e.target.style.color = '#4a6b5d'}
                            >
                                Edit
                            </span>

                            {/* Delete Icon */}
                            <span 
                                onClick={() => alert('Delete logic here')}
                                style={{ opacity: 0.7 }}
                                onMouseOver={(e) => e.target.style.opacity = 1}
                                onMouseOut={(e) => e.target.style.opacity = 0.7}
                            >
                                🗑️
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
  );
}