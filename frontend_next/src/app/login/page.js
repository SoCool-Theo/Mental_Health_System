'use client'; 

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import api from '../../api';        
import '../styles/Login.css'; 

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [errorMessage, setErrorMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(''); 

    try {
      const res = await api.post('token/', { username, password });
      
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);

      // Check User Role
      const userRes = await api.get('users/me/', {
        headers: { Authorization: `Bearer ${res.data.access}` }
      });

      const user = userRes.data;

      // --- LOGIC UPDATED FOR 3 ROLES ---
      // We prioritize the checks: Superuser -> Staff -> Patient
      
      if (user.is_superuser) {
          // 1. Admin / Superuser
          router.push('/admin/dashboard'); 

      } else if (user.is_staff) {
          // 2. Doctor / Staff
          router.push('/doctor/dashboard');

      } else {
          // 3. Patient (Default)
          router.push('/patient/homepage');
      }
      // ---------------------------------

    } catch (error) {
      console.error("Login Error:", error);

      if (error.response && error.response.status === 401) {
        setErrorMessage("Wrong username or password. Please try again.");
      } else {
        setErrorMessage("Something went wrong. Please check your connection.");
      }
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="lyfe-title">LYFE</h1>
      
      <div className="login-card">
        <form onSubmit={handleLogin}>
            
          {errorMessage && (
            <div className="error-msg">
                {errorMessage}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}