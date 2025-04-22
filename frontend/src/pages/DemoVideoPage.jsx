import React from 'react';
import '../styles/HomePage.css';
import Demo from '../assets/Demo.mp4'

const DemoVideoPage = () => {
  return (
    <div className="home-page">
      <header className="home-header">
        <div className="header-content">
          <h1 className="brand-name">Demo Video</h1>
        </div>
      </header>

      <main className="hero-section" style={{ paddingTop: '120px', textAlign: 'center' }}>
        <div className="hero-content" style={{ justifyContent: 'center' }}>
          <video
            src={Demo}
            controls
            autoPlay
            muted
            style={{
              maxWidth: '90%',
              borderRadius: '16px',
              boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)',
              backgroundColor: '#000',
            }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </main>
    </div>
  );
};

export default DemoVideoPage;
