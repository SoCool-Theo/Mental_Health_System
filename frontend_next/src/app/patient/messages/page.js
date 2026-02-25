'use client';

import { useState, useRef, useEffect } from 'react';
import api from '../../../api';

export default function MessagesPage() {
  const [privacyMode, setPrivacyMode] = useState(false);
  const [messageInput, setMessageInput] = useState('');

  // --- AUTOSCROLL REF ---
  const messagesEndRef = useRef(null);

  // --- PRIVACY BLUR STYLE ---
  const sensitiveStyle = {
    filter: privacyMode ? 'blur(4px)' : 'none',
    transition: 'all 0.3s ease',
    userSelect: privacyMode ? 'none' : 'text',
    opacity: privacyMode ? 0.6 : 1
  };

  // --- DYNAMIC CONTACTS STATES ---
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  // --- 1. FETCH ASSIGNED DOCTORS ON LOAD ---
  useEffect(() => {
    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const response = await api.get('users/doctors-list/', config);

            setContacts(response.data);

            if (response.data.length > 0) {
                setActiveContact(response.data[0]);
            }
        } catch (error) {
            console.error("Failed to fetch doctors list:", error);
        } finally {
            setIsLoadingContacts(false);
        }
    };

    fetchDoctors();
  }, []);

  // --- 2. AUTO-SCROLL TO BOTTOM ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // --- 3. FETCH MESSAGES & POLL EVERY 3 SECONDS ---
  useEffect(() => {
    if (!activeContact) return;

    let intervalId;

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const response = await api.get(`messages/${activeContact.id}/`, config);

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
  }, [activeContact]);


  // --- 4. HANDLE SENDING MESSAGES ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeContact) return;

    const textToSend = messageInput;
    setMessageInput('');

    try {
        const token = localStorage.getItem('access_token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const payload = { content: textToSend };

        const response = await api.post(`messages/${activeContact.id}/`, payload, config);

        setChatHistory(prev => [...prev, response.data]);

    } catch (error) {
        console.error("Failed to send message:", error);
        alert("Failed to send message. Please check your connection.");
        setMessageInput(textToSend);
    }
  };

  const formatTime = (isoString) => {
      if (!isoString) return '';
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // --- 5. CALCULATE DOCTOR'S ONLINE STATUS ---
  const getOnlineStatus = () => {
      if (!activeContact || chatHistory.length === 0) {
          return { text: 'Offline', color: '#888' }; // Default if no messages
      }

      // Find the last message the DOCTOR sent
      const lastDoctorMsg = [...chatHistory].reverse().find(msg => msg.sender === activeContact.id);

      if (!lastDoctorMsg) {
          return { text: 'Offline', color: '#888' };
      }

      const msgTime = new Date(lastDoctorMsg.timestamp).getTime();
      const now = new Date().getTime();
      const diffInMinutes = (now - msgTime) / (1000 * 60);

      // If they sent a message in the last 5 minutes, they are active!
      if (diffInMinutes < 5) {
          return { text: 'Active now', color: '#4ade80' };
      } else if (diffInMinutes < 60) {
          return { text: `Active ${Math.floor(diffInMinutes)}m ago`, color: '#ccc' };
      } else {
          return { text: 'Offline', color: '#888' };
      }
  };

  const currentStatus = getOnlineStatus();

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
                    {isLoadingContacts ? (
                        <div style={{ padding: '20px', textAlign: 'center', opacity: 0.7, fontSize: '14px' }}>Loading doctors...</div>
                    ) : contacts.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', opacity: 0.7, fontSize: '14px' }}>No assigned doctors found.</div>
                    ) : (
                        contacts.map(contact => (
                            <div
                                key={contact.id}
                                onClick={() => setActiveContact(contact)}
                                style={{
                                    display: 'flex', gap: '15px', padding: '15px 20px', cursor: 'pointer',
                                    background: activeContact?.id === contact.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                                    borderLeft: activeContact?.id === contact.id ? '4px solid white' : '4px solid transparent',
                                    transition: 'background 0.2s'
                                }}
                            >
                                {/* Avatar */}
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#ccc', backgroundImage: contact.img ? `url(${contact.img})` : 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', color: '#555', backgroundSize: 'cover' }}>
                                    {contact.img ? '' : contact.name[0]}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '15px' }}>{contact.name}</span>
                                        <span style={{ fontSize: '12px', opacity: 0.7 }}>{contact.time}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                                        <p style={{ margin: 0, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', ...sensitiveStyle }}>
                                            {contact.lastMsg}
                                        </p>

                                        {contact.unread > 0 && (
                                            <span style={{ background: '#ff5555', fontSize: '11px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px', marginLeft: '10px' }}>{contact.unread}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ================= RIGHT MAIN: CHAT WINDOW ================= */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'sans-serif' }}>

                {/* Chat Header */}
                <div style={{ padding: '15px 25px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundImage: activeContact?.img ? `url(${activeContact.img})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#ccc' }}></div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '16px' }}>{activeContact?.name || 'Select a doctor'}</h3>

                            {/* --- DYNAMIC ONLINE STATUS --- */}
                            <span style={{ fontSize: '12px', color: currentStatus.color, transition: 'color 0.3s' }}>
                                ● {currentStatus.text}
                            </span>
                        </div>
                    </div>
                    <div style={{ fontSize: '24px', cursor: 'pointer', opacity: 0.7 }}>⋮</div>
                </div>

                {/* Message History (Scrollable Area) */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '25px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {!activeContact ? (
                        <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '20px' }}>Please select a doctor to start messaging.</div>
                    ) : chatHistory.length === 0 ? (
                        <div style={{ textAlign: 'center', opacity: 0.5, marginTop: '20px' }}>No messages yet. Say hello!</div>
                    ) : (
                        chatHistory.map(msg => {
                            // If sender ID matches the doctor's ID, they sent it
                            const isThem = msg.sender === activeContact.id;

                            return (
                                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isThem ? 'flex-start' : 'flex-end' }}>
                                    <div style={{
                                        maxWidth: '70%', padding: '15px 20px', borderRadius: '20px',
                                        background: isThem ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.25)',
                                        borderTopRightRadius: isThem ? '20px' : '5px',
                                        borderTopLeftRadius: isThem ? '5px' : '20px'
                                    }}>
                                        <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5', ...sensitiveStyle }}>
                                            {msg.content}
                                        </p>
                                    </div>
                                    <div style={{ fontSize: '11px', opacity: 0.6, marginTop: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        {formatTime(msg.timestamp)}
                                    </div>
                                </div>
                            );
                        })
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Message Input Area (Fixed at bottom) */}
                <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '30px', padding: '5px 5px 5px 20px', display: 'flex', alignItems: 'center' }}>

                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            disabled={!activeContact}
                            style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '15px' }}
                        />

                        {/* SEND BUTTON (Attachment icon removed!) */}
                        <button type="submit" disabled={!activeContact} style={{ background: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', cursor: 'pointer', color: '#333', marginLeft: '10px' }}>
                            ➤
                        </button>
                    </div>
                </form>

            </div>
        </div>
      </div>
    </div>
  );
}