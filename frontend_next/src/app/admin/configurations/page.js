'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../api';

export default function AppointmentTypesPage() {
  const router = useRouter();

  const [isHovered, setIsHovered] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchServices = async () => {
          try {
              const token = localStorage.getItem('access_token');
              if (!token) return router.push('/login');

              const config = { headers: { Authorization: `Bearer ${token}` } };
              const response = await api.get('services/', config);

              setServices(response.data.results || response.data);
          } catch (error) {
              console.error("Failed to load services:", error);
          } finally {
              setLoading(false);
          }
      };
      fetchServices();
  }, [router]);

  const handleDelete = async (id, name) => {
      if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;

      try {
          const token = localStorage.getItem('access_token');
          const config = { headers: { Authorization: `Bearer ${token}` } };

          await api.delete(`services/${id}/`, config);

          setServices(services.filter(service => service.id !== id));
          alert('Service deleted successfully.');

      } catch (error) {
          console.error("Delete failed:", error);
          alert('Failed to delete service. It may be linked to existing appointments.');
      }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading appointment types...</div>;

  return (
    <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', color: '#354f42', margin: 0 }}>
                Manage Appointment Types
            </h3>

            <button
                onClick={() => router.push('/admin/configurations/add')}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    background: isHovered ? '#354f42' : '#4a6b5d',
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

        <div style={{ border: '1px solid #4a6b5d', borderRadius: '12px', padding: '20px', background: 'white' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontWeight: 'bold', fontFamily: 'Times New Roman, serif' }}>Master Data</span>
                <span style={{ fontSize: '11px', background: '#eee', padding: '4px 8px', borderRadius: '4px', color: '#666' }}>
                    Changes apply globally
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr', fontSize: '12px', color: '#666', marginBottom: '10px', paddingLeft: '15px', fontWeight: 'bold' }}>
                <span>Service Name</span>
                <span>Duration</span>
                <span>Cost</span>
                <span>Status</span>
                <span style={{ textAlign: 'right', paddingRight: '15px' }}>Actions</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {services.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No services configured yet.</div>
                )}

                {services.map(service => {
                    // Strictly use is_active for status
                    let isActive = true;
                    if (service.status !== undefined) {
                        isActive = service.status === 'Active';
                    } else if (service.is_active !== undefined) {
                        isActive = service.is_active;
                    }
                    const statusText = isActive ? 'Active' : 'Inactive';
                    const durationText = service.duration_minutes ? `${service.duration_minutes} mins` : (service.duration || '--');

                    // --- CHANGED CURRENCY TO ฿ ---
                    const costText = service.cost ? `฿${service.cost}` : (service.price ? `฿${service.price}` : '--');

                    return (
                        <div key={service.id} style={{
                            display: 'grid', gridTemplateColumns: '2.5fr 1fr 1fr 1fr 1fr', alignItems: 'center',
                            background: '#d4e0d9', padding: '12px 15px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', color: '#333'
                        }}>
                            <div>{service.name}</div>
                            <div>{durationText}</div>
                            <div>{costText}</div>
                            <div>
                                <span style={{ background: isActive ? '#00c853' : '#94a3b8', color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '11px' }}>
                                    {statusText}
                                </span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#666', display: 'flex', gap: '15px', cursor: 'pointer', justifyContent: 'flex-end' }}>
                                <span
                                    onClick={() => router.push(`/admin/configurations/edit/${service.id}`)}
                                    style={{ textDecoration: 'underline', color: '#4a6b5d', fontWeight: 'bold', transition: 'color 0.2s' }}
                                    onMouseOver={(e) => e.target.style.color = '#2c4a3b'}
                                    onMouseOut={(e) => e.target.style.color = '#4a6b5d'}
                                >
                                    Edit
                                </span>
                                <span
                                    onClick={() => handleDelete(service.id, service.name)}
                                    style={{ opacity: 0.7, fontSize: '14px', transition: 'opacity 0.2s' }}
                                    onMouseOver={(e) => e.target.style.opacity = 1}
                                    onMouseOut={(e) => e.target.style.opacity = 0.7}
                                    title="Delete Service"
                                >
                                    🗑️
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </>
  );
}