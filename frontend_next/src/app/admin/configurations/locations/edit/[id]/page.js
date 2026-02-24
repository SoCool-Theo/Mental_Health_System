'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '../../../../../../api';

export default function EditLocationPage() {
  const router = useRouter();
  const params = useParams();
  const locationId = params.id;

  // Button Hover & Loading States
  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    rooms: '',
    status: 'Open'
  });

  // --- 1. FETCH LOCATION DATA ON LOAD ---
  useEffect(() => {
    const fetchLocation = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) return router.push('/login');

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const response = await api.get(`locations/${locationId}/`, config);

            const data = response.data;

            // Map the backend data to our form fields
            setFormData({
                name: data.name || '',
                address: data.address || '',
                rooms: data.rooms || '',
                // If is_active is false, we set the dropdown to Maintenance
                status: data.is_active === false ? 'Maintenance' : 'Open'
            });

        } catch (error) {
            console.error("Failed to load location data:", error);
            alert("Could not load location details. It may have been deleted.");
            router.push('/admin/configurations/locations');
        } finally {
            setLoadingData(false);
        }
    };

    if (locationId) {
        fetchLocation();
    }
  }, [locationId, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 2. HANDLE UPDATE ---
  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const token = localStorage.getItem('access_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Construct payload to match backend DRF Serializer
        const payload = {
            name: formData.name,
            address: formData.address,
            rooms: formData.rooms ? parseInt(formData.rooms) : 1,
            is_active: formData.status === 'Open',
            status: formData.status
        };

        // PATCH request to update only the changed fields
        await api.patch(`locations/${locationId}/`, payload, config);

        alert("Location updated successfully!");
        router.push('/admin/configurations/locations');

    } catch (error) {
        console.error("Update failed:", error);
        if (error.response && error.response.data) {
            const errorMsg = Object.values(error.response.data).flat().join('\n');
            alert(`Error: ${errorMsg}`);
        } else {
            alert("Failed to update location. Please check your network.");
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loadingData) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading location details...</div>;

  return (
    <>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', color: '#354f42', margin: '0 0 5px 0' }}>
                Edit Location
            </h3>
            <span style={{ fontSize: '13px', color: '#666' }}>
                Modifying details for Clinic Site ID: <strong>{locationId}</strong>
            </span>
        </div>

        {/* Form Card */}
        <div style={{ border: '1px solid #4a6b5d', borderRadius: '12px', padding: '30px', maxWidth: '600px', background: '#fff' }}>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Name Input */}
                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Location Name</label>
                    <input
                        type="text" name="name"
                        placeholder="e.g. Downtown Branch"
                        value={formData.name} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                        required
                    />
                </div>

                {/* Address Input */}
                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Full Address</label>
                    <textarea
                        name="address"
                        placeholder="e.g. 123 Health Ave, Suite 100"
                        value={formData.address} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', height: '80px', fontFamily: 'sans-serif' }}
                        required
                    />
                </div>

                {/* Grid for Small Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                    {/* Rooms */}
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Consultation Rooms</label>
                        <input
                            type="number" name="rooms"
                            placeholder="0" min="1"
                            value={formData.rooms} onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                        />
                    </div>

                    {/* Status Select */}
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Operational Status</label>
                        <select
                            name="status"
                            value={formData.status} onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', background: 'white' }}
                        >
                            <option value="Open">Open</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Closed">Closed</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>

                    {/* Save Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        onMouseEnter={() => setSaveHover(true)}
                        onMouseLeave={() => setSaveHover(false)}
                        style={{
                            flex: 1,
                            background: saveHover && !isSubmitting ? '#354f42' : '#4a6b5d',
                            color: 'white', border: 'none',
                            padding: '12px', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '15px',
                            transition: 'all 0.2s',
                            opacity: isSubmitting ? 0.7 : 1
                        }}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>

                    {/* Cancel Button */}
                    <button
                        type="button"
                        onClick={() => router.back()}
                        onMouseEnter={() => setCancelHover(true)}
                        onMouseLeave={() => setCancelHover(false)}
                        style={{
                            flex: 1,
                            background: cancelHover ? '#f0f0f0' : 'transparent',
                            color: '#555', border: '1px solid #ccc',
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