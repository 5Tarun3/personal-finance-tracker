import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaRobot, FaRegLightbulb, FaRegChartBar, FaPlus, FaArrowDown, FaArrowRight } from 'react-icons/fa';
import '../styles/HomePage.css';
import ParticleBackground from '../components/ParticleBackground';

const HomePage = () => {
  const navigate = useNavigate();

  // App features demonstration data
  const features = [
    {
      title: "Expense & Income Tracking",
      description: "Seamlessly manage your daily transactions with smart categorization and real-time balance updates.",
      icon: <FaChartLine />,
      color: "#4CD964",
      delay: 0.2
    },
    {
      title: "AI-Powered Predictions",
      description: "Get ahead of your finances with our intelligent expense forecasting system powered by machine learning.",
      icon: <FaRobot />,
      color: "#5E5CE6",
      delay: 0.4
    },
    {
      title: "Financial Insights",
      description: "Turn your transaction history into actionable insights with our AI-driven financial analysis tools.",
      icon: <FaRegLightbulb />,
      color: "#FF9500",
      delay: 0.6
    }
  ];

  return (
    <div className="home-page">
      <ParticleBackground />

      {/* Header Section */}
      <header className="home-header">
        <div className="header-content">
          <div className="brand-container">
            <h1 className="brand-name">FinFlow</h1>
          </div>
          <nav className="main-nav">
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#dashboard">Dashboard</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
            </ul>
          </nav>
          <div className="auth-buttons">
            <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
            <button className="signup-btn" onClick={() => navigate("/signup")}>Get Started</button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Control Your Financial Future</h1>
            <p>Advanced AI-powered tools to track, analyze, and optimize your personal finances in one seamless platform.</p>
            <div className="hero-cta">
              <button className="primary-btn" onClick={() => navigate("/signup")}>
                Start For Free <FaArrowRight className="btn-icon" />
              </button>
              <button className="secondary-btn" onClick={() => navigate("/demo")}>
                Watch Demo
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="dashboard-preview">
              <div className="preview-header">
                <div className="preview-header-text">
                  <h3>Your Financial Summary</h3>
                  <p>March 2025</p>
                </div>
                <div className="preview-balance">
                  <span className="balance-label">Current Balance</span>
                  <span className="balance-amount">$8,547.63</span>
                </div>
              </div>
              <div className="preview-charts">
                <div className="chart-container">
                  <div className="chart-header">
                    <h4>Monthly Spending</h4>
                    <span className="chart-period">Last 30 Days</span>
                  </div>
                  <div className="mock-chart">
                    <div className="bar-chart">
                      <div className="bar" style={{ height: '60%', backgroundColor: '#4CD964' }}></div>
                      <div className="bar" style={{ height: '80%', backgroundColor: '#4CD964' }}></div>
                      <div className="bar" style={{ height: '45%', backgroundColor: '#4CD964' }}></div>
                      <div className="bar" style={{ height: '75%', backgroundColor: '#4CD964' }}></div>
                      <div className="bar" style={{ height: '30%', backgroundColor: '#4CD964' }}></div>
                      <div className="bar" style={{ height: '65%', backgroundColor: '#4CD964' }}></div>
                      <div className="bar" style={{ height: '50%', backgroundColor: '#4CD964' }}></div>
                    </div>
                  </div>
                </div>
                <div className="stats-container">
                  <div className="stat-item">
                    <div className="stat-icon income">
                      <FaPlus />
                    </div>
                    <div className="stat-details">
                      <span className="stat-title">Income</span>
                      <span className="stat-value">$5,230</span>
                      <span className="stat-change positive">+12% <FaArrowRight /></span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon expense">
                      <FaArrowDown />
                    </div>
                    <div className="stat-details">
                      <span className="stat-title">Expenses</span>
                      <span className="stat-value">$3,180</span>
                      <span className="stat-change negative">-8% <FaArrowRight /></span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon savings">
                      <FaRegChartBar />
                    </div>
                    <div className="stat-details">
                      <span className="stat-title">Savings</span>
                      <span className="stat-value">$2,050</span>
                      <span className="stat-change positive">+24% <FaArrowRight /></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Powerful Financial Tools</h2>
          <p>Everything you need to take control of your finances</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ 
                animationDelay: `${feature.delay}s`,
                borderColor: feature.color + '40' // Adding transparency for border color
              }}
            >
              <div className="feature-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="features-showcase">
          <div className="showcase-content">
            <h3>AI Assistant</h3>
            <p>Get personalized financial guidance with our intelligent assistant</p>
            <ul className="feature-benefits">
              <li>Instant answers to financial questions</li>
              <li>Budget recommendations based on spending patterns</li>
              <li>Notification alerts for unusual expenses</li>
              <li>Help navigating app features and functionality</li>
            </ul>
            <button className="learn-more-btn">Learn More</button>
          </div>
          <div className="assistant-preview">
            <div className="assistant-chat">
              <div className="chat-message user">
                <p>How much did I spend on restaurants this month?</p>
              </div>
              <div className="chat-message assistant">
                <div className="assistant-icon">
                  <FaRobot />
                </div>
                <div className="message-content">
                  <p>You've spent $342 on restaurants this month, which is 18% less than your monthly average. Great job staying under budget!</p>
                  <div className="mini-chart">
                    <div className="mini-bar this-month"></div>
                    <div className="mini-bar average"></div>
                    <div className="mini-labels">
                      <span>This Month</span>
                      <span>Avg ($418)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Dashboard Preview Section */}
      <section id="dashboard" className="dashboard-section">
        <div className="section-header">
          <h2>Intuitive Dashboard</h2>
          <p>Everything at your fingertips</p>
        </div>
        
        <div className="dashboard-highlights">
          <div className="highlight-item">
            <span className="highlight-number">350+</span>
            <p>Expense Categories</p>
          </div>
          <div className="highlight-item">
            <span className="highlight-number">99%</span>
            <p>Prediction Accuracy</p>
          </div>
          <div className="highlight-item">
            <span className="highlight-number">24/7</span>
            <p>Financial Monitoring</p>
          </div>
        </div>
        
        <div className="dashboard-interactive">
          <div className="interactive-tabs">
            <button className="tab-btn active">Overview</button>
            <button className="tab-btn">Transactions</button>
            <button className="tab-btn">Analysis</button>
            <button className="tab-btn">Forecasts</button>
          </div>
          <div className="dashboard-preview-full">
            <div className="interactive-preview">
              <div className="chart-section">
                <h3>Balance Trends</h3>
                <div className="large-chart">
                  <div className="chart-line"></div>
                  <div className="chart-gradient"></div>
                </div>
              </div>
              <div className="transactions-section">
                <h3>Recent Transactions</h3>
                <div className="transaction-list">
                  <div className="transaction-item">
                    <div className="transaction-icon grocery"></div>
                    <div className="transaction-details">
                      <span className="transaction-name">Whole Foods Market</span>
                      <span className="transaction-category">Groceries</span>
                    </div>
                    <span className="transaction-amount expense">-$94.28</span>
                  </div>
                  <div className="transaction-item">
                    <div className="transaction-icon salary"></div>
                    <div className="transaction-details">
                      <span className="transaction-name">Acme Inc.</span>
                      <span className="transaction-category">Salary</span>
                    </div>
                    <span className="transaction-amount income">+$3,450.00</span>
                  </div>
                  <div className="transaction-item">
                    <div className="transaction-icon entertainment"></div>
                    <div className="transaction-details">
                      <span className="transaction-name">Netflix</span>
                      <span className="transaction-category">Entertainment</span>
                    </div>
                    <span className="transaction-amount expense">-$14.99</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <div className="section-header">
          <h2>What Our Users Say</h2>
          <p>Join thousands of happy users taking control of their finances</p>
        </div>
        
        <div className="testimonials-container">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"FinFlow has completely transformed how I manage my money. The AI predictions are scary accurate!"</p>
            </div>
            <div className="testimonial-author">
              <div className="author-image"></div>
              <div className="author-details">
                <span className="author-name">Alex Johnson</span>
                <span className="author-title">Business Owner</span>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"I've tried many finance apps, but the insights from FinFlow have helped me save an additional $400 per month."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-image"></div>
              <div className="author-details">
                <span className="author-name">Sarah Williams</span>
                <span className="author-title">Marketing Manager</span>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"The AI assistant is like having a personal financial advisor available 24/7. Absolutely worth every penny."</p>
            </div>
            <div className="testimonial-author">
              <div className="author-image"></div>
              <div className="author-details">
                <span className="author-name">Michael Chen</span>
                <span className="author-title">Software Engineer</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to transform your financial future?</h2>
          <p>Join thousands of users who have already taken control of their finances with FinFlow.</p>
          <button className="cta-button" onClick={() => navigate("/signup")}>
            Get Started For Free
          </button>
          <p className="cta-disclaimer">No credit card required. 14-day free trial.</p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h2>FinFlow</h2>
            <p>Your financial journey, simplified.</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h3>Product</h3>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#dashboard">Dashboard</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#roadmap">Roadmap</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Resources</h3>
              <ul>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#guides">Guides</a></li>
                <li><a href="#support">Support</a></li>
                <li><a href="#api">API</a></li>
              </ul>
            </div>
            
            <div className="footer-column">
              <h3>Company</h3>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#privacy">Privacy</a></li>
                <li><a href="#terms">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          
        </div>
      </footer>
    </div>
  );
};

export default HomePage;