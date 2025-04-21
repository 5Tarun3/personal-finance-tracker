import React, { useRef, useEffect, useState } from 'react';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

// Register necessary chart types and scales
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const majorCategories = [
  "Food",
  "Entertainment/Luxury",
  "Travel",
  "Furniture",
  "Emergency",
  "Groceries/Home Supplies",
  "Education fees",
  "House Bills",
  "Services/Hired Help",
  "Loan payment",
  "Miscellaneous"
];

const CategoryTrendOverTime = () => {
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

      const response = await axios.get(`http://localhost:5000/api/expenses/category-trend/${year}`, config);
      const data = response.data; // Array of { month, categories: { categoryName: totalAmount } }

      // Prepare labels (months)
      const monthLabels = Array.from({ length: 12 }, (_, i) => i + 1);

      // Prepare datasets for major categories
      const datasets = majorCategories.map((category, idx) => {
        const dataPoints = monthLabels.map(month => {
          const monthData = data.find(d => d.month === month);
          return monthData && monthData.categories[category] ? monthData.categories[category] : 0;
        });
        const colorPalette = [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#FF595E', '#6A4C93'
        ];
        return {
          label: category,
          data: dataPoints,
          borderColor: colorPalette[idx % colorPalette.length],
          backgroundColor: colorPalette[idx % colorPalette.length] + '80',
          fill: false,
          tension: 0.1,
        };
      });

      setChartData({
        labels: monthLabels.map(m => new Date(0, m - 1).toLocaleString('default', { month: 'short' })),
        datasets,
      });
    } catch (error) {
      console.error("Error fetching category trend data:", error);
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
        maxHeight: 100,
        labels: {
          boxWidth: 12,
          padding: 10,
        },
      },
      title: {
        display: true,
        text: `Category Trend Over Time - ${selectedYear}`,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Month',
        },
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

export default CategoryTrendOverTime;
