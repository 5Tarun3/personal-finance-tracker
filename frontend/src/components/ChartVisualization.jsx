// src/components/ChartVisualization.jsx
import React, { useRef, useEffect, useState } from 'react';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

// Register necessary chart types and scales
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartVisualization = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const fetchChartData = async (year) => {
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
      const response = await axios.get(`${API_BASE}/api/incomes/monthwise-net/${year}`, config);
      const months = response.data.map(item => item.month);
      const netAmounts = response.data.map(item => item.net);
      setChartData({
        labels: months,
        datasets: [
          {
            label: 'Net Gain/Loss',
            data: netAmounts,
            backgroundColor: netAmounts.map(amount => amount >= 0 ? 'rgba(54, 162, 235, 0.6)' : 'rgba(255, 99, 132, 0.6)'),
            borderColor: netAmounts.map(amount => amount >= 0 ? 'rgba(54, 162, 235, 1)' : 'rgba(255, 99, 132, 1)'),
            borderWidth: 1,
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
        text: `Monthwise Net Gain/Loss - ${selectedYear}`,
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
      {chartData && <Bar ref={chartRef} data={chartData} options={options} />}
      {!chartData && <p>No data available.</p>}
    </div>
  );
};

export default ChartVisualization;
