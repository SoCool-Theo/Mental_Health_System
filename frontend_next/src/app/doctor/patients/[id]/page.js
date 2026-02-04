'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../api'; 


export default function PatientProfile({ params }) {
  const resolvedParams = use(params);
  const patientId = resolvedParams.id;

  const [notes, setNotes] = useState([]);
  const [patientName, setPatientName] = useState("Loading...");
  
  const [diagnosis, setDiagnosis] = useState('');
  const [subjective, setSubjective] = useState('');
  const [plan, setPlan] = useState('');
  const [saving, setSaving] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState(null); // Null = New Note, ID = Editing

  const router = useRouter();

  // 1. Fetch History
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const pResponse = await api.get('patients/', config);
        const pList = pResponse.data.results || pResponse.data;
        const currentP = pList.find(p => p.id.toString() === patientId);
        if (currentP) setPatientName(currentP.full_name || currentP.user_name);

        const nResponse = await api.get('notes/', config);
        const myNotes = (nResponse.data.results || nResponse.data).filter(n => n.patient.toString() === patientId);
        setNotes(myNotes);

      } catch (err) {
        console.error(err);
      }
    };
    fetchDetails();
  }, [patientId]);

  // 2. Submit New Note
  const handleSave = async (isDraft) => {
    // --- 1. VALIDATION CHECK ---
   
    if (!diagnosis.trim() || !subjective.trim() || !plan.trim()) {
        alert("⚠️ Please fill in all fields (Diagnosis, Subjective, and Plan) before saving.");
        return; // <--- STOP! Don't go further.
    }
    // ------------------------------------------

    setSaving(true);
    try {
        const token = localStorage.getItem('access_token');
        const payload = {
            patient: patientId,
            diagnosis_code: diagnosis,
            subjective_analysis: subjective,
            treatment_plan: plan,
            is_draft: isDraft
        };

        const headers = { headers: { Authorization: `Bearer ${token}` } };

        if (editingNoteId) {
            // UPDATE EXISTING
            await api.put(`notes/${editingNoteId}/`, payload, headers);
        } else {
            // CREATE NEW
            await api.post('notes/', payload, headers);
        }

        if (isDraft) {
            alert("Draft saved successfully!");
            window.location.reload(); 
        } else {
            alert("Record Signed & Locked!");
            window.location.reload(); 
        }

    } catch (err) {
        // If the server still complains (e.g. invalid diagnosis code), catch it here
        console.error(err);
        if (err.response && err.response.status === 400) {
             alert("Error: The server rejected this note. Please check your inputs.");
        } else {
             alert("Failed to save. Please try again.");
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
    setDiagnosis(note.diagnosis_code || '');
    setSubjective(note.subjective_analysis || '');
    setPlan(note.treatment_plan || '');
    setEditingNoteId(note.id); // <--- Important: We are now editing THIS note
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
        {/* LOCAL HEADER (Back Button + Patient Name) */}
        <div style={{
            width:'100%', marginBottom:'20px', paddingBottom: '10px', borderBottom: '1px solid #eee',
            display:'flex', justifyContent:'space-between', alignItems:'center'
        }}>
            <button onClick={() => router.push('/doctor/patients')} style={{
                background:'none', border:'none', cursor:'pointer', fontSize:'14px', color: '#666', display: 'flex', alignItems: 'center', gap: '5px'
            }}>
                ← Back to Directory
            </button>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{fontSize:'20px', color:'#999', fontWeight:'normal'}}>Session Notes ·</span>
                <h2 style={{fontSize:'20px', fontWeight:'bold', margin: 0}}>{patientName}</h2>
            </div>
            <div style={{width:'100px'}}></div> {/* Spacer to center the title */}
        </div>

        {/* SPLIT SCREEN LAYOUT */}
        <div style={{ display: 'flex', gap: '30px', flex: 1, overflow: 'hidden' }}>
            
            {/* LEFT: HISTORY */}
            <div className="card" style={{ flex: '0 0 35%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="card-header">
                    <div>
                        <span className="card-title">Patient History</span>
                        <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>
                            Read-only summary of previous encounters.
                        </div>
                    </div>                    
                </div>
                
                {/* BLUE BACKGROUND CONTAINER */}
                <div style={{
                    background: '#f1f5f9', // Light blue background
                    borderRadius: '8px',
                    padding: '15px',
                    flex: 1,
                    overflowY: 'auto'
                }}>
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
                                    borderLeft: note.is_draft ? '4px solid #cbd5e1' : '4px solid #2c7da0',
                                    cursor: note.is_draft ? 'pointer' : 'default',
                                    border: editingNoteId === note.id ? '2px solid #2c7da0' : 'none',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}
                            >
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                    <span style={{fontWeight:'bold', fontSize:'14px', color: '#000'}}>
                                        {new Date(note.created_at).toLocaleDateString('en-US', { 
                                            month: 'short',  // "Oct"
                                            day: '2-digit',  // "20"
                                            year: 'numeric'  // "2024"
                                        })}
                                    </span>
                                    <span style={{
                                        background: note.is_draft ? '#f1f5f9' : '#dcfce7', 
                                        color: note.is_draft ? '#64748b' : 'green',
                                        border: note.is_draft ? '1px solid #cbd5e1' : 'none',
                                        fontSize:'11px',
                                        fontWeight: '600', 
                                        padding:'4px 10px', 
                                        borderRadius:'6px'
                                    }}>
                                        {note.is_draft ? 'Draft' : 'Signed'}
                                    </span>
                                </div>
                                
                                {/* Session info line */}
                                <div style={{fontSize:'12px', color:'#999', marginBottom:'8px'}}>
                                    Session 8 · CBT follow-up
                                </div>
                                
                                {/* Note content */}
                                <p style={{fontSize:'13px', color:'#000', margin: 0, lineHeight: '1.4'}}>
                                    {note.subjective_analysis}
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
                        <span className="card-title">Current Session Note</span>
                        <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>
                            Clinical documentation for today's encounter.
                        </div>
                    </div>
                    <span style={{
                        fontSize:'12px', 
                        color:'green', 
                        background: '#dcfce7', 
                        padding: '4px 8px', 
                        borderRadius: '12px',
                        whiteSpace:'nowrap'
                        }}>
                            ● In Session
                    </span>
                </div>

                <div style={{display:'flex', flexDirection:'column', gap:'20px', flex: 1, overflowY: 'auto'}}>
                    {/* INPUTS */}
                    <div>
                        <label style={{
                            display:'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center', 
                            fontSize:'14px', 
                            fontWeight:'600', 
                            marginBottom:'5px',
                            color:'#666'
                        }}>
                            <span>Diagnosis Code</span>
                            <span style={{
                                fontWeight: '400', 
                                color: '#999',   
                                fontSize: '12px'   
                            }}>
                                Primary billing code
                            </span>
                        </label>
                        <input 
                            className="form-input" 
                            placeholder="e.g. F41.1 Generalized Anxiety"
                            value={diagnosis}
                            onChange={e => setDiagnosis(e.target.value)}
                            style={{width:'100%', padding:'12px', border:'1px solid #ddd', borderRadius:'6px'}} 
                        />
                    </div>

                    <div>
                        <label style={{
                            display:'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center', 
                            fontSize:'14px', 
                            fontWeight:'600',
                            marginBottom:'5px', 
                            color:'#666'
                        }}>
                            <span>Subjective Analysis</span>
                            <span style={{
                                fontWeight: '400', 
                                color: '#999',   
                                fontSize: '12px'   
                            }}>
                                Patient report, mood, safety
                            </span>
                        </label>
                        <textarea 
                            placeholder="Patient reports symptoms, stressors, and any changes since last session..."
                            value={subjective}
                            onChange={e => setSubjective(e.target.value)}
                            style={{width:'100%', height:'120px', padding:'12px', border:'1px solid #ddd', borderRadius:'6px', fontFamily:'sans-serif', resize: 'vertical'}} 
                        />
                    </div>

                    <div>
                        <label style={{
                            display:'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize:'14px', 
                            fontWeight:'600', 
                            marginBottom:'5px', 
                            color:'#666'
                        }}>
                            <span>Treatment Plan</span>
                            <span style={{
                                fontWeight: '400', 
                                color: '#999',   
                                fontSize: '12px'   
                            }}>
                                Interventions & homework
                            </span>
                        </label>
                        <textarea 
                            placeholder="Document interventions used today, progress towards goals, and agree-upon homework..."
                            value={plan}
                            onChange={e => setPlan(e.target.value)}
                            style={{width:'100%', height:'120px', padding:'12px', border:'1px solid #ddd', borderRadius:'6px', fontFamily:'sans-serif', resize: 'vertical'}} 
                        />
                    </div>

                    {/* NEW BUTTONS SECTION */}
                    <div style={{
                        marginTop:'auto', 
                        paddingTop:'24px', 
                        display:'flex', 
                        flexDirection: 'column',
                        gap: '12px',
                        borderTop: '1px solid #f1f5f9' 
                    }}>
                        {/* INFORMATION MESSAGE */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            background: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0'
                        }}>
                            <iconify-icon 
                                icon="lucide:info" 
                                style={{fontSize:'20px', color:'#64748b', flexShrink: 0}}
                            ></iconify-icon>
                            <p style={{
                                fontSize: '13px', 
                                color: '#64748b', 
                                margin: 0,
                                lineHeight: '1.5'
                            }}>
                                Once you sign & lock this record, it becomes part of the permanent medical record and can no longer be edited.
                            </p>
                        </div>

                        {/* BUTTONS ROW */}
                        <div style={{
                            display:'flex', 
                            justifyContent:'flex-end', 
                            gap: '12px'
                        }}>
                        
                        {/* 1. SAVE DRAFT BUTTON (Gray) */}
                        <button 
                            onClick={() => handleSave(true)} 
                            disabled={saving}
                            style={{
                                background: '#f1f5f9', 
                                color: '#334155', 
                                border: '1px solid #e2e8f0', 
                                padding: '10px 20px', 
                                borderRadius: '8px', 
                                cursor: 'pointer', 
                                fontWeight:'600',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}
                        >
                            <iconify-icon icon="lucide:file-text" style={{fontSize:'16px'}}></iconify-icon>
                            <span>Save Draft</span>
                        </button>

                        {/* 2. SIGN & LOCK BUTTON (Blue) */}
                        <button 
                            onClick={() => handleSave(false)} 
                            disabled={saving}
                            style={{
                                background: '#0e7490', 
                                color: 'white', 
                                border: 'none', 
                                padding: '10px 20px', 
                                borderRadius: '8px', 
                                cursor: 'pointer', 
                                fontWeight:'600',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                opacity: saving ? 0.7 : 1,
                                boxShadow: '0 2px 4px rgba(14, 116, 144, 0.2)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#155e75'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#0e7490'}
                        >
                            <iconify-icon icon="lucide:lock" style={{fontSize:'16px'}}></iconify-icon>
                            <span>{saving ? 'Signing...' : 'Sign & Lock Record'}</span>
                        </button>
                    </div>
                </div>
                </div>
            </div>

        </div>
    </div>
  );
}