import React from 'react';
import '../styles/HomePage.css';

const Blog = () => {
  const articles = [
    {
      title: "How to Budget Effectively in 2024",
      date: "March 10, 2024",
      summary: "Learn practical tips and tools to create a budget that works for you and helps you save more.",
      author: "Jane Doe"
    },
    {
      title: "Understanding AI in Personal Finance",
      date: "February 25, 2024",
      summary: "Explore how artificial intelligence is transforming the way we manage our money and plan for the future.",
      author: "John Smith"
    },
    {
      title: "Top 5 Investment Strategies for Beginners",
      date: "January 15, 2024",
      summary: "A beginner-friendly guide to smart investing and growing your wealth over time.",
      author: "Emily Johnson"
    }
  ];

  return (
    <div className="home-page">
      <section className="features-section">
        <div className="section-header">
          <h2>Latest Articles</h2>
          <p>Stay informed with our expert financial advice and insights.</p>
        </div>
        <div className="features-grid">
          {articles.map((article, index) => (
            <div key={index} className="feature-card" style={{ borderColor: '#4CD964' + '40' }}>
              <h3>{article.title}</h3>
              <p><em>{article.date} by {article.author}</em></p>
              <p>{article.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Blog;
