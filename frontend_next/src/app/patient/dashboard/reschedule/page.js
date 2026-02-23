'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../../patient_dashboard.module.css'; 

// --- REUSABLE HOVER BUTTON ---
const HoverButton = ({ children, onClick, style, hoverStyle, disabled }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...style,
        ...(isHovered && !disabled ? hoverStyle : {}),
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontFamily: 'sans-serif'
      }}
    >
      {children}
    </button>
  );
};

export default function ReschedulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('id');

  const [privacyMode, setPrivacyMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State to hold the current appointment details
  const [currentAppointment, setCurrentAppointment] = useState(null);
  
  // NEW: State to hold the grouped availability slots and the chosen slot
  const [groupedAvailabilities, setGroupedAvailabilities] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);

  const sensitiveStyle = {
    filter: privacyMode ? 'blur(4px)' : 'none', 
    transition: 'all 0.3s ease',
    userSelect: privacyMode ? 'none' : 'text', 
    opacity: privacyMode ? 0.7 : 1 
  };

  // --- 1. FETCH APPOINTMENT & AVAILABILITY ---
  useEffect(() => {
    if (!appointmentId) return;

    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      try {
        // A. Fetch current appointment
        const apptRes = await fetch(`http://localhost:8000/api/appointments/${appointmentId}/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!apptRes.ok) throw new Error("Failed to fetch appointment");
        const apptData = await apptRes.json();
        setCurrentAppointment(apptData);

        // B. Get the Therapist ID from the appointment (adjust if your serializer returns a nested object)
        const therapistId = typeof apptData.therapist === 'object' ? apptData.therapist.id : apptData.therapist;

        // C. Fetch that specific Therapist's Availability
        if (therapistId) {
            const availRes = await fetch(`http://localhost:8000/api/availability/?therapist_id=${therapistId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (availRes.ok) {
                const availData = await availRes.json();
                
                // Group the slots by date (e.g., {"2026-12-07": [slot1, slot2], "2026-12-08": [slot3]})
                const grouped = availData.reduce((acc, slot) => {
                    if (!acc[slot.date]) acc[slot.date] = [];
                    acc[slot.date].push(slot);
                    return acc;
                }, {});
                
                setGroupedAvailabilities(grouped);
            }
        }
      } catch (error) {
        console.error("Error connecting to backend:", error);
      }
    };

    fetchData();
  }, [appointmentId]);


  // --- 2. SEND PATCH REQUEST ---
  const handleConfirm = async () => {
    if (!appointmentId || !selectedSlot) return;
    
    setLoading(true);
    const token = localStorage.getItem('access_token');

    // Combine the date and time from the selected slot into an ISO string for Django
    // Expected output: "2026-12-07T13:00:00Z"
    const formattedDateTime = `${selectedSlot.date}T${selectedSlot.start_time}Z`;

    // Send the correct field name matching your Django Appointment model
    const payload = {
        start_time: formattedDateTime 
    };

    try {
        const res = await fetch(`http://localhost:8000/api/appointments/${appointmentId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Appointment Rescheduled Successfully!");
            router.push('/patient/dashboard');
        } else {
            const errorData = await res.json();
            console.error("Update failed:", errorData);
            alert("Failed to reschedule. Please check the console.");
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error connecting to the server.");
    } finally {
        setLoading(false);
    }
  };

  // --- HELPER FUNCTIONS FOR FORMATTING ---
  const formatDisplayDate = (dateString) => {
      const dateObj = new Date(dateString + 'T00:00:00'); // Force local timezone
      return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const formatDisplayTime = (timeString) => {
      // timeString is like "13:00:00"
      const [hour, minute] = timeString.split(':');
      const dateObj = new Date();
      dateObj.setHours(parseInt(hour, 10));
      dateObj.setMinutes(parseInt(minute, 10));
      return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div style={{ fontFamily: 'Times New Roman, serif', minHeight: '100vh', backgroundColor: '#333' }}>
      
      {/* ================= BACKGROUND LAYERS ================= */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/first_background_homepage.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(30, 30, 30, 0.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 0 }}></div>

      {/* ================= CONTENT ================= */}
      <div style={{ position: 'relative', zIndex: 1, paddingTop: '150px', paddingBottom: '50px', paddingLeft: '60px', paddingRight: '60px', color: 'white' }}>
        
        {/* --- HEADER --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <HoverButton 
                    onClick={() => router.back()}
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '10px 15px' }}
                    hoverStyle={{ background: 'white', color: '#333' }}
                >
                    ← Back
                </HoverButton>
                <h1 style={{ fontSize: '42px', fontWeight: 'normal', margin: 0 }}>Reschedule Appointment</h1>
            </div>

            {/* Privacy Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.2)', padding: '8px 15px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
                <span style={{ fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>
                    {privacyMode ? 'Privacy On' : 'Privacy Mode'}
                </span>
                <div onClick={() => setPrivacyMode(!privacyMode)} style={{ width: '40px', height: '20px', background: privacyMode ? '#4ade80' : '#ccc', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}>
                    <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: privacyMode ? '22px' : '2px', transition: 'left 0.3s' }}></div>
                </div>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
            
            {/* --- LEFT COLUMN: CURRENT DETAILS --- */}
            <div className={styles.glassCard} style={{ height: 'fit-content' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>Current Appointment</h3>
                
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ccc', backgroundImage: 'url(https://i.pravatar.cc/150?img=5)', backgroundSize: 'cover' }}></div>
                    <div>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px', ...sensitiveStyle }}>
                        {currentAppointment 
                            ? `Dr. ${currentAppointment.therapist_details?.user?.first_name || ''} ${currentAppointment.therapist_details?.user?.last_name || ''}` 
                            : 'Loading...'}
                        </div>
                        <div style={{ fontSize: '13px', opacity: 0.8, fontFamily: 'sans-serif' }}>
                            Licensed Therapist {currentAppointment?.therapist_details?.specialization ? `· ${currentAppointment.therapist_details.specialization}` : ''}
                        </div>
                    </div>
                </div>

                <div style={{ fontFamily: 'sans-serif', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <div style={{ opacity: 0.6, fontSize: '12px', marginBottom: '3px' }}>Original Time</div>
                        <div style={{ fontWeight: 'bold', color: '#f87171', ...sensitiveStyle }}>
                            {currentAppointment ? new Date(currentAppointment.start_time).toLocaleString() : 'Loading...'}
                        </div>
                    </div>
                </div>
            </div>


            {/* --- RIGHT COLUMN: DYNAMIC AVAILABLE SLOTS --- */}
            <div className={styles.glassCard}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>Select New Time</h3>
                <p style={{ fontSize: '13px', opacity: 0.7, fontFamily: 'sans-serif', marginBottom: '30px' }}>Choose a new available slot.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    
                    {/* Check if we have availability data */}
                    {Object.keys(groupedAvailabilities).length === 0 ? (
                        <p style={{ color: '#ccc', fontStyle: 'italic' }}>No availability found for this doctor right now.</p>
                    ) : (
                        // Map over the grouped dates
                        Object.entries(groupedAvailabilities).map(([dateStr, slots]) => (
                            <div key={dateStr}>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', borderLeft: '4px solid #0ea5e9', paddingLeft: '10px' }}>
                                    {formatDisplayDate(dateStr)} {/* e.g. "Thursday, Dec 7" */}
                                </div>
                                
                                {/* Map over the specific times for that date */}
                                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                    {slots.map((slot) => {
                                        const displayTime = formatDisplayTime(slot.start_time); // e.g. "1:00 PM"
                                        const isSelected = selectedSlot && selectedSlot.id === slot.id;

                                        return (
                                            <HoverButton
                                                key={slot.id}
                                                // We save the entire slot object to state so we can access its date and time easily
                                                onClick={() => setSelectedSlot({ ...slot, displayTime })}
                                                style={{ 
                                                    background: isSelected ? '#0ea5e9' : 'rgba(255,255,255,0.1)', 
                                                    border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '10px 20px', borderRadius: '30px' 
                                                }}
                                                hoverStyle={{ background: '#0ea5e9' }}
                                            >
                                                {displayTime}
                                            </HoverButton>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* CONFIRMATION AREA */}
                <div style={{ marginTop: '50px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '25px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
                    {selectedSlot && (
                        <div style={{ fontSize: '14px' }}>
                            Rescheduling to: <span style={{ fontWeight: 'bold', color: '#4ade80' }}>
                                {formatDisplayDate(selectedSlot.date)} at {selectedSlot.displayTime}
                            </span>
                        </div>
                    )}
                    <HoverButton
                        onClick={handleConfirm}
                        disabled={!selectedSlot || loading}
                        style={{ 
                            background: 'white', color: '#333', padding: '12px 30px', borderRadius: '50px', fontSize: '16px' 
                        }}
                        hoverStyle={{ background: '#e2e8f0' }}
                    >
                        {loading ? 'Confirming...' : 'Confirm Change'}
                    </HoverButton>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}