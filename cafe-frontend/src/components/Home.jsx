import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>☕ Welcome to Our Café</h1>
        <p>Experience the finest coffee and delicacies</p>
        <div className="hero-buttons">
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/menu')}>
            Browse Menu
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/login')}>
            Sign In
          </button>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <span className="feature-icon">🎯</span>
          <h3>Easy Ordering</h3>
          <p>Browse our menu and place orders with just a few clicks</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🚚</span>
          <h3>Quick Service</h3>
          <p>Track your order in real-time</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">⭐</span>
          <h3>Quality Assured</h3>
          <p>Fresh ingredients and professional preparation</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
