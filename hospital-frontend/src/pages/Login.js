import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/userService';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for better UX
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log("Attempting login for:", email); // Debugging: Check if email is correct

    try {
      const response = await login({ email, password });
      
      console.log("Login Success Response:", response.data);

      // Backend response structure: { id, name, email, role, token }
      // response.data-ve oru object dhaan, adhu kulla dhaan token irukku
      loginUser(response.data, response.data.token); 
      
      alert('Login Successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error("Login Error Details:", err.response);
      
      // Detailed error message from backend if available
      const errMsg = err.response?.data || 'Invalid Email or Password';
      alert('Login Failed: ' + errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Please enter your details to login</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="name@gmail.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>New here? <Link to="/register">Create Account</Link></p>
          <Link to="/" className="back-home">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;