import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Shield, Clock, ArrowRight } from 'lucide-react';
import './Home.css'; // Normal CSS file import

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <Activity size={28} className="icon-blue" />
          <span>CareHub</span>
        </div>
        <div className="nav-links">
          <a href="#services">Services</a>
          <button className="btn-secondary" onClick={() => navigate('/login')}>Login</button>
          <button className="btn-primary" onClick={() => navigate('/register')}>Sign Up</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>Advanced Healthcare <br /> <span>Simplified for You.</span></h1>
          <p>
            Book appointments with world-class doctors, manage your health records, 
            and get instant digital approvals for hospital outpasses.
          </p>
          <button className="cta-button" onClick={() => navigate('/register')}>
            Get Started <ArrowRight size={20} />
          </button>
        </div>
        <div className="hero-image">
          <img 
            src="https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg" 
            alt="Healthcare Illustration" 
          />
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="services">
        <h2>Why Choose CareHub?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <Clock size={40} className="icon-blue" />
            <h3>Instant Booking</h3>
            <p>No more long queues. Book your slot in seconds with our smart system.</p>
          </div>
          <div className="feature-card">
            <Shield size={40} className="icon-blue" />
            <h3>Secure Data</h3>
            <p>Your medical history is protected with industry-standard JWT encryption.</p>
          </div>
          <div className="feature-card">
            <Activity size={40} className="icon-blue" />
            <h3>Real-time Tracking</h3>
            <p>Track your appointment status and get notified about approvals instantly.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;