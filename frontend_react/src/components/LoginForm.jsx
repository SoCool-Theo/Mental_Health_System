import { useState } from "react";
import api from "../api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // This sends the POST request to your Django Token Endpoint
      const response = await api.post("token/", {
        username: username,
        password: password,
      });

      // If successful, we get the tokens!
      console.log("Login Success:", response.data);
      alert("Login Successful! Token: " + response.data.access);
      
      // TODO: Save token to localStorage (we will do this next)
        
    } catch (err) {
      console.error("Full Error:", err); // Print the whole error object
      if (err.response) {
        console.log("Server Response:", err.response.data); // <--- THIS IS THE KEY
        alert("Server said: " + JSON.stringify(err.response.data)); // Pop up the real reason
      }
      setError("Login Failed");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Clinic Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" style={{ padding: "10px 20px" }}>
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;