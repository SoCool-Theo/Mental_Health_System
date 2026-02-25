'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../api';
import '../../styles/Chat.css';

export default function DoctorMessagePage() {
  const router = useRouter();

  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const [sessionHover, setSessionHover] = useState(false);
  const [sendHover, setSendHover] = useState(false);

  // --- CHANGED TO DYNAMIC STATE ---
  const [patients, setPatients] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  const activePatient = patients.find(p => p.id === selectedId);

  // --- 1. FETCH REAL PATIENTS LIST ON LOAD ---
  useEffect(() => {
    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch from the new endpoint we just built
            const response = await api.get('users/patients-list/', config);

            setPatients(response.data);

            // Automatically select the first patient if the list isn't empty
            if (response.data.length > 0) {
                setSelectedId(response.data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch patients list:", error);
        } finally {
            setIsLoadingContacts(false);
        }
    };

    fetchPatients();
  }, []);

  // --- 2. AUTO-SCROLL ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // --- 3. FETCH MESSAGES & POLL ---
  useEffect(() => {
    if (!selectedId) return;

    let intervalId;

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const response = await api.get(`messages/${selectedId}/`, config);

            if (response.data) {
                setChatHistory(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    fetchMessages();
    intervalId = setInterval(fetchMessages, 3000);

    return () => clearInterval(intervalId);
  }, [selectedId]);


  // --- 4. HANDLE SENDING MESSAGES ---
  const handleSend = async (e) => {
    e.preventDefault();
    if(!inputText.trim() || !selectedId) return;

    const textToSend = inputText;
    setInputText("");

    try {
        const token = localStorage.getItem('access_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const payload = { content: textToSend };

        const response = await api.post(`messages/${selectedId}/`, payload, config);

        setChatHistory(prev => [...prev, response.data]);

    } catch (error) {
        console.error("Failed to send message:", error);
        alert("Failed to send message. Please check your connection.");
        setInputText(textToSend);
    }
  };

  const formatTime = (isoString) => {
      if (!isoString) return '';
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">

        {/* --- LEFT SIDEBAR --- */}
        <div className="chat-sidebar">
            <div className="chat-search-box">
                <div style={{position: 'relative'}}>
                    <span style={{position:'absolute', left:'10px', top:'10px', color:'#94a3b8'}}>🔍</span>
                    <input type="text" placeholder="Search patients..." className="search-input" />
                </div>
            </div>

            <div className="patient-list">
                <div style={{padding: '10px 16px', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8'}}>
                    INBOX ({patients.length} active)
                </div>

                {isLoadingContacts ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Loading patients...</div>
                ) : patients.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>No patients found in database.</div>
                ) : (
                    patients.map(p => (
                        <div
                            key={p.id}
                            className={`patient-item ${selectedId === p.id ? 'active' : ''}`}
                            onClick={() => setSelectedId(p.id)}
                        >
                            <div className="avatar-circle">
                                <img src={p.img || "https://i.pravatar.cc/150?img=12"} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                            </div>
                            <div className="patient-info">
                                <div className="patient-header">
                                    <span className="patient-name">{p.name}</span>
                                    <span className="msg-time">{p.time}</span>
                                </div>
                                <div className="msg-preview">{p.preview}</div>
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                    <span className="badge-pill">{p.tag}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* --- RIGHT MAIN CHAT --- */}
        <div className="chat-main">

            <div className="chat-header">
                {activePatient ? (
                    <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                        <div className="avatar-circle" style={{width:'45px', height:'45px'}}>
                            <img src={activePatient.img || "https://i.pravatar.cc/150?img=12"} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                        </div>
                        <div>
                            <div style={{fontWeight:'700', fontSize:'16px', color:'#1e293b'}}>{activePatient.name}</div>
                            <div style={{fontSize:'12px', color:'#64748b'}}>Telehealth · Patient</div>
                        </div>
                    </div>
                ) : (
                    <div style={{ fontWeight: 'bold', color: '#94a3b8' }}>Select a patient to start chatting</div>
                )}

                {/* OPEN SESSION BUTTON */}
                <button
                    onClick={() => router.push('/doctor/session')}
                    onMouseEnter={() => setSessionHover(true)}
                    onMouseLeave={() => setSessionHover(false)}
                    style={{
                        background: sessionHover ? '#e2e8f0' : '#f1f5f9',
                        border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '6px',
                        fontWeight: '600', color: '#475569', cursor: 'pointer',
                        display: 'flex', gap: '6px', alignItems: 'center', transition: 'all 0.2s'
                    }}
                >
                    <span style={{color: '#0f766e'}}>▶</span> Open Session Mode
                </button>
            </div>

            <div className="warning-banner">
                <span>⚠️</span>
                Remember: Do not share diagnosis details in chat. Use Session Notes for clinical data.
            </div>

            <div className="messages-area">

                {!activePatient ? (
                     <div style={{textAlign:'center', fontSize:'13px', color:'#94a3b8', marginTop:'20px'}}>Please select a patient from the sidebar.</div>
                ) : chatHistory.length === 0 ? (
                    <div style={{textAlign:'center', fontSize:'13px', color:'#94a3b8', marginTop:'20px'}}>No messages yet. Send a greeting!</div>
                ) : (
                    <>
                        <div style={{textAlign:'center', fontSize:'12px', color:'#94a3b8', margin:'10px 0'}}>Conversation History</div>
                        {chatHistory.map(msg => {
                            // If sender ID is the patient ID, they sent it. Otherwise, you sent it.
                            const isPatient = msg.sender === selectedId;
                            const senderClass = isPatient ? 'patient' : 'doctor';

                            return (
                                <div key={msg.id} className={`message-row ${senderClass}`}>
                                    <div className="bubble">
                                        {msg.content}
                                    </div>
                                    <div className="timestamp" style={{textAlign: isPatient ? 'left' : 'right'}}>
                                        {formatTime(msg.timestamp)}
                                    </div>
                                </div>
                            )
                        })}
                    </>
                )}
                {/* Invisible div to anchor the auto-scroll */}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
                <button type="button" style={{background:'none', border:'none', cursor:'pointer', fontSize:'20px', color:'#64748b'}}>📎</button>
                <input
                    type="text" className="input-field"
                    placeholder={activePatient ? `Type a message to ${activePatient.name.split(' ')[0]}...` : 'Select a patient...'}
                    value={inputText} onChange={(e) => setInputText(e.target.value)}
                    disabled={!selectedId}
                />
                <button type="button" style={{background:'none', border:'none', cursor:'pointer', fontSize:'20px', color:'#64748b'}}>☺</button>

                <button
                    type="submit"
                    className="send-btn"
                    disabled={!selectedId}
                    onMouseEnter={() => setSendHover(true)}
                    onMouseLeave={() => setSendHover(false)}
                    style={{ background: sendHover && selectedId ? '#115e59' : '#0f766e', transition: 'background 0.2s', opacity: selectedId ? 1 : 0.5 }}
                >
                    <span>Send</span> ✈
                </button>
            </form>

        </div>
    </div>
  );
}