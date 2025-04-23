// src/components/BudgetForm.jsx
import React, { useState } from 'react';
import AnimatedButton from '../components/AnimatedButton';

const BudgetForm = ({ onSubmit }) => {
  const [budget, setBudget] = useState('');
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const handleSubmit = (e) => {
    e.preventDefault();
    if (budget > 0) {
      onSubmit(budget);
      setBudget(''); // Clear input
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-purple-900 p-6 rounded-lg shadow-md">
      <h2 className="text-lg text-white font-semibold mb-4">Set Your Budget</h2>
      <input
        type="number"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        placeholder="Enter your budget"
        className="border border-gray-300 p-2 rounded w-full mb-4"
      />
      <AnimatedButton label="Set Budget" onClick={handleSubmit} buttonColor="green" textColor="white" />
    </form>
  );
};

export default BudgetForm;
