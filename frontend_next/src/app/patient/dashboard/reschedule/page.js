'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../../../api';
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
  const [submitting, setSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // State to hold the current appointment details
  const [currentAppointment, setCurrentAppointment] = useState(null);
  
  // State to hold the grouped availability slots and the chosen slot
  const [groupedAvailabilities, setGroupedAvailabilities] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);

  const sensitiveStyle = {
    filter: privacyMode ? 'blur(4px)' : 'none', 
    transition: 'all 0.3s ease',
    userSelect: privacyMode ? 'none' : 'text', 
    opacity: privacyMode ? 0.7 : 1 
  };

  // --- 1. FETCH APPOINTMENT, AVAILABILITY & EXISTING BOOKINGS ---
  useEffect(() => {
    if (!appointmentId) return;

    const fetchData = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      setInitialLoading(true);
      setFetchError(null);

      try {
        const config = { headers: { 'Authorization': `Bearer ${token}` } };

        // A. Fetch current appointment
        const apptRes = await api.get(`appointments/${appointmentId}/`, config);
        const apptData = apptRes.data;
        setCurrentAppointment(apptData);

        // B. Get the Therapist User ID from the appointment
        const therapistUserId = apptData.therapist_details?.user?.id
          || (typeof apptData.therapist === 'object' ? apptData.therapist.id : apptData.therapist);

        if (!therapistUserId) {
          setFetchError("Could not determine the therapist for this appointment.");
          return;
        }

        // C. Fetch that therapist's availability (backend already filters future dates)
        const availRes = await api.get(`availability/?therapist_id=${therapistUserId}`, config);
        const rawAvail = availRes.data.results || availRes.data;

        // D. Filter out slots that are in the past (today's date but past time)
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0]; // "2026-02-25"

        const futureSlots = rawAvail.filter(slot => {
          if (slot.date > todayStr) return true;
          if (slot.date === todayStr) {
            // Only keep slots whose start_time hasn't passed yet
            const [h, m] = slot.start_time.split(':').map(Number);
            const slotTime = new Date();
            slotTime.setHours(h, m, 0, 0);
            return slotTime > now;
          }
          return false;
        });

        // E. Fetch ALL appointments to detect already-booked slots
        const allApptRes = await api.get('appointments/', config);
        const allAppts = allApptRes.data.results || allApptRes.data;

        // Keep non-cancelled appointments (excluding the one being rescheduled)
        const activeAppts = allAppts.filter(a =>
          a.status !== 'CANCELLED' && String(a.id) !== String(appointmentId)
        );

        // F. Check each availability slot against existing bookings to mark conflicts
        const slotsWithStatus = futureSlots.map(slot => {
          const slotStart = new Date(`${slot.date}T${slot.start_time}`);
          const slotEnd = new Date(`${slot.date}T${slot.end_time}`);

          const isBooked = activeAppts.some(appt => {
            const apptStart = new Date(appt.start_time);
            const apptEnd = new Date(appt.end_time);
            // Check time overlap
            return apptStart < slotEnd && apptEnd > slotStart;
          });

          return { ...slot, isBooked };
        });

        // G. Group the slots by date
        const grouped = slotsWithStatus.reduce((acc, slot) => {
          if (!acc[slot.date]) acc[slot.date] = [];
          acc[slot.date].push(slot);
          return acc;
        }, {});

        // Sort dates ascending
        const sortedGrouped = {};
        Object.keys(grouped).sort().forEach(key => {
          sortedGrouped[key] = grouped[key].sort((a, b) => a.start_time.localeCompare(b.start_time));
        });

        setGroupedAvailabilities(sortedGrouped);
      } catch (error) {
        console.error("Error connecting to backend:", error);
        if (error.response?.status === 404) {
          setFetchError("Appointment not found. It may have been deleted.");
        } else if (error.response?.status === 403) {
          setFetchError("You don't have permission to view this appointment.");
        } else {
          setFetchError("Failed to load appointment data. Please try again.");
        }
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [appointmentId, router]);


  // --- 2. SEND PATCH REQUEST ---
  const handleConfirm = async () => {
    if (!appointmentId || !selectedSlot) return;

    // Safety: prevent rescheduling to a booked slot
    if (selectedSlot.isBooked) {
      alert("This slot is already booked. Please choose another.");
      setSelectedSlot(null);
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('access_token');

    // Combine the date and time from the selected slot into an ISO string for Django
    const formattedDateTime = `${selectedSlot.date}T${selectedSlot.start_time}`;

    const payload = {
        start_time: formattedDateTime 
    };

    try {
        await api.patch(`appointments/${appointmentId}/`, payload, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        alert("Appointment rescheduled successfully!");
        router.push('/patient/dashboard');
    } catch (error) {
        if (error.response) {
            console.error("Update failed:", error.response.data);
            const errData = error.response.data;
            // Build a readable error message
            let msg = "Failed to reschedule:\n";
            if (typeof errData === 'object') {
              for (const key in errData) {
                const val = Array.isArray(errData[key]) ? errData[key].join(', ') : errData[key];
                msg += `• ${key}: ${val}\n`;
              }
            } else {
              msg += String(errData);
            }
            alert(msg);
        } else {
            console.error("Network error:", error);
            alert("Network error connecting to the server.");
        }
    } finally {
        setSubmitting(false);
    }
  };

  // --- HELPER FUNCTIONS FOR FORMATTING ---
  const formatDisplayDate = (dateString) => {
      const dateObj = new Date(dateString + 'T00:00:00'); // Force local timezone
      return dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDisplayTime = (timeString) => {
      const [hour, minute] = timeString.split(':');
      const dateObj = new Date();
      dateObj.setHours(parseInt(hour, 10));
      dateObj.setMinutes(parseInt(minute, 10));
      return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatTimeRange = (startTime, endTime) => {
      return `${formatDisplayTime(startTime)} – ${formatDisplayTime(endTime)}`;
  };

  // Count how many available (not booked) slots exist
  const totalAvailableSlots = Object.values(groupedAvailabilities)
    .flat()
    .filter(s => !s.isBooked).length;

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

        {/* --- LOADING STATE --- */}
        {initialLoading && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '20px', opacity: 0.8, fontFamily: 'sans-serif' }}>Loading appointment details...</div>
          </div>
        )}

        {/* --- ERROR STATE --- */}
        {fetchError && !initialLoading && (
          <div className={styles.glassCard} style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>⚠️</div>
            <div style={{ fontSize: '18px', marginBottom: '10px', fontFamily: 'sans-serif' }}>{fetchError}</div>
            <HoverButton
              onClick={() => router.push('/patient/dashboard')}
              style={{ background: 'white', color: '#333', padding: '10px 25px', marginTop: '15px' }}
              hoverStyle={{ background: '#e2e8f0' }}
            >
              Back to Dashboard
            </HoverButton>
          </div>
        )}

        {/* --- MAIN CONTENT --- */}
        {!initialLoading && !fetchError && (
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
                        <div style={{ opacity: 0.6, fontSize: '12px', marginBottom: '3px' }}>Original Date & Time</div>
                        <div style={{ fontWeight: 'bold', color: '#f87171', ...sensitiveStyle }}>
                            {currentAppointment ? new Date(currentAppointment.start_time).toLocaleString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Loading...'}
                        </div>
                    </div>
                    {currentAppointment?.service_details && (
                      <div>
                        <div style={{ opacity: 0.6, fontSize: '12px', marginBottom: '3px' }}>Service</div>
                        <div style={{ fontWeight: 'bold', ...sensitiveStyle }}>
                          {currentAppointment.service_details.name} ({currentAppointment.service_details.duration_minutes} min)
                        </div>
                      </div>
                    )}
                    <div>
                        <div style={{ opacity: 0.6, fontSize: '12px', marginBottom: '3px' }}>Status</div>
                        <div style={{
                          display: 'inline-block',
                          padding: '3px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          background: currentAppointment?.status === 'CONFIRMED' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                          color: currentAppointment?.status === 'CONFIRMED' ? '#4ade80' : '#fbbf24'
                        }}>
                          {currentAppointment?.status || '...'}
                        </div>
                    </div>
                </div>

                {/* Legend for slot colors */}
                <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', fontFamily: 'sans-serif', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '2px', opacity: 0.7 }}>Slot Legend</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}></div>
                    <span>Available</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#0ea5e9' }}></div>
                    <span>Selected</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px dashed rgba(255,255,255,0.15)' }}></div>
                    <span style={{ opacity: 0.5 }}>Already Booked</span>
                  </div>
                </div>
            </div>


            {/* --- RIGHT COLUMN: DYNAMIC AVAILABLE SLOTS --- */}
            <div className={styles.glassCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <h3 style={{ margin: 0, fontSize: '20px' }}>Select New Time</h3>
                  {totalAvailableSlots > 0 && (
                    <span style={{ fontSize: '13px', fontFamily: 'sans-serif', opacity: 0.6 }}>
                      {totalAvailableSlots} slot{totalAvailableSlots !== 1 ? 's' : ''} available
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '13px', opacity: 0.7, fontFamily: 'sans-serif', marginBottom: '30px' }}>Choose a new available slot for your appointment.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxHeight: '450px', overflowY: 'auto', paddingRight: '10px' }}>

                    {/* Check if we have availability data */}
                    {Object.keys(groupedAvailabilities).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0' }}>
                          <div style={{ fontSize: '36px', marginBottom: '10px' }}>📭</div>
                          <p style={{ color: '#ccc', fontStyle: 'italic', fontFamily: 'sans-serif' }}>No availability found for this therapist right now.</p>
                          <p style={{ color: '#999', fontSize: '13px', fontFamily: 'sans-serif' }}>Please check back later or contact the clinic.</p>
                        </div>
                    ) : (
                        // Map over the grouped dates
                        Object.entries(groupedAvailabilities).map(([dateStr, slots]) => (
                            <div key={dateStr}>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', borderLeft: '4px solid #0ea5e9', paddingLeft: '10px' }}>
                                    {formatDisplayDate(dateStr)}
                                </div>
                                
                                {/* Map over the specific times for that date */}
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    {slots.map((slot) => {
                                        const displayTime = formatDisplayTime(slot.start_time);
                                        const timeRange = formatTimeRange(slot.start_time, slot.end_time);
                                        const isSelected = selectedSlot && selectedSlot.id === slot.id;
                                        const isBooked = slot.isBooked;

                                        return (
                                            <HoverButton
                                                key={slot.id}
                                                onClick={() => !isBooked && setSelectedSlot({ ...slot, displayTime, timeRange })}
                                                disabled={isBooked}
                                                style={{
                                                    background: isBooked
                                                      ? 'rgba(255,255,255,0.05)'
                                                      : isSelected
                                                        ? '#0ea5e9'
                                                        : 'rgba(255,255,255,0.1)',
                                                    border: isBooked
                                                      ? '1px dashed rgba(255,255,255,0.15)'
                                                      : '1px solid rgba(255,255,255,0.2)',
                                                    color: isBooked ? 'rgba(255,255,255,0.3)' : 'white',
                                                    padding: '10px 18px',
                                                    borderRadius: '30px',
                                                    textDecoration: isBooked ? 'line-through' : 'none',
                                                    fontSize: '13px'
                                                }}
                                                hoverStyle={isBooked ? {} : { background: '#0ea5e9' }}
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
                <div style={{ marginTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '25px' }}>
                    {selectedSlot && (
                        <div style={{
                          background: 'rgba(14, 165, 233, 0.1)',
                          border: '1px solid rgba(14, 165, 233, 0.3)',
                          borderRadius: '12px',
                          padding: '15px 20px',
                          marginBottom: '20px',
                          fontFamily: 'sans-serif'
                        }}>
                          <div style={{ fontSize: '13px', opacity: 0.7, marginBottom: '5px' }}>Rescheduling to:</div>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#4ade80' }}>
                            {formatDisplayDate(selectedSlot.date)} · {selectedSlot.timeRange || selectedSlot.displayTime}
                          </div>
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px' }}>
                      <HoverButton
                        onClick={() => router.back()}
                        style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '12px 25px', borderRadius: '50px', fontSize: '14px' }}
                        hoverStyle={{ background: 'rgba(255,255,255,0.2)' }}
                      >
                        Cancel
                      </HoverButton>
                      <HoverButton
                          onClick={handleConfirm}
                          disabled={!selectedSlot || submitting}
                          style={{
                              background: 'white', color: '#333', padding: '12px 30px', borderRadius: '50px', fontSize: '16px'
                          }}
                          hoverStyle={{ background: '#e2e8f0' }}
                      >
                          {submitting ? 'Confirming...' : 'Confirm Reschedule'}
                      </HoverButton>
                    </div>
                </div>

            </div>
        </div>
        )}
      </div>
    </div>
  );
}