import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Logo from '../assets/Logo.png';
import './NavBar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        const handleLogoutEvent = () => {
            setIsLoggedIn(false);
        };
        window.addEventListener('logout', handleLogoutEvent);

        return () => {
            window.removeEventListener('logout', handleLogoutEvent);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate("/login");
    };

    return (
        <header className="home-header" >
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
                    {isLoggedIn ? (
                        <>
                            <button className="profile-btn" onClick={() => navigate("/profile")}>Profile</button>
                            <button className="manager-btn" onClick={() => navigate("/manager")}>Manager</button>
                            <button className="dashboard-btn" onClick={() => navigate("/dashboard")}>Dashboard</button>
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
                            <button className="signup-btn" onClick={() => navigate("/signup")}>Get Started</button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;