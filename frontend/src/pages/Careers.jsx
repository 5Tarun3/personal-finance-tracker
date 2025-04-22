import React from 'react';
import '../styles/HomePage.css';

const Careers = () => {
  const jobOpenings = [
    {
      title: "Frontend Developer",
      description: "Build and enhance user interfaces with React and modern web technologies."
    },
    {
      title: "Data Scientist",
      description: "Develop AI models to provide financial insights and predictions."
    },
    {
      title: "Product Manager",
      description: "Lead product development and strategy to deliver customer value."
    }
  ];

  return (
    <div className="home-page">
      <section className="features-section">
        <div className="section-header">
          <h2>Careers at FinFlow</h2>
          <p>Join our team and help shape the future of personal finance.</p>
        </div>
        <div className="features-grid">
          {jobOpenings.map((job, index) => (
            <div key={index} className="feature-card" style={{ borderColor: '#5E5CE6' + '40' }}>
              <h3>{job.title}</h3>
              <p>{job.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Careers;
