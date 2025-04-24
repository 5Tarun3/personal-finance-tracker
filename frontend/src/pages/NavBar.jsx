import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaRobot, FaRegLightbulb, FaRegChartBar, FaPlus, FaBars, FaTimes } from 'react-icons/fa';
import '../styles/NavBar.css';
import ParticleBackground from '../components/ParticleBackground';
import ChatbotIcon from '../components/ChatbotIcon';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();

    // Handle scrolling effects
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const navigateTo = (path) => {
        navigate(path);
        closeMenu();
    };

    return (
        <div className="home-page">
            <header className={`home-header ${scrolled ? 'scrolled' : ''}`}>
                <div className="header-content">
                    <div className="brand-container">
                        <a href="/"><h1 className="brand-name">FinFlow</h1></a>
                    </div>
                    
                    {/* Desktop Navigation */}
                    <nav className="main-nav desktop-nav">
                        <ul>
                            <li><a href="/dashboard">Dashboard</a></li>
                            <li><a href="/chatbot">Chatbot</a></li>
                            <li><a href="/Profile">Profile</a></li>
                            <li><a href="/demo">Demo</a></li>
                        </ul>
                    </nav>
                    
                    <div className="auth-buttons desktop-auth">
                        <a href="/login"><button className="login-btn" onClick={() => navigateTo("/login")}>Login</button></a>
                        <a href="/signup"><button className="signup-btn" onClick={() => navigateTo("/signup")}>Get Started</button></a>
                    </div>
                    
                    {/* Mobile Menu Button */}
                    <button className="mobile-menu-btn" onClick={toggleMenu}>
                        <FaBars />
                    </button>
                </div>
            </header>
            
            {/* Mobile Menu */}
            <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
            <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                <button className="close-menu" onClick={closeMenu}>
                    <FaTimes />
                </button>
                <div className="mobile-nav">
                    <ul>
                        <li><a href="/dashboard" onClick={() => navigateTo("/dashboard")}>Dashboard</a></li>
                        <li><a href="/chatbot" onClick={() => navigateTo("/chatbot")}>Chatbot</a></li>
                        <li><a href="/Profile" onClick={() => navigateTo("/Profile")}>Profile</a></li>
                        <li><a href="/demo" onClick={() => navigateTo("/demo")}>Demo</a></li>
                    </ul>
                    <div className="mobile-auth-buttons">
                        <a href="/login"><button className="login-btn" onClick={() => navigateTo("/login")}>Login</button></a>
                        <a href="/signup"><button className="signup-btn" onClick={() => navigateTo("/signup")}>Get Started</button></a>
                    </div>
                </div>
            </div>
            <ChatbotIcon />
        </div>
    );
};

export default NavBar;