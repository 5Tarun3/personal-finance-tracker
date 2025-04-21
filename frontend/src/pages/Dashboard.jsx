import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChartVisualization from '../components/ChartVisualization';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import AnimatedButton from '../components/AnimatedButton';
import FinancePieChart from '../components/FinancePieChart';
import CumulativeNetWorthLineChart from '../components/CumulativeNetWorthLineChart';
import IncomeVsExpenseLineChart from '../components/IncomeVsExpenseLineChart';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [financeOverview, setFinanceOverview] = useState(null);

  const fetchFinanceOverview = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      const response = await axios.get('http://localhost:8000/api/finance-overview', config);
      setFinanceOverview(response.data);
      setData({
        labels: ['Expenses', 'Incomes'],
        datasets: [
          {
            label: 'Finance Overview',
            data: [response.data.totalExpenses, response.data.totalIncomes],
            backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)'],
            borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching finance overview:", error);
      alert("Failed to fetch finance overview. Please check your connection and try again.");
      setFinanceOverview(null);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchFinanceOverview();
      setLoading(false);
      console.log("Finance overview fetched successfully:", financeOverview);
    };

    fetchData();
  }, []);

  const loadingVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  if (loading) {
    return (
      <motion.div
        variants={loadingVariants}
        initial="hidden"
        animate="visible"
        className="flex justify-center items-center h-screen text-amber-300 text-center"
      >
        Loading...
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row p-6 min-h-screen ">
      <Sidebar />
      <div className="md:w-3/4 rounded-lg shadow-lg p-4 mt-4 md:mt-0 md:ml-4 bg-gradient-to-br from-slate-800 to-slate-900">
        <h2 className="text-lg text-gold-300 font-bold">Statistics</h2>
        {financeOverview && (
          <div>
            <h2 className="text-gold-300 text-lg font-bold mt-4">Monthly Overview</h2>
            <h3 className="text-gold-300">Current Month Expenses: ₹{financeOverview.totalExpenses}</h3>
            <h3 className="text-gold-300">Current Month Income: ₹{financeOverview.totalIncomes}</h3>
            <h3 className="text-gold-300">Net: {financeOverview.net > 0 ? `₹${financeOverview.net} Gain` : `₹${Math.abs(financeOverview.net)} Loss`}</h3>
            <ChartVisualization data={data} />
            
          </div>
        )}
        <CumulativeNetWorthLineChart />
        <IncomeVsExpenseLineChart />
        <FinancePieChart type="expense" />
        <FinancePieChart type="income" />
      </div>
    </div>
  );
};

export default Dashboard;
