import React, { useEffect, useRef } from 'react';
import '../styles/ParticleBackground.css';

const ParticleBackground = () => {
  const particlesRef = useRef([]);
  
  useEffect(() => {
    // Handle mouse movement parallax effect
    const handleMouseMove = (e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      particlesRef.current.forEach((particle, index) => {
        if (!particle) return;
        
        // Different movement factor for each particle
        const moveFactor = 0.015 * (index + 1);
        
        // Apply smooth transform with existing animations
        particle.style.transform = `translate(${mouseX * 20 * moveFactor}px, ${mouseY * 20 * moveFactor}px)`;
      });
    };
    
    // Handle visibility change to optimize performance
    const handleVisibilityChange = () => {
      const animationState = document.visibilityState === 'visible' ? 'running' : 'paused';
      
      particlesRef.current.forEach(particle => {
        if (particle) {
          particle.style.animationPlayState = animationState;
        }
      });
    };
    
    // Resize particles based on viewport
    const resizeParticles = () => {
      const viewportWidth = window.innerWidth;
      
      particlesRef.current.forEach((particle, index) => {
        if (!particle) return;
        
        // Base sizes
        const baseSizes = [200, 300, 250, 180, 220];
        
        // Scale factor based on viewport width
        let scaleFactor = 1;
        if (viewportWidth < 768) {
          scaleFactor = 0.7; // Smaller on mobile
        } else if (viewportWidth < 1200) {
          scaleFactor = 0.85; // Slightly smaller on tablets
        }
        
        // Apply new size
        const newSize = baseSizes[index % baseSizes.length] * scaleFactor;
        particle.style.width = newSize + 'px';
        particle.style.height = newSize + 'px';
      });
    };
    
    // Initialize event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('resize', resizeParticles);
    
    // Initial resize
    resizeParticles();
    
    // Cleanup event listeners
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', resizeParticles);
    };
  }, []);
  
  // Particle configurations
  const particles = [
    { className: 'particle-1', style: { width: '200px', height: '200px', top: '15%', left: '10%' } },
    { className: 'particle-2', style: { width: '300px', height: '300px', top: '10%', right: '15%' } },
    { className: 'particle-3', style: { width: '250px', height: '250px', bottom: '15%', left: '20%' } },
    { className: 'particle-4', style: { width: '180px', height: '180px', bottom: '20%', right: '10%' } },
    { className: 'particle-5', style: { width: '220px', height: '220px', top: '45%', left: '50%' } }
  ];
  
  return (
    <>
      <div className="particles-container">
        {particles.map((particle, index) => (
          <div
            key={index}
            ref={el => (particlesRef.current[index] = el)}
            className={`particle ${particle.className}`}
            style={particle.style}
          />
        ))}
      </div>
      <div className="bg-gradient-overlay"></div>
      <div className="noise-texture"></div>
    </>
  );
};

export default ParticleBackground;