import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';
import ParticleBackground from '../components/ParticleBackground';

const Footer = () => {
    return(
      <div className="home-page">
        <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>FinFlow</h2>
            <p>Your financial journey, simplified.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h3>Product</h3>
              <ul>
                <li><Link to="/features">Features</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/roadmap">Roadmap</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Resources</h3>
              <ul>
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/guides">Guides</Link></li>
                <li><Link to="/support">Support</Link></li>
                <li><Link to="/api">API</Link></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Company</h3>
              <ul>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/privacy">Privacy</Link></li>
                <li><Link to="/terms">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} FinFlow. All rights reserved.
        </div>
      </footer>
    </div>
    )
}

export default Footer;
