import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/userService';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'PATIENT' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert('Registration Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      alert('Registration Failed: ' + (err.response?.data || 'Error'));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Join CareHub</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Full Name" required 
            onChange={(e) => setFormData({...formData, name: e.target.value})} />
          
          <input type="email" placeholder="Email Address" required 
            onChange={(e) => setFormData({...formData, email: e.target.value})} />
          
          <input type="password" placeholder="Password" required 
            onChange={(e) => setFormData({...formData, password: e.target.value})} />
          


          <button type="submit" className="auth-btn">Sign Up</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;