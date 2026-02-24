'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../api';

export default function AddServicePage() {
  const router = useRouter();

  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    cost: '',
    status: 'Active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const token = localStorage.getItem('access_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Clean payload focusing only on standard DRF fields
        const payload = {
            name: formData.name,
            duration_minutes: parseInt(formData.duration),
            price: parseFloat(formData.cost),
            cost: parseFloat(formData.cost),
            is_active: formData.status === 'Active',
            status: formData.status
        };

        await api.post('services/', payload, config);

        alert("Appointment type created successfully!");
        router.push('/admin/configurations');

    } catch (error) {
        console.error("Failed to create service:", error);
        if (error.response && error.response.data) {
            const errorMsg = Object.values(error.response.data).flat().join('\n');
            alert(`Error: ${errorMsg}`);
        } else {
            alert("Failed to create appointment type. Please check your network.");
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <>
        <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', color: '#354f42', margin: '0 0 5px 0' }}>
                Create Appointment Type
            </h3>
            <span style={{ fontSize: '13px', color: '#666' }}>Define a new service available for booking.</span>
        </div>

        <div style={{ border: '1px solid #4a6b5d', borderRadius: '12px', padding: '30px', maxWidth: '600px', background: '#fff' }}>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Service Name</label>
                    <input
                        type="text" name="name"
                        placeholder="e.g. Couples Counseling"
                        value={formData.name} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                        required
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Duration (mins)</label>
                        <input
                            type="number" name="duration"
                            placeholder="60" min="1"
                            value={formData.duration} onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                            required
                        />
                    </div>
                    <div>
                        {/* --- CHANGED TO ฿ --- */}
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Cost (฿)</label>
                        <input
                            type="number" name="cost"
                            placeholder="1500.00" step="0.01" min="0"
                            value={formData.cost} onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Status</label>
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
                        {isSubmitting ? 'Saving...' : 'Save Service'}
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