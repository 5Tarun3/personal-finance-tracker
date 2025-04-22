import React from 'react';
import '../styles/HomePage.css';

const Privacy = () => {
  const policies = [
    {
      title: "Data Collection",
      description: "We collect only the necessary data to provide and improve our services."
    },
    {
      title: "Data Security",
      description: "Your data is protected with industry-standard security measures."
    },
    {
      title: "User Control",
      description: "You have full control over your data and can manage your privacy settings."
    }
  ];

  return (
    <div className="home-page">
      <section className="features-section">
        <div className="section-header">
          <h2>Privacy Policies</h2>
          <p>Understand how we protect your information and respect your privacy.</p>
        </div>
        <div className="features-grid">
          {policies.map((policy, index) => (
            <div key={index} className="feature-card" style={{ borderColor: '#4CD964' + '40' }}>
              <h3>{policy.title}</h3>
              <p>{policy.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Privacy;
