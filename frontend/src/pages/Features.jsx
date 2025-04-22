import React from 'react';
import { FaChartLine, FaRobot, FaRegLightbulb, FaRegChartBar } from 'react-icons/fa';
import '../styles/HomePage.css';

const Features = () => {
  const features = [
    {
      title: "Expense & Income Tracking",
      description: "Seamlessly manage your daily transactions with smart categorization and real-time balance updates.",
      icon: <FaChartLine />,
      color: "#4CD964"
    },
    {
      title: "AI-Powered Predictions",
      description: "Get ahead of your finances with our intelligent expense forecasting system powered by machine learning.",
      icon: <FaRobot />,
      color: "#5E5CE6"
    },
    {
      title: "Financial Insights",
      description: "Turn your transaction history into actionable insights with our AI-driven financial analysis tools.",
      icon: <FaRegLightbulb />,
      color: "#FF9500"
    },
    {
      title: "Budget Optimization",
      description: "Maximize your savings with smart budgeting tools that adapt to your spending habits.",
      icon: <FaRegChartBar />,
      color: "#4A90E2"
    }
  ];

  return (
    <div className="home-page">
      <section className="features-section">
        <div className="section-header">
          <h2>Our Key Features</h2>
          <p>Explore the powerful tools that make managing your finances effortless.</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ borderColor: feature.color + '40' }}
            >
              <div className="feature-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Features;
