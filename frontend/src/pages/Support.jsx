import React from 'react';
import '../styles/HomePage.css';

const Support = () => {
  const supportTopics = [
    {
      title: "Account Setup",
      description: "Guidance on creating and managing your FinFlow account."
    },
    {
      title: "Troubleshooting",
      description: "Solutions to common issues and how to resolve them."
    },
    {
      title: "Contact Support",
      description: "Reach out to our support team for personalized assistance."
    }
  ];

  return (
    <div className="home-page">
      <section className="features-section">
        <div className="section-header">
          <h2>Support Resources</h2>
          <p>Find answers and get help with your FinFlow experience.</p>
        </div>
        <div className="features-grid">
          {supportTopics.map((topic, index) => (
            <div key={index} className="feature-card" style={{ borderColor: '#4CD964' + '40' }}>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Support;
