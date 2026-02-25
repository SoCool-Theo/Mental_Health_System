'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../api';

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null); // Reference to the hidden file input

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: 'Prefer not to say',
    email: '',
    phone: '',
    address: ''
  });

  // --- NEW STATES FOR IMAGE UPLOAD ---
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("https://i.pravatar.cc/150?img=12");

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const headers = { 'Authorization': `Bearer ${token}` };

            const response = await api.get('users/me/', { headers });
            const data = response.data;

            setFormData({
                fullName: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                email: data.email || '',
                phone: data.phone || '',
                dob: data.dob || '',
                gender: data.gender || 'Prefer not to say',
                address: data.address || ''
            });

            // --- DYNAMIC IMAGE URL ---
            if (data.profile_image) {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
                const imgUrl = data.profile_image.startsWith('http')
                    ? data.profile_image
                    : `${backendUrl}${data.profile_image}`;
                setImagePreview(imgUrl);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchProfileData();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --- NEW: HANDLE IMAGE SELECTION ---
  const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          setImageFile(file); // Save file to send to backend
          setImagePreview(URL.createObjectURL(file)); // Update UI preview instantly
      }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('access_token');

    // IMPORTANT: When sending files, DO NOT set 'Content-Type': 'application/json'
    // The browser will automatically set 'multipart/form-data' with the correct boundary.
    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const nameParts = formData.fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // --- CHANGED TO FormData() FOR FILE UPLOAD ---
    const payload = new FormData();
    payload.append('first_name', firstName);
    payload.append('last_name', lastName);
    payload.append('email', formData.email);
    payload.append('phone', formData.phone);
    payload.append('dob', formData.dob);
    payload.append('gender', formData.gender);
    payload.append('address', formData.address);

    // Only append the image if they actually selected a new one
    if (imageFile) {
        payload.append('profile_image', imageFile);
    }

    try {
        await api.patch('users/me/', payload, { headers });

        alert("Profile updated successfully!");
        // Optional: refresh the page to sync the top navbar image instantly
        window.location.reload();
    } catch (error) {
        if (error.response) {
            console.error("Save error:", error.response.data);
            alert("Failed to update profile.");
        } else {
            console.error("Network error:", error);
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) return <div style={{ minHeight: '100vh', backgroundColor: '#333', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;

  return (
    <div style={{ fontFamily: 'Times New Roman, serif', minHeight: '100vh', backgroundColor: '#333' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "url('/first_background_homepage.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(30, 30, 30, 0.5)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 0 }}></div>

      <div style={{ position: 'relative', zIndex: 1, paddingTop: '120px', paddingBottom: '60px', paddingLeft: '5%', paddingRight: '5%', color: 'white', maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'flex-end', gap: '30px' }}>
        <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}>

            <h2 style={{ fontSize: '32px', fontWeight: 'normal', marginBottom: '25px', marginTop: 0 }}>Personal details</h2>

            {/* --- NEW: PROFILE PICTURE UPLOAD UI --- */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px', marginBottom: '35px' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.5)' }}>
                    <img src={imagePreview} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                    {/* Hidden file input */}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />
                    <button
                        onClick={() => fileInputRef.current.click()} // Trigger the hidden input
                        style={{
                            background: 'white', color: '#333', border: 'none', padding: '10px 20px', borderRadius: '8px',
                            fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'sans-serif'
                        }}
                    >
                        Change Photo
                    </button>
                    <p style={{ fontSize: '12px', opacity: 0.6, marginTop: '8px', fontFamily: 'sans-serif' }}>JPG, GIF or PNG. Max size of 2MB.</p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px', fontFamily: 'sans-serif' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)', outline: 'none' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)', outline: 'none' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)', outline: 'none' }}>
                        <option value="Prefer not to say">Prefer not to say</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                    </select>
                </div>
            </div>

            <h2 style={{ fontSize: '32px', fontWeight: 'normal', marginBottom: '25px' }}>Contact</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px', fontFamily: 'sans-serif' }}>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Email address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)', outline: 'none' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)', outline: 'none' }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', opacity: 0.9 }}>Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', fontSize: '15px', color: '#333', background: 'rgba(255,255,255,0.9)', outline: 'none' }} />
                </div>
            </div>
        </div>

        {/* BUTTONS BESIDE THE BOX, ALIGNED TO BOTTOM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '10px' }}>
            <button
                onClick={handleSave}
                disabled={isSubmitting}
                style={{ background: 'white', color: '#333', border: 'none', padding: '15px 30px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', fontFamily: 'Times New Roman, serif', cursor: isSubmitting ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', opacity: isSubmitting ? 0.7 : 1, whiteSpace: 'nowrap' }}
            >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
                onClick={() => router.push('/patient/dashboard')}
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '15px 30px', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
                Discard Changes
            </button>
        </div>
      </div>
    </div>
  );
}