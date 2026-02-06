'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddLocationPage() {
  const router = useRouter();

  // Button Hover States
  const [saveHover, setSaveHover] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    rooms: '',
    status: 'Open'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log("Saving Location:", formData);
    // Add API logic here
    router.push('/admin/configurations/locations'); // Go back after save
  };

  return (
    <>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', color: '#354f42', margin: '0 0 5px 0' }}>
                Add New Location
            </h3>
            <span style={{ fontSize: '13px', color: '#666' }}>Enter details for the new clinic site.</span>
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
                            placeholder="0"
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
                        Save Location
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