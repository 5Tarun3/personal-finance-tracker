import React, { useEffect, useRef } from 'react';
import EnhancedLogin from '../components/EnhancedLogin';
import { FaShieldAlt, FaChartBar, FaLock } from 'react-icons/fa';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Grid points for connection effect
    const points = [];
    const pointCount = Math.floor(window.innerWidth * window.innerHeight / 18000);
    
    // Create points
    for (let i = 0; i < pointCount; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        color: '#4CD964',
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 - 0.25,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
    
    // Animation loop
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw points
      points.forEach(point => {
        // Move point
        point.x += point.vx;
        point.y += point.vy;
        
        // Wrap around screen
        if (point.x < 0) point.x = canvas.width;
        if (point.x > canvas.width) point.x = 0;
        if (point.y < 0) point.y = canvas.height;
        if (point.y > canvas.height) point.y = 0;
        
        // Draw point
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = point.color;
        ctx.globalAlpha = point.alpha;
        ctx.fill();
      });
      
      // Connect nearby points with lines
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = '#4CD964';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }
      }
      
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
    <div className="login-page">
      <canvas ref={canvasRef} className="background-canvas"></canvas>
      
      <div className="login-content-container">
        <div className="login-left-section">
          <div className="login-brand-container">
            <h1 className="brand-name">FinFlow</h1>
            <p className="brand-tagline">Secure Access to Your Financial Hub</p>
          </div>
          
          <div className="login-features">
            <div className="login-feature-item">
              <FaShieldAlt className="login-feature-icon" />
              <div className="login-feature-text">
                <h3>Secure Authentication</h3>
                <p>Your financial data is protected with enterprise-grade security</p>
              </div>
            </div>
            
            <div className="login-feature-item">
              <FaChartBar className="login-feature-icon" />
              <div className="login-feature-text">
                <h3>Smart Analytics</h3>
                <p>Get personalized insights and expense predictions</p>
              </div>
            </div>
            
            <div className="login-feature-item">
              <FaLock className="login-feature-icon" />
              <div className="login-feature-text">
                <h3>Private & Confidential</h3>
                <p>Your data never leaves your account without permission</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="login-right-section">
          <EnhancedLogin />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;