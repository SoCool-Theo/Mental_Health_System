'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../patient_dashboard.module.css'; 

export default function BookingPage() {
  const router = useRouter();
  const [privacyMode, setPrivacyMode] = useState(false);
  
  // --- DYNAMIC DATA STATES ---
  const [therapists, setTherapists] = useState([]);
  const [availabilities, setAvailabilities] = useState({});
  const [availableSpecialties, setAvailableSpecialties] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);
  const [locations, setLocations] = useState([]); // NEW: State for clinic locations
  const [patientProfileId, setPatientProfileId] = useState(null);

  // --- FILTER STATES ---
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [genderFilter, setGenderFilter] = useState('Any');
  const [focusAreaFilters, setFocusAreaFilters] = useState([]);

  // --- SELECTION STATES ---
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // NEW: Session Format States
  const [sessionFormat, setSessionFormat] = useState('Online'); // 'Online' or 'In-Person'
  const [selectedLocationId, setSelectedLocationId] = useState('');

  const [reason, setReason] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- PRIVACY BLUR STYLE ---
  const sensitiveStyle = {
    filter: privacyMode ? 'blur(3px)' : 'none',
    transition: 'all 0.3s ease',
    userSelect: privacyMode ? 'none' : 'text',
    opacity: privacyMode ? 0.8 : 1
  };

  // --- 1. FETCH DATA ON LOAD ---
  useEffect(() => {
    const fetchBookingData = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            // Fetch Therapists
            const docRes = await fetch('http://localhost:8000/api/users/therapists/', { headers });
            const docData = await docRes.json();
            const therapistList = docData.results || docData;
            setTherapists(therapistList);

            // Extract specialties
            const specialties = [...new Set(therapistList.map(t => t.specialization).filter(Boolean))];
            setAvailableSpecialties(specialties);

            // Fetch Availabilities
            const availMap = {};
            for (let doc of therapistList) {
                const availRes = await fetch(`http://localhost:8000/api/availability/?therapist_id=${doc.user.id}`, { headers });
                if (availRes.ok) {
                    const availData = await availRes.json();
                    availMap[doc.user.id] = availData.results || availData;
                }
            }
            setAvailabilities(availMap);

            // Fetch Services
            const serviceRes = await fetch('http://localhost:8000/api/services/', { headers });
            if (serviceRes.ok) {
                const serviceData = await serviceRes.json();
                const services = serviceData.results || serviceData;
                setAvailableServices(services);
                if (services.length > 0) setSelectedServiceId(services[0].id);
            }

            // NEW: Fetch Clinic Locations
            const locRes = await fetch('http://localhost:8000/api/locations/', { headers });
            if (locRes.ok) {
                const locData = await locRes.json();
                const activeLocations = (locData.results || locData).filter(loc => loc.is_active);
                setLocations(activeLocations);
                if (activeLocations.length > 0) setSelectedLocationId(activeLocations[0].id);
            }

            // Fetch Patient Profile
            const userRes = await fetch('http://localhost:8000/api/users/me/', { headers });
            if (userRes.ok) {
                const userData = await userRes.json();
                const profileRes = await fetch(`http://localhost:8000/api/patients/?user=${userData.id}`, { headers });
                if (profileRes.ok) {
                    const profileData = await profileRes.json();
                    const profiles = profileData.results || profileData;
                    if (profiles.length > 0) setPatientProfileId(profiles[0].id);
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchBookingData();
  }, []);

  const toggleFocusArea = (area) => {
    if (focusAreaFilters.includes(area)) {
        setFocusAreaFilters(focusAreaFilters.filter(a => a !== area));
    } else {
        setFocusAreaFilters([...focusAreaFilters, area]);
    }
  };

  // --- 2. FILTERING LOGIC ---
  const filteredTherapists = therapists.filter(doc => {
      const matchesSearch = `${doc.user?.first_name} ${doc.user?.last_name}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = specialtyFilter ? doc.specialization === specialtyFilter : true;
      const matchesGender = (genderFilter && genderFilter !== 'Any') ? doc.gender === genderFilter : true;

      const docFocusAreas = doc.focus_areas || [];
      const matchesFocusAreas = focusAreaFilters.length > 0
          ? focusAreaFilters.every(fa => docFocusAreas.includes(fa))
          : true;

      return matchesSearch && matchesSpecialty && matchesGender && matchesFocusAreas;
  });

  const formatTime = (timeString) => {
      if (!timeString) return '';
      const [hour, minute] = timeString.split(':');
      const dateObj = new Date();
      dateObj.setHours(parseInt(hour, 10));
      dateObj.setMinutes(parseInt(minute, 10));
      return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };
  const formatShortDate = (dateString) => {
      if (!dateString) return '';
      const d = new Date(dateString + 'T00:00:00');
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // --- 3. SUBMIT BOOKING ---
  const handleConfirmBooking = async () => {
    if (!selectedSlot || !agreed || !reason.trim()) return;

    const token = localStorage.getItem('access_token');
    const startDateTime = `${selectedSlot.date}T${selectedSlot.start_time}`;

    // Prepare payload
    const payload = {
        therapist: selectedTherapist.id,
        service: selectedServiceId,
        start_time: startDateTime,
        notes: reason,
        // Include the location if it's an in-person visit!
        ...(sessionFormat === 'In-Person' && { location: selectedLocationId })
    };

    try {
        const response = await fetch('http://localhost:8000/api/appointments/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            router.push('/patient/dashboard');
        } else {
            const errorData = await response.json();
            console.error("Booking failed. Django says:", errorData);
            alert("Failed to confirm booking: " + JSON.stringify(errorData));
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error. Is your Docker WSL backend running?");
    }
  };

  if (loading) return <div style={{ minHeight: '100vh', backgroundColor: '#333', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading providers...</div>;

  return (
    <div style={{ fontFamily: 'Times New Roman, serif', minHeight: '100vh', backgroundColor: '#333' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/first_background_homepage.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(30, 30, 30, 0.4)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', zIndex: 0 }}></div>

      <div style={{ position: 'relative', zIndex: 1, paddingTop: '120px', paddingBottom: '50px', paddingLeft: '60px', paddingRight: '60px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
                <h1 style={{ fontSize: '42px', fontWeight: 'normal', margin: 0 }}>Book a new appointment</h1>
                <div style={{ fontFamily: 'sans-serif', fontSize: '14px', opacity: 0.8 }}>
                    <span style={{ fontWeight: 'bold' }}>1 Filters</span> &nbsp;›&nbsp; 2 Choose therapist &nbsp;›&nbsp; 3 Confirm
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.2)', padding: '8px 15px', borderRadius: '30px', backdropFilter: 'blur(10px)' }}>
                <span style={{ fontSize: '14px', fontFamily: 'sans-serif', fontWeight: 'bold' }}>{privacyMode ? 'Privacy On' : 'Privacy Mode'}</span>
                <div onClick={() => setPrivacyMode(!privacyMode)} style={{ width: '40px', height: '20px', background: privacyMode ? '#4ade80' : '#ccc', borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}>
                    <div style={{ width: '16px', height: '16px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: privacyMode ? '22px' : '2px', transition: 'left 0.3s' }}></div>
                </div>
            </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>

            {/* ================= LEFT COLUMN: FILTERS ================= */}
            <div className={styles.glassCard} style={{ height: 'fit-content' }}>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Step 1 · Filters</h3>
                <p style={{ fontSize: '12px', opacity: 0.7, fontFamily: 'sans-serif', marginBottom: '25px' }}>Narrow down your therapist matches</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'sans-serif' }}>
                    <div>
                        <label style={{ fontSize: '12px', opacity: 0.8, display: 'block', marginBottom: '8px' }}>Specialty</label>
                        <select
                            value={specialtyFilter}
                            onChange={(e) => setSpecialtyFilter(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.3)', background: 'transparent', fontSize: '14px', color: 'white', outline: 'none' }}
                        >
                            <option value="" style={{ color: '#333' }}>Any Specialty</option>
                            {availableSpecialties.map(spec => (
                                <option key={spec} value={spec} style={{ color: '#333' }}>{spec}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', opacity: 0.8, display: 'block', marginBottom: '8px' }}>Focus areas</label>
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                            {['Anxiety', 'Depression', 'Stress & burnout','Therapy', 'Couple Therapy'].map(tag => {
                                const isSelected = focusAreaFilters.includes(tag);
                                return (
                                    <span
                                        key={tag}
                                        onClick={() => toggleFocusArea(tag)}
                                        style={{ background: isSelected ? '#0ea5e9' : 'white', color: isSelected ? 'white' : '#333', padding: '5px 10px', borderRadius: '15px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', border: isSelected ? '1px solid #0ea5e9' : '1px solid transparent' }}>
                                        {tag}
                                    </span>
                                )
                            })}
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', opacity: 0.8, display: 'block', marginBottom: '8px' }}>Therapist gender</label>
                        <select
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.3)', background: 'transparent', fontSize: '14px', color: 'white', outline: 'none' }}
                        >
                            <option value="Any" style={{ color: '#333' }}>Any</option>
                            <option value="Female therapist" style={{ color: '#333' }}>Female therapist</option>
                            <option value="Male therapist" style={{ color: '#333' }}>Male therapist</option>
                            <option value="Non-binary" style={{ color: '#333' }}>Non-binary</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', opacity: 0.8, display: 'block', marginBottom: '8px' }}>Session type</label>
                        <select
                            value={selectedServiceId}
                            onChange={(e) => setSelectedServiceId(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.3)', background: 'transparent', fontSize: '14px', color: 'white', outline: 'none' }}
                        >
                            {availableServices.map(service => (
                                <option key={service.id} value={service.id} style={{ color: '#333' }}>
                                    {service.name} ({service.duration_minutes} min)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* ================= RIGHT COLUMN: LIST & CONFIRM ================= */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* --- Step 2: Choose Therapist --- */}
                <div className={styles.glassCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Step 2 · Choose a therapist</h3>
                            <p style={{ fontSize: '12px', opacity: 0.7, fontFamily: 'sans-serif' }}>Showing matches based on your filters</p>
                        </div>
                        <input
                            type="text"
                            placeholder="🔍 Search by name"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ padding: '8px 15px', borderRadius: '20px', border: 'none', outline: 'none', color: '#333' }}
                        />
                    </div>

                    {filteredTherapists.length > 0 ? filteredTherapists.map(doctor => {
                        const docSlots = availabilities[doctor.user.id] || [];
                        const isSelectedDoc = selectedTherapist?.id === doctor.id;

                        return (
                            <div key={doctor.id} style={{
                                background: isSelectedDoc ? '#f0f9ff' : 'rgba(255,255,255,0.9)',
                                border: isSelectedDoc ? '2px solid #0ea5e9' : '2px solid transparent',
                                borderRadius: '12px', padding: '15px', color: '#333', marginBottom: '15px', display: 'flex', gap: '15px', transition: 'all 0.2s'
                            }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: '#ccc',
                                    backgroundImage: `url(${doctor.profile_image ? doctor.profile_image : '/medical-profile-default.png'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}></div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <h4 style={{ margin: 0, fontSize: '16px' }}>Dr. {doctor.user?.first_name} {doctor.user?.last_name}</h4>
                                        {docSlots.length > 0 && <span style={{ fontSize: '11px', background: '#eee', padding: '2px 8px', borderRadius: '4px' }}>Next available</span>}
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#666', margin: '0 0 10px 0', fontFamily: 'sans-serif' }}>Licensed therapist · {doctor.specialization || 'General Practice'}</p>

                                    <div style={{ display: 'flex', gap: '5px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                        {(doctor.focus_areas && doctor.focus_areas.length > 0) ? (
                                            doctor.focus_areas.map((fa, index) => (
                                                <span key={index} style={{ fontSize: '10px', border: '1px solid #ddd', padding: '2px 6px', borderRadius: '4px' }}>{fa}</span>
                                            ))
                                        ) : (
                                            <span style={{ fontSize: '10px', border: '1px solid #ddd', padding: '2px 6px', borderRadius: '4px' }}>Therapy</span>
                                        )}
                                    </div>

                                    <div style={{ fontSize: '11px', color: '#888', fontFamily: 'sans-serif' }}>Telehealth & In-Person · Rated 4.9/5</div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end', minWidth: '150px' }}>
                                     {docSlots.length > 0 ? (
                                         <>
                                             <div style={{ fontSize: '10px', color: '#666' }}>Available slots</div>
                                             {docSlots.slice(0, 1).map(slot => (
                                                <button
                                                    key={slot.id}
                                                    onClick={() => { setSelectedTherapist(doctor); setSelectedSlot(slot); }}
                                                    style={{ background: selectedSlot?.id === slot.id ? '#333' : 'white', color: selectedSlot?.id === slot.id ? 'white' : '#333', border: '1px solid #333', padding: '5px 10px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                                                    {formatShortDate(slot.date)} · {formatTime(slot.start_time)}
                                                </button>
                                             ))}

                                             {docSlots.length > 1 && (
                                                <>
                                                    <div style={{ fontSize: '10px', color: '#666', marginTop: '5px' }}>Or choose</div>
                                                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                                        {docSlots.slice(1, 3).map(slot => (
                                                            <button
                                                                key={slot.id}
                                                                onClick={() => { setSelectedTherapist(doctor); setSelectedSlot(slot); }}
                                                                style={{ background: selectedSlot?.id === slot.id ? '#333' : 'transparent', color: selectedSlot?.id === slot.id ? 'white' : '#333', border: '1px solid #ccc', padding: '3px 8px', borderRadius: '15px', fontSize: '10px', cursor: 'pointer' }}>
                                                                {formatShortDate(slot.date)} · {formatTime(slot.start_time)}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </>
                                             )}
                                         </>
                                     ) : (
                                         <div style={{ fontSize: '12px', color: '#999', fontStyle: 'italic', marginTop: '10px' }}>No available slots</div>
                                     )}
                                </div>
                            </div>
                        );
                    }) : (
                        <p style={{color: 'white', opacity: 0.7}}>No therapists match your filters.</p>
                    )}
                </div>


                {/* --- Step 3: Confirm Booking --- */}
                <div className={styles.glassCard} style={{ opacity: (!selectedTherapist || !selectedSlot) ? 0.5 : 1, pointerEvents: (!selectedTherapist || !selectedSlot) ? 'none' : 'auto' }}>
                    <div style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '15px', marginBottom: '15px' }}>
                         <h3 style={{ margin: '0', fontSize: '18px' }}>Step 3 · Confirm booking</h3>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'sans-serif', fontSize: '14px', marginBottom: '20px' }}>
                        <div>
                            <p style={{ opacity: 0.6, fontSize: '12px', marginBottom: '5px' }}>Confirm your session with</p>
                            <p style={{ fontSize: '16px', fontWeight: 'bold', ...sensitiveStyle }}>
                                {selectedTherapist ? `Dr. ${selectedTherapist.user?.first_name} ${selectedTherapist.user?.last_name}` : 'Select a therapist above'}
                            </p>
                        </div>
                        <div>
                            <span style={{ background: 'white', color: '#333', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' }}>
                                {availableServices.find(s => s.id == selectedServiceId)?.name || 'Therapy'}
                            </span>
                        </div>
                    </div>

                    {/* NEW: Format Selection Toggle */}
                    <div style={{ marginBottom: '20px', display: 'flex', gap: '15px', fontFamily: 'sans-serif' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                            <input
                                type="radio"
                                value="Online"
                                checked={sessionFormat === 'Online'}
                                onChange={() => setSessionFormat('Online')}
                            />
                            Telehealth (Online)
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                            <input
                                type="radio"
                                value="In-Person"
                                checked={sessionFormat === 'In-Person'}
                                onChange={() => setSessionFormat('In-Person')}
                            />
                            In-Person (Clinic)
                        </label>
                    </div>

                    {/* NEW: Location Dropdown (Only shows if In-Person) */}
                    {sessionFormat === 'In-Person' && (
                        <div style={{ marginBottom: '20px', fontFamily: 'sans-serif' }}>
                            <div style={{ opacity: 0.6, fontSize: '13px', marginBottom: '5px' }}>Select Clinic Location</div>
                            <select
                                value={selectedLocationId}
                                onChange={(e) => setSelectedLocationId(e.target.value)}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.3)', background: 'transparent', fontSize: '14px', color: 'white', outline: 'none' }}
                            >
                                {locations.map(loc => (
                                    <option key={loc.id} value={loc.id} style={{ color: '#333' }}>
                                        {loc.name} - {loc.address}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '13px', fontFamily: 'sans-serif', marginBottom: '25px' }}>
                        <div>
                            <div style={{ opacity: 0.6, marginBottom: '3px' }}>Date & time</div>
                            <div style={{ ...sensitiveStyle, fontWeight: 'bold' }}>
                                {selectedSlot ? `${formatShortDate(selectedSlot.date)} · ${formatTime(selectedSlot.start_time)}` : '--'}
                            </div>
                        </div>

                        {/* DYNAMIC: Session Link vs Room info */}
                        <div>
                            <div style={{ opacity: 0.6, marginBottom: '3px' }}>{sessionFormat === 'Online' ? 'Session link' : 'Check-in details'}</div>
                            <div>{sessionFormat === 'Online' ? 'Secure video link will appear here' : 'Please arrive 10 minutes early'}</div>
                        </div>

                        <div>
                            <div style={{ opacity: 0.6, marginBottom: '3px' }}>Reason for visit</div>
                            <input
                                type="text"
                                placeholder="E.g., Anxiety & low mood check-in"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.5)', color: 'white', width: '100%', outline: 'none', ...sensitiveStyle }}
                            />
                        </div>

                        {/* DYNAMIC: Location Summary */}
                        <div>
                            <div style={{ opacity: 0.6, marginBottom: '3px' }}>Location</div>
                            <div>
                                {sessionFormat === 'Online'
                                    ? 'Online · Join from a private space'
                                    : locations.find(l => l.id == selectedLocationId)?.name || 'Clinic'}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'sans-serif' }}>
                         <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', opacity: 0.8, cursor: 'pointer' }}>
                             <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
                             I agree to the 24-hour cancellation policy.
                         </label>

                         <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                             <button onClick={() => {setSelectedSlot(null); setSelectedTherapist(null);}} style={{ background: 'transparent', border: 'none', color: 'white', opacity: 0.7, cursor: 'pointer' }}>Back to slots</button>
                             <button
                                onClick={handleConfirmBooking}
                                disabled={!selectedSlot || !agreed || !reason.trim() || (sessionFormat === 'In-Person' && !selectedLocationId)}
                                style={{
                                    background: 'white', color: '#333', border: 'none', padding: '10px 25px', borderRadius: '8px',
                                    fontWeight: 'bold', cursor: (!selectedSlot || !agreed || !reason.trim() || (sessionFormat === 'In-Person' && !selectedLocationId)) ? 'not-allowed' : 'pointer',
                                    opacity: (!selectedSlot || !agreed || !reason.trim() || (sessionFormat === 'In-Person' && !selectedLocationId)) ? 0.5 : 1
                                }}>
                                ✔ Confirm booking
                             </button>
                         </div>
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
}