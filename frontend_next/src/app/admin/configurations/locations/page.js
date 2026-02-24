'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../api';

export default function LocationsPage() {
  const router = useRouter();

  const [isHovered, setIsHovered] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH LOCATIONS ON LOAD ---
  useEffect(() => {
      const fetchLocations = async () => {
          try {
              const token = localStorage.getItem('access_token');
              if (!token) return router.push('/login');

              const config = { headers: { Authorization: `Bearer ${token}` } };
              // Assuming your endpoint is 'locations/'. Adjust if your DRF router uses 'clinics/' etc.
              const response = await api.get('locations/', config);

              setLocations(response.data.results || response.data);
          } catch (error) {
              console.error("Failed to load locations:", error);
          } finally {
              setLoading(false);
          }
      };

      fetchLocations();
  }, [router]);

  // --- 2. HANDLE DELETE ---
  const handleDelete = async (id, name) => {
      if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;

      try {
          const token = localStorage.getItem('access_token');
          const config = { headers: { Authorization: `Bearer ${token}` } };

          await api.delete(`locations/${id}/`, config);

          setLocations(locations.filter(loc => loc.id !== id));
          alert('Location deleted successfully.');

      } catch (error) {
          console.error("Delete failed:", error);
          alert('Failed to delete location. It may be linked to existing appointments or staff.');
      }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading locations...</div>;

  return (
    <>
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', color: '#354f42', margin: 0 }}>
                Manage Locations
            </h3>

            {/* + Add Location Button with Hover */}
            <button
                onClick={() => router.push('/admin/configurations/locations/add')}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    background: isHovered ? '#354f42' : '#4a6b5d',
                    color: 'white', border: 'none',
                    padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                    transition: 'background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: isHovered ? '0 4px 12px rgba(74, 107, 93, 0.3)' : 'none',
                    transform: isHovered ? 'translateY(-1px)' : 'none'
                }}
            >
                + Add Location
            </button>
        </div>

        {/* Table */}
        <div style={{ border: '1px solid #4a6b5d', borderRadius: '12px', padding: '20px', background: 'white' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <span style={{ fontWeight: 'bold', fontFamily: 'Times New Roman, serif' }}>Clinic Sites</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', fontSize: '12px', color: '#666', marginBottom: '10px', paddingLeft: '15px', fontWeight: 'bold' }}>
                <span>Location Name</span>
                <span>Address</span>
                <span>Rooms</span>
                <span>Status</span>
                <span style={{ textAlign: 'right', paddingRight: '15px' }}>Actions</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {locations.length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No locations configured yet.</div>
                )}

                {locations.map(loc => {
                    // --- BULLETPROOF STATUS CHECK ---
                    let isActive = true;
                    if ('is_active' in loc) {
                        isActive = Boolean(loc.is_active);
                    } else if ('status' in loc) {
                        isActive = String(loc.status).toLowerCase() === 'open' || String(loc.status).toLowerCase() === 'active';
                    }

                    const statusText = isActive ? 'Open' : 'Maintenance';

                    return (
                        <div key={loc.id} style={{
                            display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', alignItems: 'center',
                            background: '#fcfdfc', border: '1px solid #eee', padding: '12px 15px', borderRadius: '8px', fontSize: '14px', color: '#333'
                        }}>
                            <div style={{ fontWeight: '600' }}>{loc.name}</div>
                            <div style={{ fontSize: '13px', color: '#555' }}>{loc.address || '--'}</div>
                            <div>{loc.rooms || '--'}</div>
                            <div>
                                <span style={{
                                    background: isActive ? '#dcfce7' : '#fee2e2',
                                    color: isActive ? '#166534' : '#991b1b',
                                    padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold'
                                }}>
                                    {statusText}
                                </span>
                            </div>

                            {/* REPLACED EMOJI WITH ACTIONS */}
                            <div style={{ fontSize: '12px', color: '#666', display: 'flex', gap: '15px', cursor: 'pointer', justifyContent: 'flex-end' }}>
                                <span
                                    onClick={() => router.push(`/admin/configurations/locations/edit/${loc.id}`)}
                                    style={{ textDecoration: 'underline', color: '#4a6b5d', fontWeight: 'bold', transition: 'color 0.2s' }}
                                    onMouseOver={(e) => e.target.style.color = '#2c4a3b'}
                                    onMouseOut={(e) => e.target.style.color = '#4a6b5d'}
                                >
                                    Edit
                                </span>
                                <span
                                    onClick={() => handleDelete(loc.id, loc.name)}
                                    style={{ opacity: 0.7, fontSize: '14px', transition: 'opacity 0.2s' }}
                                    onMouseOver={(e) => e.target.style.opacity = 1}
                                    onMouseOut={(e) => e.target.style.opacity = 0.7}
                                    title="Delete Location"
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