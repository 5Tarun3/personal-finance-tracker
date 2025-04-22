import React from 'react';
import '../styles/HomePage.css';

const Terms = () => {
  const terms = [
    {
      title: "User Agreement",
      description: "Terms and conditions governing the use of FinFlow services."
    },
    {
      title: "Payment Terms",
      description: "Details about billing, subscriptions, and refunds."
    },
    {
      title: "Limitation of Liability",
      description: "Our responsibilities and your rights regarding service usage."
    }
  ];

  return (
    <div className="home-page">
      <section className="features-section">
        <div className="section-header">
          <h2>Terms and Conditions</h2>
          <p>Understand the rules and guidelines for using FinFlow.</p>
        </div>
        <div className="features-grid">
          {terms.map((term, index) => (
            <div key={index} className="feature-card" style={{ borderColor: '#FF9500' + '40' }}>
              <h3>{term.title}</h3>
              <p>{term.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Terms;
