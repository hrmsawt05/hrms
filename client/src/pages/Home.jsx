// src/pages/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Optional CSS

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to HRMS Portal</h1>
      <div className="button-group">
        <button onClick={() => navigate('/admin-login')} className="home-btn admin">Admin Login</button>
        <button onClick={() => navigate('/employee-login')} className="home-btn employee">Employee Login</button>
      </div>
    </div>
  );
};

export default Home;
