'use client';

import { useState, useEffect } from 'react';
import api from '../../../api';

export default function AvailabilityPage() {
    const [availabilities, setAvailabilities] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form States
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    
    // Editing State
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    // --- 1. FETCH AVAILABILITIES ---
    useEffect(() => {
        fetchAvailabilities();
    }, []);

    const fetchAvailabilities = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const res = await api.get('availability/', config);
            const data = res.data.results || res.data;
            
            const sorted = data.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.start_time}`);
                const dateB = new Date(`${b.date}T${b.start_time}`);
                return dateA - dateB;
            });
            
            setAvailabilities(sorted);
        } catch (error) {
            console.error("Error fetching availabilities:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- 2. ADD OR UPDATE SLOT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('access_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            const payload = {
                date: date,
                start_time: startTime,
                end_time: endTime
            };

            if (editingId) {
                await api.put(`availability/${editingId}/`, payload, config);
                alert("Time slot updated!");
            } else {
                await api.post('availability/', payload, config);
                alert("Time slot added!");
            }
            
            fetchAvailabilities();
            handleCancelEdit();

        } catch (error) {
            console.error("Error saving slot:", error);
            alert("Failed to save slot. Check for overlapping times or errors.");
        } finally {
            setSaving(false);
        }
    };

    // --- 3. DELETE SLOT ---
    const handleDelete = async (id) => {
        if (!confirm("Remove this open slot? Patients will not be able to book it.")) return;
        
        try {
            const token = localStorage.getItem('access_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.delete(`availability/${id}/`, config);
            
            setAvailabilities(availabilities.filter(a => a.id !== id));
        } catch (error) {
            console.error("Error deleting slot:", error);
        }
    };

    // --- 4. PREPARE EDIT ---
    const handleEditClick = (slot) => {
        setEditingId(slot.id);
        setDate(slot.date);
        setStartTime(slot.start_time.substring(0, 5)); 
        setEndTime(slot.end_time.substring(0, 5));
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setDate('');
        setStartTime('');
        setEndTime('');
    };

    // --- FORMATTING HELPERS ---
    const formatDisplayTime = (timeString) => {
        const [hour, minute] = timeString.split(':');
        const dateObj = new Date();
        dateObj.setHours(parseInt(hour, 10), parseInt(minute, 10));
        return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    const groupedSlots = availabilities.reduce((acc, slot) => {
        if (!acc[slot.date]) acc[slot.date] = [];
        acc[slot.date].push(slot);
        return acc;
    }, {});

    return (
        <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px' }}>
            
            {/* LEFT: FORM PANE */}
            <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
                    Manage Hours
                </h2>
                
                <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: editingId ? '#0ea5e9' : '#16a34a' }}>
                        {editingId ? 'Edit Time Slot' : 'Add New Slot'}
                    </h3>
                    
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '5px' }}>Date</label>
                            <input 
                                type="date" required value={date} onChange={(e) => setDate(e.target.value)} 
                                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} 
                            />
                        </div>
                        
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '5px' }}>Start Time</label>
                                <input 
                                    type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} 
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} 
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '5px' }}>End Time</label>
                                <input 
                                    type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} 
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} 
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            {editingId && (
                                <button 
                                    type="button" 
                                    onClick={handleCancelEdit} 
                                    style={{ 
                                        flex: 1, padding: '10px', background: '#f1f5f9', color: '#475569', 
                                        border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                                    onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                >
                                    Cancel
                                </button>
                            )}
                            <button 
                                type="submit" 
                                disabled={saving} 
                                style={{ 
                                    flex: editingId ? 1 : '1 1 100%', padding: '10px', 
                                    background: editingId ? '#0ea5e9' : '#16a34a', color: 'white', 
                                    border: 'none', borderRadius: '6px', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '600',
                                    opacity: saving ? 0.7 : 1, transition: 'all 0.2s ease'
                                }}
                                onMouseOver={(e) => {
                                    if (!saving) e.currentTarget.style.background = editingId ? '#0284c7' : '#15803d';
                                }}
                                onMouseOut={(e) => {
                                    if (!saving) e.currentTarget.style.background = editingId ? '#0ea5e9' : '#16a34a';
                                }}
                            >
                                {saving ? 'Saving...' : (editingId ? 'Update Slot' : 'Create Slot')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* RIGHT: LIST PANE */}
            <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '20px' }}>
                    Your Schedule
                </h2>

                <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', minHeight: '400px' }}>
                    {loading ? (
                        <p style={{ color: '#94a3b8' }}>Loading schedule...</p>
                    ) : availabilities.length === 0 ? (
                        <p style={{ color: '#94a3b8' }}>You have no open slots. Add some on the left to allow patients to book.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                            {Object.entries(groupedSlots).map(([dateStr, slots]) => {
                                const displayDate = new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
                                
                                return (
                                    <div key={dateStr}>
                                        <h4 style={{ fontSize: '15px', color: '#475569', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px', marginBottom: '15px' }}>
                                            {displayDate}
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {slots.map(slot => (
                                                <div key={slot.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px 20px', borderRadius: '8px', borderLeft: '4px solid #0ea5e9' }}>
                                                    <span style={{ fontWeight: '600', color: '#334155' }}>
                                                        {formatDisplayTime(slot.start_time)} - {formatDisplayTime(slot.end_time)}
                                                    </span>
                                                    
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button 
                                                            onClick={() => handleEditClick(slot)} 
                                                            style={{ 
                                                                background: 'white', border: '1px solid #cbd5e1', padding: '5px 10px', 
                                                                borderRadius: '6px', color: '#0ea5e9', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                            onMouseOver={(e) => { e.currentTarget.style.background = '#f0f9ff'; e.currentTarget.style.borderColor = '#0ea5e9'; }}
                                                            onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
                                                        >
                                                            Edit
                                                        </button>
                                                        
                                                        <button 
                                                            onClick={() => handleDelete(slot.id)} 
                                                            style={{ 
                                                                background: '#fee2e2', border: 'none', padding: '5px 10px', 
                                                                borderRadius: '6px', color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                                                                transition: 'all 0.2s ease'
                                                            }}
                                                            onMouseOver={(e) => e.currentTarget.style.background = '#fecaca'}
                                                            onMouseOut={(e) => e.currentTarget.style.background = '#fee2e2'}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}