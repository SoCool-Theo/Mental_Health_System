'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OperatingHoursPage() {
  const router = useRouter();
  
  // Button Hover State
  const [saveHover, setSaveHover] = useState(false);

  // Initial Schedule Data
  const [schedule, setSchedule] = useState([
    { day: 'Monday', isOpen: true, start: '09:00', end: '17:00' },
    { day: 'Tuesday', isOpen: true, start: '09:00', end: '17:00' },
    { day: 'Wednesday', isOpen: true, start: '09:00', end: '17:00' },
    { day: 'Thursday', isOpen: true, start: '09:00', end: '17:00' },
    { day: 'Friday', isOpen: true, start: '09:00', end: '17:00' },
    { day: 'Saturday', isOpen: false, start: '10:00', end: '14:00' },
    { day: 'Sunday', isOpen: false, start: '', end: '' },
  ]);

  // Toggle Open/Closed
  const handleToggle = (index) => {
    const newSchedule = [...schedule];
    newSchedule[index].isOpen = !newSchedule[index].isOpen;
    setSchedule(newSchedule);
  };

  // Handle Time Change
  const handleTimeChange = (index, field, value) => {
    const newSchedule = [...schedule];
    newSchedule[index][field] = value;
    setSchedule(newSchedule);
  };

  // Save Function
  const handleSave = () => {
    console.log("Saving Schedule:", schedule);
    alert("Operating hours updated successfully!");
  };

  return (
    <>
        {/* Header Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
                <h3 style={{ fontFamily: 'Times New Roman, serif', fontSize: '24px', color: '#354f42', margin: '0 0 5px 0' }}>
                    Operating Hours
                </h3>
                <span style={{ fontSize: '13px', color: '#666' }}>Set the standard opening times for your clinic.</span>
            </div>
            
            {/* Save Button */}
            <button 
                onClick={handleSave}
                onMouseEnter={() => setSaveHover(true)}
                onMouseLeave={() => setSaveHover(false)}
                style={{ 
                    background: saveHover ? '#354f42' : '#4a6b5d', 
                    color: 'white', border: 'none', 
                    padding: '10px 25px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold',
                    transition: 'all 0.2s', boxShadow: saveHover ? '0 4px 12px rgba(74, 107, 93, 0.3)' : 'none'
                }}
            >
                Save Changes
            </button>
        </div>

        {/* Schedule Editor Card */}
        <div style={{ border: '1px solid #4a6b5d', borderRadius: '12px', padding: '10px', background: '#fff' }}>
            
            {/* Header Columns */}
            <div style={{ 
                display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', 
                padding: '15px 20px', borderBottom: '1px solid #eee', 
                fontSize: '12px', fontWeight: 'bold', color: '#666', fontFamily: 'sans-serif'
            }}>
                <span>Day of Week</span>
                <span style={{ textAlign: 'center' }}>Status</span>
                <span>Opening Time</span>
                <span>Closing Time</span>
            </div>

            {/* Days Rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {schedule.map((day, index) => (
                    <div key={day.day} style={{ 
                        display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', alignItems: 'center',
                        padding: '15px 20px', borderBottom: index !== 6 ? '1px solid #f0f0f0' : 'none',
                        background: day.isOpen ? 'white' : '#fafafa', // Grey out closed days
                        transition: 'background 0.2s'
                    }}>
                        
                        {/* Day Name */}
                        <div style={{ fontWeight: '600', color: day.isOpen ? '#333' : '#999' }}>
                            {day.day}
                        </div>

                        {/* Custom Toggle Switch */}
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <div 
                                onClick={() => handleToggle(index)}
                                style={{
                                    width: '40px', height: '22px', borderRadius: '20px', cursor: 'pointer', position: 'relative',
                                    background: day.isOpen ? '#4a6b5d' : '#ccc', transition: 'background 0.3s'
                                }}
                            >
                                <div style={{
                                    width: '16px', height: '16px', background: 'white', borderRadius: '50%',
                                    position: 'absolute', top: '3px', transition: 'left 0.3s',
                                    left: day.isOpen ? '21px' : '3px'
                                }}></div>
                            </div>
                            <span style={{ marginLeft: '10px', fontSize: '13px', width: '45px', color: day.isOpen ? '#4a6b5d' : '#999' }}>
                                {day.isOpen ? 'Open' : 'Closed'}
                            </span>
                        </div>

                        {/* Start Time */}
                        <div style={{ paddingRight: '10px' }}>
                            <input 
                                type="time" 
                                value={day.start} 
                                onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                                disabled={!day.isOpen}
                                style={{ 
                                    width: '100%', padding: '8px', borderRadius: '6px', 
                                    border: '1px solid #ddd', outline: 'none',
                                    color: day.isOpen ? '#333' : '#ccc',
                                    background: day.isOpen ? 'white' : 'transparent'
                                }}
                            />
                        </div>

                        {/* End Time */}
                        <div>
                            <input 
                                type="time" 
                                value={day.end} 
                                onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                                disabled={!day.isOpen}
                                style={{ 
                                    width: '100%', padding: '8px', borderRadius: '6px', 
                                    border: '1px solid #ddd', outline: 'none',
                                    color: day.isOpen ? '#333' : '#ccc',
                                    background: day.isOpen ? 'white' : 'transparent'
                                }}
                            />
                        </div>

                    </div>
                ))}
            </div>
        </div>
    </>
  );
}