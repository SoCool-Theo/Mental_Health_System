'use client'; // <--- Required for Next.js to use 'useState'

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Next.js version of useNavigat
import api from '../../api';        
import '../styles/Login.css'; // Add css desgin

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Send Credentials to Django
      const response = await api.post('token/', { username, password });
      
      // 2. Save Tokens (In LocalStorage for now)
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // 3. Redirect to Dashboard
      router.push('/doctor/dashboard');

    } catch (err) {
      console.error(err);
      setError('Invalid Username or Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1 className="lyfe-title">LYFE</h1>
      
      <div className="login-card">
        <form onSubmit={handleLogin}>
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

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}