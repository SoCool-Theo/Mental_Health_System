'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../api'; 

export default function PatientProfile({ params }) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id;

  const [notes, setNotes] = useState([]);
  const [patientName, setPatientName] = useState("Loading...");
  
  // --- NEW: Appointments State ---
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');

  const [diagnosis, setDiagnosis] = useState('');
  const [subjective, setSubjective] = useState('');
  const [observations, setObservations] = useState('');
  const [plan, setPlan] = useState('');
  const [saving, setSaving] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState(null); 

  const router = useRouter();

  // 1. Fetch History & Appointments
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // A. Fetch Patient Name
        const pResponse = await api.get(`patients/${patientId}/`, config);
        setPatientName(pResponse.data.full_name || pResponse.data.user_name);

        // B. Fetch Previous Notes
        const nResponse = await api.get('clinical-notes/', config);
        const myNotes = (nResponse.data.results || nResponse.data).filter(n => n.patient.toString() === patientId);
        setNotes(myNotes);

        // C. NEW: Fetch Appointments for this specific patient
        const aResponse = await api.get('appointments/', config);
        const allAppts = aResponse.data.results || aResponse.data;
        
        // Filter appointments belonging to this patient and sort newest first
        const patientAppts = allAppts
            .filter(a => a.patient.toString() === patientId)
            .sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
        
        setAppointments(patientAppts);
        
        // Auto-select the most recent appointment if creating a new note
        if (patientAppts.length > 0 && !editingNoteId) {
            setSelectedAppointmentId(patientAppts[0].id);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchDetails();
  }, [patientId, editingNoteId]);

  // 2. Submit New Note
  const handleSave = async (isDraft) => {
    // --- VALIDATION CHECK ---
    if (!selectedAppointmentId) {
        alert("⚠️ Please select an appointment to attach this note to.");
        return;
    }
    if (!diagnosis.trim() || !subjective.trim() || !observations.trim() || !plan.trim()) {
        alert("⚠️ Please fill in all fields (Diagnosis, Subjective, Observations, and Plan) before saving.");
        return; 
    }

    setSaving(true);
    try {
        const token = localStorage.getItem('access_token');
        
        // --- ADDED 'appointment' to payload ---
        const payload = {
            appointment: selectedAppointmentId, // Connects the OneToOneField!
            patient: patientId,
            diagnosis_code: diagnosis,
            subjective_analysis: subjective,
            observations: observations, 
            treatment_plan: plan,
            is_draft: isDraft
        };

        const headers = { headers: { Authorization: `Bearer ${token}` } };

        if (editingNoteId) {
            await api.put(`clinical-notes/${editingNoteId}/`, payload, headers);
        } else {
            await api.post('clinical-notes/', payload, headers);
        }

        if (isDraft) {
            alert("Draft saved successfully!");
            window.location.reload(); 
        } else {
            alert("Record Signed & Locked!");
            window.location.reload(); 
        }

    } catch (err) {
        console.error(err);
        if (err.response && err.response.data && err.response.data.appointment) {
             alert("Error: A clinical note already exists for this specific appointment.");
        } else {
             alert("Failed to save. Please check your inputs.");
        }
    } finally {
        setSaving(false);
    }
  };

  // 3. Load Draft into Form
  const handleLoadDraft = (note) => {
    if (!note.is_draft) {
        alert("You cannot edit a signed record.");
        return;
    }
    
    setEditingNoteId(note.id);
    setSelectedAppointmentId(note.appointment || ''); // Select the tied appointment
    setDiagnosis(note.diagnosis_code || '');
    setSubjective(note.subjective_analysis || '');
    setObservations(note.observations || ''); 
    setPlan(note.treatment_plan || '');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
        {/* LOCAL HEADER (Back Button + Patient Name) */}
        <div style={{ width:'100%', marginBottom:'20px', paddingBottom: '10px', borderBottom: '1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <button onClick={() => router.push('/doctor/patients')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'14px', color: '#666', display: 'flex', alignItems: 'center', gap: '5px' }}>
                ← Back to Directory
            </button>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{fontSize:'20px', color:'#999', fontWeight:'normal'}}>Session Notes ·</span>
                <h2 style={{fontSize:'20px', fontWeight:'bold', margin: 0}}>{patientName}</h2>
            </div>
            <div style={{width:'100px'}}></div> 
        </div>

        {/* SPLIT SCREEN LAYOUT */}
        <div style={{ display: 'flex', gap: '30px', flex: 1, overflow: 'hidden' }}>
            
            {/* LEFT: HISTORY */}
            <div className="card" style={{ flex: '0 0 35%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="card-header">
                    <div>
                        <span className="card-title">Patient History</span>
                        <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>Read-only summary of previous encounters.</div>
                    </div>                    
                </div>
                
                <div style={{ background: '#f1f9f4', borderRadius: '8px', padding: '15px', flex: 1, overflowY: 'auto' }}>
                    <div style={{ display:'flex', flexDirection:'column', gap:'10px'}}>
                        {notes.length === 0 && <p style={{color:'#999', padding: '10px'}}>No previous history found.</p>}
                        
                        {notes.map(note => (
                            <div 
                                key={note.id} 
                                onClick={() => handleLoadDraft(note)}
                                style={{
                                    padding:'15px', 
                                    background: editingNoteId === note.id ? '#ffffff' : '#ffffff',
                                    borderRadius:'8px', 
                                    borderLeft: note.is_draft ? '4px solid #cbd5e1' : '4px solid #4a6b5d',
                                    cursor: note.is_draft ? 'pointer' : 'default',
                                    border: editingNoteId === note.id ? '2px solid #4a6b5d' : 'none',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}
                            >
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                    <span style={{fontWeight:'bold', fontSize:'14px', color: '#000'}}>
                                        {new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                    </span>
                                    <span style={{
                                        background: note.is_draft ? '#f1f5f9' : '#dcfce7', color: note.is_draft ? '#64748b' : 'green',
                                        border: note.is_draft ? '1px solid #cbd5e1' : 'none', fontSize:'11px', fontWeight: '600', padding:'4px 10px', borderRadius:'6px'
                                    }}>
                                        {note.is_draft ? 'Draft' : 'Signed'}
                                    </span>
                                </div>
                                <div style={{fontSize:'12px', color:'#999', marginBottom:'8px', marginTop: '4px'}}>
                                    {note.diagnosis_code || "No diagnosis code"}
                                </div>
                                <p style={{fontSize:'13px', color:'#000', margin: 0, lineHeight: '1.4'}}>
                                    {note.subjective_analysis?.substring(0, 60)}...
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: CURRENT SESSION */}
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="card-header" style={{ alignItems: 'flex-start' }}>
                    <div>
                        <span className="card-title">{editingNoteId ? 'Edit Draft' : 'New Session Note'}</span>
                        <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>Clinical documentation for today's encounter.</div>
                    </div>
                    <span style={{ fontSize:'12px', color:'green', background: '#dcfce7', padding: '4px 8px', borderRadius: '12px', whiteSpace:'nowrap' }}>
                            ● Active
                    </span>
                </div>

                <div style={{display:'flex', flexDirection:'column', gap:'20px', flex: 1, overflowY: 'auto', paddingRight: '5px'}}>
                    
                    {/* NEW: Link to specific appointment Dropdown */}
                    <div>
                        <label style={{ display:'flex', justifyContent: 'space-between', alignItems: 'center', fontSize:'14px', fontWeight:'600', marginBottom:'5px', color:'#666' }}>
                            <span>Select Session</span>
                            <span style={{ fontWeight: '400', color: '#999', fontSize: '12px' }}>Required</span>
                        </label>
                        <select 
                            value={selectedAppointmentId}
                            onChange={(e) => setSelectedAppointmentId(e.target.value)}
                            disabled={!!editingNoteId} // Lock dropdown if editing an existing note
                            style={{width:'100%', padding:'12px', border:'1px solid #ddd', borderRadius:'6px', background: editingNoteId ? '#f1f5f9' : 'white'}}
                        >
                            <option value="" disabled>-- Choose an appointment --</option>
                            {appointments.map(appt => (
                                <option key={appt.id} value={appt.id}>
                                    {new Date(appt.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(appt.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - {appt.service_details?.name || 'Session'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Diagnosis Code */}
                    <div>
                        <label style={{ display:'flex', justifyContent: 'space-between', alignItems: 'center', fontSize:'14px', fontWeight:'600', marginBottom:'5px', color:'#666' }}>
                            <span>Diagnosis Code</span>
                            <span style={{ fontWeight: '400', color: '#999', fontSize: '12px' }}>Primary billing code</span>
                        </label>
                        <input className="form-input" placeholder="e.g. F41.1 Generalized Anxiety" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} style={{width:'100%', padding:'12px', border:'1px solid #ddd', borderRadius:'6px'}} />
                    </div>

                    {/* Subjective Analysis */}
                    <div>
                        <label style={{ display:'flex', justifyContent: 'space-between', alignItems: 'center', fontSize:'14px', fontWeight:'600', marginBottom:'5px', color:'#666' }}>
                            <span>Subjective Analysis</span>
                            <span style={{ fontWeight: '400', color: '#999', fontSize: '12px' }}>Patient report, mood, safety</span>
                        </label>
                        <textarea placeholder="Patient reports symptoms, stressors, and any changes since last session..." value={subjective} onChange={e => setSubjective(e.target.value)} style={{width:'100%', height:'100px', padding:'12px', border:'1px solid #ddd', borderRadius:'6px', fontFamily:'sans-serif', resize: 'vertical'}} />
                    </div>

                    {/* Therapist Observations */}
                    <div>
                        <label style={{ display:'flex', justifyContent: 'space-between', alignItems: 'center', fontSize:'14px', fontWeight:'600', marginBottom:'5px', color:'#666' }}>
                            <span>Therapist Observations</span>
                            <span style={{ fontWeight: '400', color: '#999', fontSize: '12px' }}>Objective clinical presentation</span>
                        </label>
                        <textarea placeholder="Document the patient's affect, behavior, and physical signs..." value={observations} onChange={e => setObservations(e.target.value)} style={{width:'100%', height:'100px', padding:'12px', border:'1px solid #ddd', borderRadius:'6px', fontFamily:'sans-serif', resize: 'vertical'}} />
                    </div>

                    {/* Treatment Plan */}
                    <div>
                        <label style={{ display:'flex', justifyContent: 'space-between', alignItems: 'center', fontSize:'14px', fontWeight:'600', marginBottom:'5px', color:'#666' }}>
                            <span>Treatment Plan</span>
                            <span style={{ fontWeight: '400', color: '#999', fontSize: '12px' }}>Interventions & homework</span>
                        </label>
                        <textarea placeholder="Document interventions used today, progress towards goals, and agreed-upon homework..." value={plan} onChange={e => setPlan(e.target.value)} style={{width:'100%', height:'100px', padding:'12px', border:'1px solid #ddd', borderRadius:'6px', fontFamily:'sans-serif', resize: 'vertical'}} />
                    </div>

                    {/* BUTTONS SECTION */}
                    <div style={{ marginTop:'auto', paddingTop:'24px', display:'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid #f1f5f9' }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: '1.5' }}>
                                ℹ️ Once you sign & lock this record, it becomes part of the permanent medical record and can no longer be edited.
                            </p>
                        </div>

                        <div style={{ display:'flex', justifyContent:'flex-end', gap: '12px' }}>
                            <button 
                                onClick={() => handleSave(true)} 
                                disabled={saving}
                                style={{ background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight:'600', fontSize: '14px', transition: 'all 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                            >
                                {saving ? 'Saving...' : 'Save Draft'}
                            </button>

                            <button 
                                onClick={() => handleSave(false)} 
                                disabled={saving}
                                style={{ background: '#4a6b5d', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight:'600', fontSize: '14px', opacity: saving ? 0.7 : 1, boxShadow: '0 2px 4px rgba(74, 107, 93, 0.2)' }}
                                onMouseOver={(e) => e.currentTarget.style.background = '#354f42'}
                                onMouseOut={(e) => e.currentTarget.style.background = '#4a6b5d'}
                            >
                                🔒 {saving ? 'Signing...' : 'Sign & Lock Record'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
}