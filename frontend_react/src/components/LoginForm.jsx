import { useState } from "react";
import api from "../api";
import "./Login.css"; // Import the new styles

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("token/", { username, password });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      onLoginSuccess();
    } catch (err) {
      console.error("Login Error", err);
      setError("Invalid Username or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-root-login">
      {/* HEADER with LYFE Logo */}
      <div className="login-header-center">
        <h1 className="lyfe-title">LYFE</h1>
      </div>

      <div className="login-shell">
        <div className="login-card">
          
          <div className="login-title-group">
            <div className="login-title">Sign in to your dashboard</div>
            <div className="login-subtitle">
              Manage appointments, patients, and clinic schedules.
            </div>
          </div>

          {/* Actual Form Logic Starts Here */}
          <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input-field"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input-field"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Error Message Display */}
            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="button-primary" disabled={loading}>
              {loading ? (
                <span>Loading...</span>
              ) : (
                <>
                  <iconify-icon icon="lucide:log-in" style={{ fontSize: "16px" }}></iconify-icon>
                  <span>Sign in</span>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <span>Forgot your credentials?</span>
            <span className="form-link">Contact IT Support</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginForm;