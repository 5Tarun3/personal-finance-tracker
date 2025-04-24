import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotificationAlert from './NotificationAlert';

const UpdateIncome = ({ income, onClose }) => {
  const [source, setSource] = useState(income?.source || "");
  const [amount, setAmount] = useState(income?.amount || 0);
  const [date, setDate] = useState(income?.date?.slice(0, 10) || "");
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const incomeSources = ["bonus", "primary salary", "investment returns", "fixed deposit/interest", "rental income", "business profit", "gift money", "royalty income", "other"];
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  
  useEffect(() => {
    if (income) {
      setSource(income.source);
      setAmount(income.amount);
      setDate(income.date?.slice(0, 10));
    }
  }, [income]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!source) {
      setErrorMessage('Please select a source.');
      setShowAlert(true);
      return;
    }

    if (!amount || amount <= 0) {
      setErrorMessage('Amount must be greater than zero.');
      setShowAlert(true);
      return;
    }

    if (!date) {
      setErrorMessage('Please select a date.');
      setShowAlert(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setErrorMessage('You must be logged in to update income. Please log in or sign up.');
        setShowAlert(true);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`${API_BASE}/api/incomes/update/${income._id}`, { source, amount, date }, config);
      onClose();
      setErrorMessage('Income updated successfully!');
      setShowAlert(true);
    } catch (error) {
      console.error("Error updating income:", error);
      setErrorMessage(error.response?.data?.message || 'An unexpected error occurred. Please try again later.');
      setShowAlert(true);
    }
  };

  return (
    <div>
      {showAlert && <NotificationAlert message={errorMessage} onClose={() => setShowAlert(false)} />}

      
      <div className="bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-amber-500 text-xl font-bold mb-4">Update Income</h2>
        
        <div className="mb-4">
          <label className="block text-amber-500 font-bold mb-2">Source:</label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none"
          >
            <option value="">Select Source</option>
            {incomeSources.map((src, index) => (
              <option key={index} value={src}>{src}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-amber-500 font-bold mb-2">Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-amber-500 font-bold mb-2">Date:</label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 focus:outline-none"
            />
            <span className="absolute right-2 top-2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </span>
          </div>
        </div>
        
        <button 
          onClick={handleSubmit}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
        >
          Update Income
        </button>
      </div>
    </div>
  );
};

export default UpdateIncome;