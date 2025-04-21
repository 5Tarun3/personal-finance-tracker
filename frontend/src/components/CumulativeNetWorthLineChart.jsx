import React, { useRef, useEffect, useState } from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

// Register necessary chart types and scales
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CumulativeNetWorthLineChart = () => {
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
      const response = await axios.get(`http://localhost:8000/api/incomes/monthwise-net/${year}`, config);
      const months = response.data.map(item => item.month);
      const netAmounts = response.data.map(item => item.net);

      // Calculate cumulative net worth
      const cumulativeNet = [];
      netAmounts.reduce((acc, val, idx) => {
        const cumVal = acc + val;
        cumulativeNet[idx] = cumVal;
        return cumVal;
      }, 0);

      // Calculate projection based on average monthly net gain/loss
      const avgMonthlyNet = netAmounts.reduce((a, b) => a + b, 0) / netAmounts.length;
      const lastCumulative = cumulativeNet.length > 0 ? cumulativeNet[cumulativeNet.length - 1] : 0;
      const projection = [];
      for (let i = 0; i < 12; i++) {
        projection[i] = lastCumulative + avgMonthlyNet * (i + 1);
      }

      setChartData({
        labels: months,
        datasets: [
          {
            label: 'Cumulative Net Worth',
            data: cumulativeNet,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false,
            tension: 0.1,
          },
          {
            label: 'Projection',
            data: projection,
            borderColor: 'rgba(255, 206, 86, 1)',
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            borderDash: [10,5],
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
        text: `Cumulative Net Worth Over Time - ${selectedYear}`,
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

export default CumulativeNetWorthLineChart;
