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
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaArrowDown } from "react-icons/fa"
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [financeOverview, setFinanceOverview] = useState(null);
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      window.location.reload();
    }
  }, [navigate]);
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
        navigate('/login');
          window.location.reload();
        return;
      }
      
      const response = await axios.get(`${API_BASE}/api/finance-overview`, config);
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
  const date = new Date();
const monthYear = date.toLocaleString('default', {
  month: 'long',
  year: 'numeric'
});


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
          <div className="hero-image">
            <div className="dashboard-preview">
              <div className="preview-header">
                <div className="preview-header-text">
                  <h3>Your Financial Summary</h3>
                  <p>{monthYear}</p>
                </div>
              </div>
          
              <div className="preview-charts">
                <div className="stats-container">
                  <div className="stat-item">
                    <div className="stat-icon expense">
                      <FaArrowDown />
                    </div>
                    <div className="stat-details">
                      <span className="stat-title">Current Month Expenses</span>
                      <span className="stat-value">₹{financeOverview.totalExpenses}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon income">
                      <FaArrowUp />
                    </div>
                    <div className="stat-details">
                      <span className="stat-title">Current Month Income</span>
                      <span className="stat-value">₹{financeOverview.totalIncomes}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className={`stat-icon ${financeOverview.net > 0 ? 'savings' : 'expense'}`}>
                      {financeOverview.net > 0 ? <FaArrowUp /> : <FaArrowDown />}
                    </div>
                    <div className="stat-details">
                      <span className="stat-title">Net</span>
                      <span className={`stat-value ${financeOverview.net > 0 ? 'positive' : 'negative'}`}>
                        {financeOverview.net > 0
                          ? `₹${financeOverview.net} Gain`
                          : `₹${Math.abs(financeOverview.net)} Loss`}{" "}
                        {financeOverview.net > 0 ? <FaArrowUp /> : <FaArrowDown />}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        
        )}
        <ChartVisualization data={data} />
        <CumulativeNetWorthLineChart />
        <IncomeVsExpenseLineChart />
        <FinancePieChart type="expense" />
        <FinancePieChart type="income" />
      </div>
    </div>
  );
};

export default Dashboard;
