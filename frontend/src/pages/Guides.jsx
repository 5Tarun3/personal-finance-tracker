import React from 'react';
import '../styles/HomePage.css';

const Guides = () => {
  const guides = [
    {
      title: "Getting Started with FinFlow",
      summary: "A step-by-step guide to setting up your account and tracking your finances.",
      author: "Support Team"
    },
    {
      title: "Maximizing Your Savings",
      summary: "Tips and tricks to optimize your budget and increase your savings.",
      author: "Finance Expert"
    },
    {
      title: "Using AI Predictions Effectively",
      summary: "How to leverage our AI-powered tools to forecast and plan your expenses.",
      author: "Data Scientist"
    }
  ];

  return (
    <div className="home-page">
      <section className="features-section">
        <div className="section-header">
          <h2>Helpful Guides</h2>
          <p>Learn how to make the most of FinFlow with our tutorials and tips.</p>
        </div>
        <div className="features-grid">
          {guides.map((guide, index) => (
            <div key={index} className="feature-card" style={{ borderColor: '#5E5CE6' + '40' }}>
              <h3>{guide.title}</h3>
              <p>{guide.summary}</p>
              <p><em>By {guide.author}</em></p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Guides;
