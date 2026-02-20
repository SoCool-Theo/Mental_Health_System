'use client';

import { useState } from 'react';

export default function MessagesPage() {
  const [privacyMode, setPrivacyMode] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  // --- PRIVACY BLUR STYLE ---
  const sensitiveStyle = {
    filter: privacyMode ? 'blur(4px)' : 'none', 
    transition: 'all 0.3s ease',
    userSelect: privacyMode ? 'none' : 'text', 
    opacity: privacyMode ? 0.6 : 1 
  };

  // --- DUMMY DATA ---
  const contacts = [
    { id: 1, name: 'Dr. Alex Rivera', lastMsg: "Okay, I see. Let's explore that further...", time: '10:30 AM', unread: 0, active: true, img: '5' },
    { id: 2, name: 'Dr. Maya Chen', lastMsg: 'Sent an attachment', time: 'Yesterday', unread: 2, active: false, img: '3' },
    { id: 3, name: 'Support Team', lastMsg: 'Your booking is confirmed.', time: 'Mon', unread: 0, active: false, img: null },
    { id: 4, name: 'Dr. Sarah Smith', lastMsg: 'Please fill out the form.', time: 'Tue', unread: 0, active: false, img: '1' },
    { id: 5, name: 'Reception', lastMsg: 'Appointment rescheduled.', time: 'Wed', unread: 0, active: false, img: null },
  ];

  const chatHistory = [
    { id: 1, sender: 'them', text: "Hi Joe, just checking in before our session tomorrow. How have things been since last week?", time: '10:30 AM' },
    { id: 2, sender: 'me', text: "Hey Dr. Rivera. Honestly, still feeling quite anxious in the evenings.", time: '10:32 AM', read: true },
    { id: 3, sender: 'them', text: "Okay, I see. Let's explore that further in our session. Have you tried the grounding exercise we discussed?", time: '10:33 AM' },
    { id: 4, sender: 'me', text: "I tried a few times, but it's hard to focus.", time: '10:35 AM', read: true },
    { id: 5, sender: 'them', text: "That is completely normal. We can practice it together.", time: '10:36 AM' },
    { id: 6, sender: 'them', text: "Also, please bring your journal logs if you have them.", time: '10:36 AM' },
  ];


  return (
    <div style={{ fontFamily: 'Times New Roman, serif', minHeight: '100vh', backgroundColor: '#333' }}>
      
      {/* ================= FIXED BACKGROUND ================= */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/first_background_homepage.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(30, 30, 30, 0.5)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 0 }}></div>


      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div style={{ 
          position: 'relative', zIndex: 1, 
          minHeight: '100vh',      
          paddingTop: '120px',    
          paddingBottom: '50px',   
          paddingLeft: '5%', paddingRight: '5%',
          display: 'flex', flexDirection: 'column',
          color: 'white'
      }}>
        
        {/* --- PAGE HEADER --- */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '42px', fontWeight: 'normal', margin: 0 }}>Messages</h1>

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


        {/* --- THE MAIN GLASS INTERFACE BOX --- */}
        <div style={{
            height: '85vh', 
            minHeight: '800px', 
            background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)',
            borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'grid', gridTemplateColumns: '350px 1fr', 
            overflow: 'hidden', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}>

            {/* ================= LEFT SIDEBAR: CONTACTS ================= */}
            <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                
                {/* Search Bar */}
                <div style={{ padding: '20px', flexShrink: 0 }}>
                    <input type="text" placeholder="🔍 Search messages" style={{ width: '100%', padding: '12px 20px', borderRadius: '30px', border: 'none', background: 'rgba(255,255,255,0.2)', color: 'white', outline: 'none', fontFamily: 'sans-serif' }} />
                </div>

                {/* Scrollable Contact List */}
                <div style={{ flex: 1, overflowY: 'auto', fontFamily: 'sans-serif' }}>
                    {contacts.map(contact => (
                        <div key={contact.id} style={{ 
                            display: 'flex', gap: '15px', padding: '15px 20px', cursor: 'pointer',
                            background: contact.active ? 'rgba(255,255,255,0.15)' : 'transparent',
                            borderLeft: contact.active ? '4px solid white' : '4px solid transparent',
                            transition: 'background 0.2s'
                        }}>
                            {/* Avatar */}
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#ccc', backgroundImage: contact.img ? `url(https://i.pravatar.cc/150?img=${contact.img})` : 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', color: '#555' }}>
                                {contact.img ? '' : contact.name[0]}
                            </div>
                            
                            {/* Info */}
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{contact.name}</span>
                                    <span style={{ fontSize: '12px', opacity: 0.7 }}>{contact.time}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    
                                    {/* BLURRED PREVIEW */}
                                    <p style={{ margin: 0, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', ...sensitiveStyle }}>
                                        {contact.lastMsg}
                                    </p>

                                    {contact.unread > 0 && (
                                        <span style={{ background: '#ff5555', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px', marginLeft: '10px' }}>{contact.unread}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            {/* ================= RIGHT MAIN: CHAT WINDOW ================= */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'sans-serif' }}>
                
                {/* Chat Header */}
                <div style={{ padding: '15px 25px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundImage: 'url(https://i.pravatar.cc/150?img=5)', backgroundSize: 'cover' }}></div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>Dr. Alex Rivera</h3>
                            <span style={{ fontSize: '12px', color: '#4ade80' }}>● Active now</span>
                        </div>
                    </div>
                    <div style={{ fontSize: '24px', cursor: 'pointer', opacity: 0.7 }}>⋮</div>
                </div>

                {/* Message History (Scrollable Area) */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {chatHistory.map(msg => (
                        <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                            <div style={{ 
                                maxWidth: '70%', padding: '15px 20px', borderRadius: '20px',
                                background: msg.sender === 'me' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                                borderTopRightRadius: msg.sender === 'me' ? '5px' : '20px',
                                borderTopLeftRadius: msg.sender === 'them' ? '5px' : '20px'
                            }}>
                                {/* BLURRED MESSAGE CONTENT */}
                                <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5', ...sensitiveStyle }}>
                                    {msg.text}
                                </p>
                            </div>
                             <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {msg.time}
                                {msg.sender === 'me' && msg.read && <span style={{ color: '#4ade80' }}>✓✓</span>}
                             </div>
                        </div>
                    ))}

                </div>


                {/* Message Input Area (Fixed at bottom) */}
                <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '30px', padding: '5px 5px 5px 20px', display: 'flex', alignItems: 'center' }}>
                        <input 
                            type="text" 
                            placeholder="Type a message..." 
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '15px' }} 
                        />
                        <button style={{ background: 'transparent', border: 'none', fontSize: '24px', padding: '10px', cursor: 'pointer', opacity: 0.7 }}>📎</button>
                        <button style={{ background: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', cursor: 'pointer', color: '#333', marginLeft: '10px' }}>
                            ➤
                        </button>
                    </div>
                </div>

            </div>

        </div>

      </div>
    </div>
  );
}