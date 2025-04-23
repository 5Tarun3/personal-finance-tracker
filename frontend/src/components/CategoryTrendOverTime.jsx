import React, { useRef, useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

// Register necessary chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
  const [selectedCategories, setSelectedCategories] = useState(majorCategories.slice(0, 5)); // Start with first 5 categories to avoid clutter
  const [rawData, setRawData] = useState(null); // Store the raw data for reprocessing
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
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

      const response = await axios.get(`${API_BASE}/api/expenses/category-trend/${year}`, config);
      const data = response.data;
      console.log("Category trend data received:", data);
      
      // Store the raw data
      setRawData(data);
      
      // Prepare labels (months)
      const monthLabels = Array.from({ length: 12 }, (_, i) => i + 1);

      // Process data for chart
      processChartData(monthLabels, data);
    } catch (error) {
      console.error("Error fetching category trend data:", error);
      setChartData(null);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (monthLabels, data) => {
    // Prepare datasets for selected categories
    const colorPalette = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#FF595E', '#6A4C93'
    ];
    
    const datasets = selectedCategories.map((category, idx) => {
      const dataPoints = monthLabels.map(month => {
        const monthData = data.find(d => d.month === month);
        return monthData && monthData.categories[category] ? monthData.categories[category] : 0;
      });

      return {
        label: category,
        data: dataPoints,
        borderColor: colorPalette[idx % colorPalette.length],
        backgroundColor: colorPalette[idx % colorPalette.length] + '80',
        fill: false,
        tension: 0.1,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      };
    });

    setChartData({
      labels: monthLabels.map(m => new Date(0, m - 1).toLocaleString('default', { month: 'short' })),
      datasets,
    });
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  useEffect(() => {
    fetchChartData(selectedYear);
  }, [selectedYear]);

  // Re-process chart data when selected categories change
  useEffect(() => {
    if (rawData) {
      const monthLabels = Array.from({ length: 12 }, (_, i) => i + 1);
      processChartData(monthLabels, rawData);
    }
  }, [selectedCategories, rawData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          padding: 10,
          color: '#E5E7EB', // Light text for dark theme
        },
      },
      title: {
        display: true,
        text: `Category Spending Trend - ${selectedYear}`,
        color: '#E5E7EB',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#FCD34D', // Gold color for title
        bodyColor: '#E5E7EB',
        borderColor: '#4B5563',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.raw.toFixed(2)}`;
          }
        }
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
          text: 'Amount ($)',
          color: '#E5E7EB',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)'
        },
        ticks: {
          color: '#E5E7EB',
          callback: function(value) {
            return '$' + value;
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Month',
          color: '#E5E7EB',
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)'
        },
        ticks: {
          color: '#E5E7EB'
        }
      },
    },
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value, 10));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 w-full">
      <h2 className="text-2xl text-amber-400 font-bold mb-4">Category Spending Trends</h2>
      
      <div className="flex flex-wrap items-center mb-4 gap-2">
        <select 
          value={selectedYear} 
          onChange={handleYearChange} 
          className="p-2 bg-gray-900 text-gold-300 border border-amber-600 rounded-md"
        >
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i} value={new Date().getFullYear() - i}>
              {new Date().getFullYear() - i}
            </option>
          ))}
        </select>
        
        <div className="flex-1"></div>
        
        <button 
          className="bg-amber-500 hover:bg-amber-400 text-black px-3 py-1 rounded text-sm"
          onClick={() => setSelectedCategories(majorCategories)}
        >
          Select All
        </button>
        <button 
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
          onClick={() => setSelectedCategories([])}
        >
          Clear All
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {majorCategories.map((category, idx) => {
          const colorPalette = [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#FF595E', '#6A4C93'
          ];
          const isSelected = selectedCategories.includes(category);
          
          return (
            <button
              key={category}
              onClick={() => handleCategoryToggle(category)}
              className={`px-2 py-1 text-xs rounded flex items-center gap-1 ${
                isSelected ? 'border-2' : 'border opacity-70'
              }`}
              style={{ 
                backgroundColor: isSelected ? colorPalette[idx % colorPalette.length] + '40' : 'transparent',
                borderColor: colorPalette[idx % colorPalette.length],
                color: isSelected ? '#ffffff' : '#d1d5db'
              }}
            >
              <span 
                className="inline-block w-3 h-3 rounded-full mr-1"
                style={{ backgroundColor: colorPalette[idx % colorPalette.length] }}
              ></span>
              {category}
            </button>
          );
        })}
      </div>
      
      <div className="h-80 w-full">
        {chartData && <Line ref={chartRef} data={chartData} options={options} />}
        {!chartData && <p className="text-gray-400 flex justify-center items-center h-full">No data available for selected year.</p>}
      </div>
    </div>
  );
};

export default CategoryTrendOverTime;