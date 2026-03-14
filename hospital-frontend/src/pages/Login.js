import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/userService';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login({ email, password });
      // Backend response-la irukura user data and token-a context-la save pannuvom
      loginUser(response.data, response.data.token); 
      alert('Login Successful!');
      navigate('/dashboard'); // Dashboard-ku redirect aagum
    } catch (err) {
      alert('Login Failed: ' + (err.response?.data || 'Invalid Credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to your account</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" value={email} required placeholder="Email"
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} required placeholder="Password"
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="auth-footer">
          <p>New here? <Link to="/register">Create Account</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;