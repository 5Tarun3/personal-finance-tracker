import React from 'react';
import '../styles/HomePage.css';

const Roadmap = () => {
  const roadmapItems = [
    {
      quarter: "Q1 2024",
      goals: [
        "Launch MVP with core features",
        "User onboarding and feedback collection",
        "Basic analytics and reporting"
      ]
    },
    {
      quarter: "Q2 2024",
      goals: [
        "Introduce AI-powered expense predictions",
        "Enhanced budgeting tools",
        "Mobile app release"
      ]
    },
    {
      quarter: "Q3 2024",
      goals: [
        "Integrate with third-party financial services",
        "Advanced financial insights",
        "Multi-currency support"
      ]
    },
    {
      quarter: "Q4 2024",
      goals: [
        "Team collaboration features",
        "Customizable dashboards",
        "Expanded API capabilities"
      ]
    }
  ];

  return (
    <div className="home-page">
      <section className="features-section">
        <div className="section-header">
          <h2>Product Roadmap</h2>
          <p>Our planned milestones and upcoming features.</p>
        </div>
        <div className="features-grid">
          {roadmapItems.map((item, index) => (
            <div key={index} className="feature-card" style={{ borderColor: '#5E5CE6' + '40' }}>
              <h3>{item.quarter}</h3>
              <ul>
                {item.goals.map((goal, idx) => (
                  <li key={idx}>{goal}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Roadmap;
