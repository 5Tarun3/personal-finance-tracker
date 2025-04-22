import React from 'react';
import '../styles/HomePage.css';

const API = () => {
  const apiFeatures = [
    {
      title: "RESTful Endpoints",
      description: "Access your financial data securely with our comprehensive REST API."
    },
    {
      title: "Real-time Data Sync",
      description: "Keep your apps up-to-date with real-time synchronization capabilities."
    },
    {
      title: "Extensive Documentation",
      description: "Detailed guides and references to help you integrate seamlessly."
    }
  ];

  return (
    <div className="home-page">
      <section className="features-section">
        <div className="section-header">
          <h2>API Features</h2>
          <p>Explore the powerful API capabilities of FinFlow.</p>
        </div>
        <div className="features-grid">
          {apiFeatures.map((feature, index) => (
            <div key={index} className="feature-card" style={{ borderColor: '#5E5CE6' + '40' }}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default API;
