import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from '../components/AnimatedButton';

const DisplayExpenses = ({ onUpdateClick, refetchExpenses, expenses: propExpenses }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If expenses are provided as props, use them directly
    if (propExpenses) {
      setExpenses(propExpenses);
      setLoading(false);
      return;
    }

    // Otherwise fetch them from the server
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get('http://localhost:8000/api/expenses/get', config);
        setExpenses(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate('/login');
        } else {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [refetchExpenses, propExpenses, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-gray-800 rounded">
        Error: {error.message}
      </div>
    );
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(`http://localhost:8000/api/expenses/delete/${id}`, config);
      
      // Update local state if we're managing our own data
      if (!propExpenses) {
        const updatedExpenses = expenses.filter((expense) => expense._id !== id);
        setExpenses(updatedExpenses);
      }
      
      // Trigger parent refetch
      if (typeof refetchExpenses === 'function') {
        refetchExpenses();
      } else if (refetchExpenses !== undefined) {
        // Toggle the refetch flag if it's a boolean
        const toggleRefetch = typeof refetchExpenses === 'boolean';
        if (toggleRefetch) {
          // This assumes parent component has a pattern like setRefetchExpenses(prev => !prev)
          // This is just a safeguard in case refetchExpenses isn't a function
        }
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <h2 className="text-amber-400 text-xl font-semibold mb-4">Your Expenses</h2>

      {expenses.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          No expenses found. Add some expenses using the form above.
        </div>
      ) : (
        <ul className="space-y-3">
          {expenses.map((expense) => (
            <li 
              key={expense._id} 
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 px-4 border-b border-gray-700 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors"
            >
              <div className="mb-2 sm:mb-0">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 font-medium">{expense.category}</span>
                  <span className="text-white font-bold">₹{parseFloat(expense.amount).toFixed(2)}</span>
                </div>
                <p className="text-gray-400 text-sm">{new Date(expense.date).toLocaleDateString()}</p>
                {expense.description && (
                  <p className="text-gray-300 text-sm mt-1">{expense.description}</p>
                )}
              </div>
              <div className="flex gap-2 self-end sm:self-auto">
                <AnimatedButton
                  label="Update"
                  buttonColor="lightgreen"
                  textColor="black"
                  onClick={() => onUpdateClick(expense)}
                  className="px-3 py-1 rounded-md text-sm"
                />
                <AnimatedButton
                  label="Delete"
                  buttonColor="purple"
                  textColor="black"
                  onClick={() => handleDelete(expense._id)}
                  className="px-3 py-1 rounded-md text-sm"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DisplayExpenses;