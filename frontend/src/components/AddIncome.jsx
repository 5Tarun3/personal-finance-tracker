import React, { useState } from 'react';
import axios from 'axios';
import AnimatedButton from '../components/AnimatedButton';

const AddIncome = ({refetchIncomes, setRefetchIncomes}) => {
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: '',
  });
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const incomeSources = ["bonus","primary salary","investment returns","fixed deposit/interest","rental income","business profit","gift money","royalty income","other"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.source) {
      alert('Please select a source.');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Amount must be greater than zero.');
      return;
    }

    if (!formData.date) {
      alert('Please select a date.');
      return;
    }

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      await axios.post(`${API_BASE}/api/incomes/add`, formData, config);
      setFormData({
        source: '',
        amount: '',
        date: '',
      });
      alert('Income added successfully!');
      setRefetchIncomes(true);
    } catch (error) {
      alert('Error adding income:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label htmlFor="source" className="block text-gold-300 text-sm font-bold mb-2">Source:</label>
        <select
          id="source"
          name="source"
          value={formData.source}
          onChange={handleChange}
          required
          className="w-full bg-gray-800 text-gold-300 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Source</option>
          {incomeSources.map((source, index) => (
            <option key={index} value={source}>{source}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="amount" className="block text-gold-300 text-sm font-bold mb-2">Amount:</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          className="w-full bg-gray-800 text-gold-300 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="date" className="block text-gold-300 text-sm font-bold mb-2">Date:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full bg-gray-800 text-gold-300 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <AnimatedButton label="Add Income" onClick={handleSubmit} buttonColor="green" textColor="black" style={{ boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)' }} />
    </form>
  );
};

export default AddIncome;
