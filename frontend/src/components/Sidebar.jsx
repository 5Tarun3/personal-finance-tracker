import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedButton from '../components/AnimatedButton';

const Sidebar = () => {
  const [financeOverview, setFinanceOverview] = useState({
    totalSpendings: 0,
    monthlyBudget: 0,
    savingGoals: 0,
    totalIncome: 0,
  });
  const [budget, setBudget] = useState(0);
  const [savingGoal, setSavingGoal] = useState(0);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showSavingGoalForm, setShowSavingGoalForm] = useState(false);

  useEffect(() => {
    const fetchFinanceOverview = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/api/expenses/finance-overview', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const expensesData = await response.json();
        const totalIncomeResponse = await fetch('http://localhost:5000/api/incomes/total', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!totalIncomeResponse.ok) {
          console.error("Unauthorized access. Please log in.");
        }
        const totalIncomeData = await totalIncomeResponse.json();
        setFinanceOverview({ ...expensesData, totalIncome: totalIncomeData.totalIncome });
        setBudget(expensesData.monthlyBudget);
        setSavingGoal(expensesData.savingGoals);
      } catch (error) {
        console.error('Error fetching finance overview:', error);
      }
    };

    fetchFinanceOverview();
  }, []);

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/users/monthlyBudget', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ monthlyBudget: budget }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFinanceOverview({ ...financeOverview, monthlyBudget: data.monthlyBudget });
      setBudget(data.monthlyBudget);
      setShowBudgetForm(false);
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleSavingGoalSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/users/savingGoal', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ savingGoal: savingGoal }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setFinanceOverview({ ...financeOverview, savingGoals: data.savingGoals });
      setSavingGoal(data.savingGoals);
      setShowSavingGoalForm(false);
    } catch (error) {
      console.error('Error updating saving goal:', error);
    }
  };

  return (
    <aside className="w-64 bg-gray-800 text-white p-4 rounded-lg shadow-lg">
      <h2 className="text-xl text-gold-300 font-bold mb-4">Financial Overview</h2>
      <ul className='text-gold-300'>
        <li className='mb-2'>
          <span>Monthly Budget:</span>
          <strong className="float-right">₹{financeOverview.monthlyBudget}</strong>
          {showBudgetForm ? (
            <form onSubmit={handleBudgetSubmit}>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value, 10))}
                className="mt-1 p-2 bg-gray-900 w-full text-gold-400 border border-gold-600 rounded-md"
              />
              <AnimatedButton
                label="Submit Budget"
                buttonColor="rgba(198, 158, 30, 1)"
                textColor="black"
                onClick={(e) => handleBudgetSubmit(e)}
              />
            </form>
          ) : (
            <AnimatedButton
              label="Update Budget"
              buttonColor="rgba(198, 158, 30, 1)"
              textColor="black"
              onClick={() => setShowBudgetForm(true)}
            />
          )}
        </li>

        <li className="mb-2">
          <span>Saving Goals:</span>
          <strong className="float-right">₹{financeOverview.savingGoals}</strong>
          {showSavingGoalForm ? (
            <form onSubmit={handleSavingGoalSubmit}>
              <input
                type="number"
                value={savingGoal}
                onChange={(e) => setSavingGoal(parseInt(e.target.value, 10))}
                className="mt-1 p-2 bg-gray-900 w-full border text-gold-300 border-gold-600 rounded-md"
              />
              <AnimatedButton
                label="Submit Saving Goal"
                buttonColor="rgba(198, 158, 30, 1)"
                textColor="black"
                onClick={(e) => handleSavingGoalSubmit(e)}
              />
            </form>
          ) : (
            <AnimatedButton
              label="Update Saving Goal"
              buttonColor="rgba(198, 158, 30, 1)"
              textColor="black"
              onClick={() => setShowSavingGoalForm(true)}
            />
          )}
        </li>

        <li className="mb-2">
          <span>Total Spendings:</span>
          <strong className="float-right">₹{financeOverview.totalSpendings}</strong>
        </li>

        <li className='mb-2'>
          <Link to='/ExpenseManager'>
            <AnimatedButton label='Manage Expenses' buttonColor='lightgreen' textColor='black' />
          </Link>
        </li>

        <li className="mb-2">
          <span>Total Income:</span>
          <strong className="float-right">₹{financeOverview.totalIncome}</strong>
        </li>

        <li className='mb-2'>
          <Link to='/IncomeManager'>
            <AnimatedButton label='Manage Incomes' buttonColor='lightgreen' textColor='black' />
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
