import React from 'react';
import '../styles/HomePage.css';

const About = () => {
  const companyInfo = [
    {
      title: "Our Mission",
      description: "To empower individuals to take control of their financial future with innovative AI-driven tools."
    },
    {
      title: "Our Team",
      description: "A passionate group of fintech experts, engineers, and designers dedicated to making finance simple."
    },
    {
      title: "Our Values",
      description: "Transparency, innovation, and customer-centricity guide everything we do."
    }
  ];

  return (
    <div className="home-page">
      <section className="features-section">
        <div className="section-header">
          <h2>About FinFlow</h2>
          <p>Learn more about our company and what drives us.</p>
        </div>
        <div className="features-grid">
          {companyInfo.map((info, index) => (
            <div key={index} className="feature-card" style={{ borderColor: '#4CD964' + '40' }}>
              <h3>{info.title}</h3>
              <p>{info.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
