import React, { useState } from 'react';
import axios from 'axios';
import AnimatedButton from '../components/AnimatedButton';

const AddExpense = ({ refetchExpenses, setRefetchExpenses }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: '',
  });
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const categories = [
    "Food",
    "Entertainment/Luxury",
    "Travel",
    "Furniture",
    "Emergency",
    "Groceries/Home Supplies",
    "Education fees",
    "House Bills",
    "Services/Hired Help",
    "Loan payment",
    "Miscellaneous"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert('Please select a category.');
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
      await axios.post(`${API_BASE}/api/expenses/add`, formData, config);
      setFormData({
        category: '',
        amount: '',
        date: '',
      });
      alert('Expense added successfully!');
      setRefetchExpenses(true);
    } catch (error) {
      alert('Error adding expense:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg shadow-md">

      <div className="mb-4">
        <label htmlFor="category" className="block text-gold-300 text-sm font-bold mb-2">Category:</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full bg-gray-800 text-gold-300 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
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
      <AnimatedButton label="Add Expense" onClick={handleSubmit} buttonColor="green" textColor="black" style={{ boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)' }} />


    </form>
  );
};

export default AddExpense;
