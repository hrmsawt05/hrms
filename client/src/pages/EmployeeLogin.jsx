import React, { useState, useEffect } from 'react';
import './EmployeeLogin.css'; // CSS is separated for clarity (see below)

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [message, setMessage] = useState('');

  // CAPTCHA generation
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const togglePassword = () => {
    const pwdField = document.getElementById('password');
    pwdField.type = pwdField.type === 'password' ? 'text' : 'password';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validations
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!usernameRegex.test(employeeId)) {
      alert('Employee ID must be alphanumeric.');
      return;
    }
    if (!passwordRegex.test(password)) {
      alert('Password must include uppercase, lowercase, number, and symbol, min 6 chars.');
      return;
    }
    if (!emailRegex.test(email)) {
      alert('Invalid email format.');
      return;
    }
    if (captchaInput !== captcha) {
      alert('Incorrect CAPTCHA.');
      generateCaptcha();
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Login successful!');
        // Optionally: localStorage.setItem('token', data.token);
        // Navigate to dashboard here
      } else {
        setMessage(data.message || '❌ Login failed.');
      }
    } catch (err) {
      setMessage('⚠️ Server error');
      console.error(err);
    }
  };

  return (
    <div className="container">
      <img src="logo.png" className="logo" alt=" Logo" />
      <h2> HRMS</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <i>👤</i>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            placeholder="Employee ID"
            required
          />
        </div>

        <div className="input-group">
          <i>🔒</i>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <span className="toggle-password" onClick={togglePassword}>👁</span>
        </div>

        <div className="input-group">
          <i>📧</i>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>

        <div className="captcha-box">
          <div className="captcha-image">{captcha}</div>
          <button type="button" onClick={generateCaptcha}>🔁</button>
          <input
            type="text"
            value={captchaInput}
            onChange={(e) => setCaptchaInput(e.target.value)}
            placeholder="Enter CAPTCHA"
            required
            className="captcha-input"
          />
        </div>

        <button type="submit">Login</button>
      </form>

      {message && <p className="support">{message}</p>}

      <div className="links">
        <p><a href="#">Forgot Password?</a></p>
      </div>
    </div>
  );
};

export default Login;
