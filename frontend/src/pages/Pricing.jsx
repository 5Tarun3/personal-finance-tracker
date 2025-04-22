import React from 'react';
import '../styles/HomePage.css';

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      features: [
        "Track income and expenses",
        "Basic financial reports",
        "Limited categories",
        "Email support"
      ],
      color: "#4CD964"
    },
    {
      name: "Pro",
      price: "₹499 / month",
      features: [
        "All Basic features",
        "Advanced analytics",
        "AI-powered predictions",
        "Priority support",
        "Multi-device sync"
      ],
      color: "#5E5CE6"
    },
    {
      name: "Enterprise",
      price: "Contact us",
      features: [
        "All Pro features",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 support",
        "Team collaboration"
      ],
      color: "#FF9500"
    }
  ];

  return (
    <div className="home-page">
      <section className="features-section">
        <div className="section-header">
          <h2>Pricing Plans</h2>
          <p>Choose the plan that fits your financial goals.</p>
        </div>
        <div className="features-grid">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ borderColor: plan.color + '40' }}
            >
              <h3 style={{ color: plan.color }}>{plan.name}</h3>
              <p className="price">{plan.price}</p>
              <ul>
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Pricing;
