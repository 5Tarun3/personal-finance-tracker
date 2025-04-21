import React, { useRef, useEffect, useState } from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

// Register necessary chart types and scales
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const IncomeVsExpenseLineChart = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const fetchChartData = async (year) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("No token found in localStorage");
        setLoading(false);
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fetch monthly net data (income - expenses)
      const netResponse = await axios.get(`http://localhost:8000/api/incomes/monthwise-net/${year}`, config);
      const months = netResponse.data.map(item => item.month);

      // Fetch monthly income totals
      const incomeResponse = await axios.get(`http://localhost:8000/api/incomes/monthwise-total/${year}`, config).catch(() => null);
      // Fetch monthly expense totals
      const expenseResponse = await axios.get(`http://localhost:8000/api/expenses/monthwise-total/${year}`, config).catch(() => null);

      // Fallback if monthwise-total endpoints are not implemented, use netResponse data for months and zero arrays
      const incomeTotals = incomeResponse?.data?.map(item => item.total) || new Array(12).fill(0);
      const expenseTotals = expenseResponse?.data?.map(item => item.total) || new Array(12).fill(0);

      setChartData({
        labels: months,
        datasets: [
          {
            label: 'Income',
            data: incomeTotals,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
            tension: 0.1,
          },
          {
            label: 'Expense',
            data: expenseTotals,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false,
            tension: 0.1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData(selectedYear);
  }, [selectedYear]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Income vs Expense Over Time - ${selectedYear}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <select value={selectedYear} onChange={handleYearChange} className="mt-4 p-2 bg-gray-900 text-gold-300 border border-gold-600 rounded-md">
        {[...Array(10).keys()].map((i) => (
          <option key={i} value={new Date().getFullYear() - i}>
            {new Date().getFullYear() - i}
          </option>
        ))}
      </select>
      {chartData && <Line ref={chartRef} data={chartData} options={options} />}
      {!chartData && <p>No data available.</p>}
    </div>
  );
};

export default IncomeVsExpenseLineChart;
