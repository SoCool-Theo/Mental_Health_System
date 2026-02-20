'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams(); // Get ID from URL
  
  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  // Initial State (In a real app, you would fetch this using params.id)
  const [formData, setFormData] = useState({
    name: 'Consultation', // Simulated pre-filled data
    duration: '30',
    cost: '50.00',
    status: 'Active'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log(`Updating Service ${params.id}:`, formData);
    // Add API Update Logic Here
    router.push('/admin/configurations');
  };

  return (
    <>
      {/* --- PAGE HEADER --- */}
      <div style={{ marginBottom: '30px' }}>
         <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', color: '#354f42', margin: '0 0 5px 0' }}>
             Edit Appointment Type
         </h3>
         <div style={{ fontSize: '13px', color: '#666' }}>
             Modifying details for Service ID: <strong>{params.id}</strong>
         </div>
      </div>

      {/* --- FORM CARD --- */}
      <div style={{ border: '1px solid #4a6b5d', borderRadius: '12px', padding: '30px', maxWidth: '600px', background: '#fff' }}>
            
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Service Name */}
                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Service Name</label>
                    <input 
                        type="text" name="name" required
                        value={formData.name} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                    />
                </div>

                {/* Grid for Small Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    
                    {/* Duration */}
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Duration (mins)</label>
                        <input 
                            type="number" name="duration" required
                            value={formData.duration} onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                        />
                    </div>

                    {/* Cost */}
                    <div>
                        <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Cost ($)</label>
                        <input 
                            type="number" name="cost" required
                            value={formData.cost} onChange={handleChange}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none' }}
                        />
                    </div>
                </div>

                {/* Status Select */}
                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Availability Status</label>
                    <select 
                        name="status" 
                        value={formData.status} onChange={handleChange}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px', outline: 'none', background: 'white' }}
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Hidden">Hidden (Archived)</option>
                    </select>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                    
                    {/* Save Button */}
                    <button 
                        type="submit"
                        onMouseEnter={() => setSaveHover(true)}
                        onMouseLeave={() => setSaveHover(false)}
                        style={{ 
                            flex: 1,
                            background: saveHover ? '#354f42' : '#4a6b5d',
                            color: 'white', border: 'none', 
                            padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px',
                            transition: 'all 0.2s'
                        }}
                    >
                        Save Changes
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