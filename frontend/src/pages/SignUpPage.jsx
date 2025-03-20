import React, { useEffect, useRef } from 'react';
import SignUpForm from '../components/SignUpForm';
import { FaChartLine, FaWallet, FaMoneyBillWave, FaChartPie } from 'react-icons/fa';
import '../styles/SignUpPage.css';

const SignUpPage = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Financial particles data
    const particles = [];
    const icons = ['$', '€', '£', '¥', '₹', '฿', '₽'];
    const colors = ['#4CD964', '#5AC8FA', '#FFCC00', '#FF9500'];
    
    // Create particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 10,
        icon: icons[Math.floor(Math.random() * icons.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 1 + 0.2,
        angle: Math.random() * 360,
        rotation: Math.random() * 0.02 - 0.01,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    
    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach(particle => {
        // Move particle
        const radians = particle.angle * Math.PI / 180;
        particle.x += Math.cos(radians) * particle.speed;
        particle.y += Math.sin(radians) * particle.speed;
        
        // Change angle slightly for natural movement
        particle.angle += particle.rotation;
        
        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.font = `${particle.size}px Arial`;
        ctx.fillStyle = particle.color;
        ctx.fillText(particle.icon, particle.x, particle.y);
        ctx.restore();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="signup-page">
      <canvas ref={canvasRef} className="background-canvas"></canvas>
      
      <div className="content-container">
        <div className="left-section">
          <div className="brand-container">
            <h1 className="brand-name">FinFlow</h1>
            <p className="brand-tagline">Track, Plan, Prosper</p>
          </div>
          
          <div className="features-container">
            <div className="feature-card">
              <FaChartLine className="feature-icon" />
              <h3>Track Expenses</h3>
              <p>Monitor your spending patterns with intuitive charts and insights</p>
            </div>
            
            <div className="feature-card">
              <FaWallet className="feature-icon" />
              <h3>Budget Planning</h3>
              <p>Create custom budgets and get alerts when you're approaching limits</p>
            </div>
            
            <div className="feature-card">
              <FaChartPie className="feature-icon" />
              <h3>Financial Insights</h3>
              <p>Get personalized recommendations based on your spending habits</p>
            </div>
            
            <div className="feature-card">
              <FaMoneyBillWave className="feature-icon" />
              <h3>Investment Tracking</h3>
              <p>Monitor your investments and track growth over time</p>
            </div>
          </div>
        </div>
        
        <div className="right-section">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;