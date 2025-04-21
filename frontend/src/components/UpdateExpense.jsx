import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotificationAlert from './NotificationAlert';

const UpdateExpense = ({ expense, onClose }) => {
  const [category, setCategory] = useState(expense.category || "");
  const [amount, setAmount] = useState(expense.amount || 0);
  const [date, setDate] = useState(expense.date.slice(0, 10) || "");
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const categories = ["Food", "Entertainment/Luxury", "Travel", "Furniture", "Emergency", "Groceries/Home Supplies", "Education fees", "House Bills", "Services/Hired Help", "Loan payment", "Miscellaneous"];

  useEffect(() => {
    setCategory(expense.category);
    setAmount(expense.amount);
    setDate(expense.date.slice(0, 10));
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setShowAlert(true);
        setErrorMessage('You must be logged in to update expenses. Please log in or sign up.');
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

      await axios.put(`http://localhost:6000/api/expenses/update/${expense._id}`, { category, amount, date }, config);

      onClose();
      setShowAlert(true);
      setErrorMessage('Expense updated successfully!');
    } catch (error) {
      console.error("Error updating expense:", error);
      setShowAlert(true);
      setErrorMessage(error.response?.data?.message || 'An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div className="bg-black p-6 rounded-lg shadow-md">

      {showAlert && <NotificationAlert message={errorMessage} onClose={() => setShowAlert(false)} />}
      <h1 className='text-gold-300'>Update Expense</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gold-300 text-sm font-bold mb-2">Category:</label>

          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full bg-gray-700 text-amber-300 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
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
            className="w-full bg-gray-700 text-amber-300 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-gold-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">

          Update Expense
        </button>
      </form>
    </div>
  );
};

export default UpdateExpense;
