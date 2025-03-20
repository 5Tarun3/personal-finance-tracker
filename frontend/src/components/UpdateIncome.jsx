import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotificationAlert from './NotificationAlert';

const UpdateIncome = ({ income, onClose }) => {
  const [source, setSource] = useState(income.source || "");
  const [amount, setAmount] = useState(income.amount || 0);
  const [date, setDate] = useState(income.date.slice(0, 10) || "");
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const incomeSources = ["bonus","primary salary","investment returns","fixed deposit/interest","rental income","business profit","gift money","royalty income","other"];

  useEffect(() => {
    setSource(income.source);
    setAmount(income.amount);
    setDate(income.date.slice(0, 10));
  }, [income]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setShowAlert(true);
        setErrorMessage('You must be logged in to update income. Please log in or sign up.');
        return;
      }

      if (amount <= 0) {
        setShowAlert(true);
        setErrorMessage('Amount must be greater than zero.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`http://localhost:5000/api/incomes/update/${income._id}`, { source, amount, date }, config);

      onClose();
      setShowAlert(true);
      setErrorMessage('Income updated successfully!');
    } catch (error) {
      console.error("Error updating income:", error);
      setShowAlert(true);
      setErrorMessage(error.response?.data?.message || 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="bg-black p-6 rounded-lg shadow-md">

      {showAlert && <NotificationAlert message={errorMessage} onClose={() => setShowAlert(false)} />}
      <h1 className='text-gold-300'>Update Income</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="source" className="block text-gold-300 text-sm font-bold mb-2">Source:</label>

          <select
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            required
            className="w-full bg-gray-700 text-amber-300 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            required
            className="w-full bg-gray-700 text-amber-300 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="date" className="block text-gold-300 text-sm font-bold mb-2">Date:</label>

          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full bg-gray-700 text-amber-300 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
          <button type="submit" className="bg-purple-600 hover:bg-slate-700 text-gold-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">

          Update Income
        </button>
      </form>
    </div>
  );
};

export default UpdateIncome;
