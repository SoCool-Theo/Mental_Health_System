'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../api';

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id;

  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    cost: '',
    status: 'Active'
  });

  useEffect(() => {
    const fetchService = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return router.push('/login');

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await api.get(`services/${serviceId}/`, config);

            const data = response.data;

            setFormData({
                name: data.name || '',
                duration: data.duration_minutes || data.duration || '',
                cost: data.cost || data.price || '',
                status: (data.status === 'Inactive' || data.is_active === false) ? 'Inactive' : 'Active'
            });

        } catch (error) {
            console.error("Failed to load service data:", error);
            alert("Could not load appointment type details. It may have been deleted.");
            router.push('/admin/configurations');
        } finally {
            setLoadingData(false);
        }
    };

    if (serviceId) {
        fetchService();
    }
  }, [serviceId, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const token = localStorage.getItem('access_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const payload = {
            name: formData.name,
            duration_minutes: parseInt(formData.duration),
            price: parseFloat(formData.cost),
            cost: parseFloat(formData.cost),
            is_active: formData.status === 'Active',
            status: formData.status
        };

        await api.patch(`services/${serviceId}/`, payload, config);

        alert("Appointment type updated successfully!");
        router.push('/admin/configurations');

    } catch (error) {
        console.error("Update failed:", error);
        if (error.response && error.response.data) {
            const errorMsg = Object.values(error.response.data).flat().join('\n');
            alert(`Error: ${errorMsg}`);
        } else {
            alert("Failed to update appointment type. Please check your network.");
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loadingData) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading service details...</div>;

  return (
    <>
      <div style={{ marginBottom: '30px' }}>
         <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', color: '#354f42', margin: '0 0 5px 0' }}>
             Edit Appointment Type
         </h3>
         <div style={{ fontSize: '13px', color: '#666' }}>
             Modifying details for Service ID: <strong>{serviceId}</strong>
         </div>
      </div>

      <div style={{ border: '1px solid #4a6b5d', borderRadius: '12px', padding: '30px', maxWidth: '600px', background: '#fff' }}>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Service Name</label>
                    <input
                        type="text" name="name" required
                        value={formData.name} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Duration (mins)</label>
                        <input
                            type="number" name="duration" required min="1"
                            value={formData.duration} onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                        />
                    </div>
                    <div>
                        {/* --- CHANGED TO ฿ --- */}
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Cost (฿)</label>
                        <input
                            type="number" name="cost" required step="0.01" min="0"
                            value={formData.cost} onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Availability Status</label>
                    <select
                        name="status"
                        value={formData.status} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', background: 'white' }}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                    <button
                        type="submit" disabled={isSubmitting}
                        onMouseEnter={() => setSaveHover(true)} onMouseLeave={() => setSaveHover(false)}
                        style={{
                            flex: 1, background: saveHover && !isSubmitting ? '#354f42' : '#4a6b5d', color: 'white', border: 'none',
                            padding: '12px', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px',
                            transition: 'all 0.2s', opacity: isSubmitting ? 0.7 : 1
                        }}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                        type="button" onClick={() => router.back()}
                        onMouseEnter={() => setCancelHover(true)} onMouseLeave={() => setCancelHover(false)}
                        style={{
                            flex: 1, background: cancelHover ? '#f0f0f0' : 'transparent', color: '#555', border: '1px solid #ccc',
                            padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px',
                            transition: 'all 0.2s'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </>
  );
}