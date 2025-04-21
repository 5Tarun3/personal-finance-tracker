import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaRobot, FaRegLightbulb, FaRegChartBar, FaPlus, FaArrowDown, FaArrowRight } from 'react-icons/fa';
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
                <li><a href="#features">Features</a></li>
                <li><a href="#dashboard">Dashboard</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#roadmap">Roadmap</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Resources</h3>
              <ul>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#guides">Guides</a></li>
                <li><a href="#support">Support</a></li>
                <li><a href="#api">API</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Company</h3>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#privacy">Privacy</a></li>
                <li><a href="#terms">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          
        </div>
      </footer>
    </div>
    )
}

export default Footer;