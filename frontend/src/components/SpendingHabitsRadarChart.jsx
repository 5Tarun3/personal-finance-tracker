import React, { useEffect, useState, useRef } from 'react';
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import axios from 'axios';

// Register necessary chart components
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title);

const SpendingHabitsRadarChart = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpendingData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get('http://localhost:8000/api/expenses/get', config);
      const expenses = response.data;

      // Aggregate totals by category
      const totalsByCategory = {};
      expenses.forEach(expense => {
        totalsByCategory[expense.category] = (totalsByCategory[expense.category] || 0) + expense.amount;
      });

      const categories = Object.keys(totalsByCategory);
      const amounts = categories.map(cat => totalsByCategory[cat]);

      // Normalize amounts for relative comparison
      const maxAmount = Math.max(...amounts);
      const normalizedAmounts = amounts.map(amount => (maxAmount > 0 ? amount / maxAmount : 0));

      setData({
        labels: categories,
        datasets: [
          {
            label: 'Spending Habits',
            data: normalizedAmounts,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          },
        ],
      });
    } catch (err) {
      setError('Failed to fetch spending data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpendingData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>No data available</p>;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#fff', // Bright white by default
          generateLabels: (chart) => {
            const colors = [
              '#FF6384', // Bright pink
              '#36A2EB', // Bright blue
              '#FFCE56', // Bright yellow
              '#4BC0C0', // Bright cyan
              '#9966FF', // Bright purple
              '#FF9F40', // Bright orange
            ];
            return chart.data.datasets.map((dataset, i) => ({
              text: dataset.label,
              fillStyle: colors[i % colors.length],
              strokeStyle: colors[i % colors.length],
              lineWidth: 2,
              hidden: !chart.isDatasetVisible(i),
              index: i,
            }));
          },
        },
      },
      title: {
        display: true,
        text: 'Spending Habits Breakdown',
        color: '#fff',
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${(value * 100).toFixed(1)}% of max spending`;
          },
        },
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 0.2,
          callback: (value) => `${value * 100}%`,
          color: '#fff', // Bright ticks
          backdropColor: 'transparent',
          font: {
            size: 12,
          },
        },
        pointLabels: {
          font: {
            size: 14,
          },
          color: '#fff', // Bright white labels
        },
        grid: {
          color: 'rgba(153, 102, 255, 0.6)', // Bright purple circles
          lineWidth: 2,
        },
        angleLines: {
          color: 'rgba(153, 102, 255, 0.6)', // Bright purple angle lines
          lineWidth: 1.5,
        },
      },
    },
  };
  
  

  return <Radar ref={chartRef} data={data} options={options} />;
};

export default SpendingHabitsRadarChart;
