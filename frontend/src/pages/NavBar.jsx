import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaRobot, FaRegLightbulb, FaRegChartBar, FaPlus, FaArrowDown, FaArrowRight } from 'react-icons/fa';
import '../styles/NavBar.css';
import ParticleBackground from '../components/ParticleBackground';

const NavBar = () => {
    return (
        <div className="home-page">
        <header className="home-header">
            <div className="header-content">
                <div className="brand-container">
                <h1 className="brand-name">FinFlow</h1>
                </div>
                <nav className="main-nav">
                <ul>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#dashboard">Dashboard</a></li>
                    <li><a href="#testimonials">Testimonials</a></li>
                </ul>
                </nav>
                <div className="auth-buttons">
                <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
                <button className="signup-btn" onClick={() => navigate("/signup")}>Get Started</button>
                </div>
            </div>
        </header>
        </div>
    )
}

export default NavBar;