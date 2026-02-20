'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/Chat.css'; 

export default function DoctorMessagePage() {
  const router = useRouter();
  
  // State
  const [selectedId, setSelectedId] = useState(1);
  const [inputText, setInputText] = useState('');
  
  // Hover States
  const [sessionHover, setSessionHover] = useState(false);
  const [sendHover, setSendHover] = useState(false);

  // Mock Data
  const patients = [
    { id: 1, name: 'Jamie Lee', img: '/profile1.jpg', time: '2:14 PM', preview: 'I have a presentation tomorrow...', tag: 'GAD · Weekly', unread: 2 },
    { id: 2, name: 'Marcus Brown', img: '/profile2.jpg', time: '1:48 PM', preview: 'Just confirming our in-person session...', tag: 'In person', unread: 0 },
    { id: 3, name: 'Aisha Patel', img: '/profile3.jpg', time: '11:22 AM', preview: 'I completed the homework you assigned...', tag: 'Telehealth', unread: 0 },
    { id: 4, name: 'Chris Nguyen', img: '/profile4.jpg', time: 'Yesterday', preview: 'I might be a few minutes late...', tag: 'Bi-weekly', unread: 0 },
  ];

  const messages = [
    { id: 1, sender: 'patient', text: 'Hi Dr., I have a big presentation tomorrow and my anxiety is really high today.', time: '2:10 PM' },
    { id: 2, sender: 'patient', text: 'I keep imagining everything going wrong and it\'s hard to focus.', time: '2:10 PM' },
    { id: 3, sender: 'doctor', text: 'Thanks for reaching out, Jamie. I\'m glad you messaged. Let\'s focus on coping strategies you can safely use today.', time: '2:12 PM' },
    { id: 4, sender: 'doctor', text: 'Can you try the breathing exercise we practiced and send me a quick note on how it feels after 5 minutes?', time: '2:13 PM' },
    { id: 5, sender: 'patient', text: 'Okay, I can do that. I just needed a reminder of what to focus on.', time: '2:14 PM' },
  ];

  const activePatient = patients.find(p => p.id === selectedId);

  const handleSend = (e) => {
    e.preventDefault();
    if(!inputText.trim()) return;
    console.log("Sending:", inputText);
    setInputText("");
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
                <div style={{padding: '10px 16px', fontSize: '11px', fontWeight: 'bold', color: '#94a3b8'}}>INBOX (5 active)</div>
                {patients.map(p => (
                    <div 
                        key={p.id} 
                        className={`patient-item ${selectedId === p.id ? 'active' : ''}`}
                        onClick={() => setSelectedId(p.id)}
                    >
                        <div className="avatar-circle">
                            <img src={p.img} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}} onError={(e)=>{e.target.style.display='none'}} /> 
                        </div>
                        <div className="patient-info">
                            <div className="patient-header">
                                <span className="patient-name">{p.name}</span>
                                <span className="msg-time">{p.time}</span>
                            </div>
                            <div className="msg-preview">{p.preview}</div>
                            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                <span className="badge-pill">{p.tag}</span>
                                {p.unread > 0 && (
                                    <span style={{background:'#0f766e', color:'white', fontSize:'10px', borderRadius:'50%', width:'18px', height:'18px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                                        {p.unread}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- RIGHT MAIN CHAT --- */}
        <div className="chat-main">
            
            <div className="chat-header">
                <div style={{display:'flex', gap:'12px', alignItems:'center'}}>
                    <div className="avatar-circle" style={{width:'45px', height:'45px'}}>
                        <img src={activePatient?.img} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}} onError={(e)=>{e.target.style.display='none'}}/>
                    </div>
                    <div>
                        <div style={{fontWeight:'700', fontSize:'16px', color:'#1e293b'}}>{activePatient?.name}</div>
                        <div style={{fontSize:'12px', color:'#64748b'}}>Telehealth · GAD · Last session Oct 20</div>
                    </div>
                </div>
                
                {/* OPEN SESSION BUTTON (LINKED) */}
                <button 
                    onClick={() => router.push('/doctor/session')} // LINKED HERE
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
                <div style={{textAlign:'center', fontSize:'12px', color:'#94a3b8', margin:'10px 0'}}>Today · 2:10 PM</div>
                {messages.map(msg => (
                    <div key={msg.id} className={`message-row ${msg.sender}`}>
                        <div className="bubble">
                            {msg.text}
                        </div>
                        <div className="timestamp" style={{textAlign: msg.sender === 'doctor' ? 'right' : 'left'}}>
                            {msg.time} · Read
                        </div>
                    </div>
                ))}
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
                <button type="button" style={{background:'none', border:'none', cursor:'pointer', fontSize:'20px', color:'#64748b'}}>📎</button>
                <input 
                    type="text" className="input-field" 
                    placeholder={`Type a message to ${activePatient?.name.split(' ')[0]}...`}
                    value={inputText} onChange={(e) => setInputText(e.target.value)}
                />
                <button type="button" style={{background:'none', border:'none', cursor:'pointer', fontSize:'20px', color:'#64748b'}}>☺</button>
                
                {/* SEND BUTTON HOVER */}
                <button 
                    type="submit" 
                    className="send-btn"
                    onMouseEnter={() => setSendHover(true)}
                    onMouseLeave={() => setSendHover(false)}
                    style={{ background: sendHover ? '#115e59' : '#0f766e', transition: 'background 0.2s' }}
                >
                    <span>Send</span> ✈
                </button>
            </form>

        </div>
    </div>
  );
}