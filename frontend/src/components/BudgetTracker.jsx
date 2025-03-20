// src/components/BudgetTracker.jsx
import React from 'react';
import AnimatedProgressBar from './AnimatedProgressBar';

const BudgetTracker = ({ budget, spent }) => {
  const percentage = (spent / budget) * 100;

  return (
    <div className="bg-purple-900 p-6 rounded-lg shadow-md">
      <h2 className="text-lg text-white font-semibold mb-4">Budget Tracker</h2>
      <p className="text-white">Total Budget: ₹ {budget}</p>
      <p className="text-white">Total Spent: ₹ {spent}</p>
      <AnimatedProgressBar percentage={percentage} />
    </div>
  );
};

export default BudgetTracker;
