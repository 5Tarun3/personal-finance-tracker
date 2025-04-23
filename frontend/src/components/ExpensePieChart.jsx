import React, { useEffect, useState, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import { Wallet, ShoppingCart, Home, Car, Coffee, Utensils, BookOpen, Laptop, Gift, Film, Plane, Plus } from 'lucide-react';

const FinancePieChart = ({ type = 'expense' }) => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [excludedCategories, setExcludedCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSegment, setActiveSegment] = useState(null);
  const chartRef = useRef(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  // Define colors for chart segments
  const chartColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
    '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#FF595E',
    '#6A4C93', '#06D6A0'
  ];

  // Icon mapping for categories
  const categoryIcons = {
    'Food': <Utensils size={16} />,
    'Housing': <Home size={16} />,
    'Transportation': <Car size={16} />,
    'Entertainment': <Film size={16} />,
    'Shopping': <ShoppingCart size={16} />,
    'Education': <BookOpen size={16} />,
    'Technology': <Laptop size={16} />,
    'Gifts': <Gift size={16} />,
    'Travel': <Plane size={16} />,
    'Coffee': <Coffee size={16} />,
    'Salary': <Wallet size={16} />,
    'Other': <Plus size={16} />
  };

  // Default icon for categories without explicit mapping
  const getIconForCategory = (category) => {
    return categoryIcons[category] || <Plus size={16} />;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const endpoint = type === 'expense' ? 
          `${API_BASE}/api/expenses/get` : 
          `${API_BASE}/api/incomes/get`;
        
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error(`Failed to fetch ${type} data`);

        const result = await response.json();
        if (!Array.isArray(result)) throw new Error('Unexpected data format');

        const totalsByCategory = result.reduce((acc, item) => {
          acc[item.category] = (acc[item.category] || 0) + item.amount;
          return acc;
        }, {});

        const uniqueCategories = Object.keys(totalsByCategory);
        const groupedData = uniqueCategories.map(category => ({
          category,
          amount: totalsByCategory[category],
        }));

        setData(groupedData);
        setCategories(uniqueCategories);
      } catch (error) {
        console.error(`Error fetching ${type} data:`, error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type]);

  const handleExcludeCategory = (category) => {
    setExcludedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const filteredData = data.filter(item => !excludedCategories.includes(item.category));

  const chartData = {
    labels: filteredData.map(item => item.category),
    datasets: [{
      data: filteredData.map(item => item.amount),
      backgroundColor: filteredData.map((_, index) => chartColors[index % chartColors.length]),
      borderWidth: 1,
      borderColor: '#383838',
      hoverBorderWidth: 2,
      hoverBorderColor: '#fff',
    }],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.getDatasetMeta(0).total;
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        },
        backgroundColor: '#333',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#555',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
      }
    },
    responsive: true,
    maintainAspectRatio: true,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const category = filteredData[index].category;
        handleExcludeCategory(category);
      }
    },
    onHover: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setActiveSegment(filteredData[index].category);
      } else {
        setActiveSegment(null);
      }
    }
  };

  // Calculate total
  const total = filteredData.reduce((sum, item) => sum + item.amount, 0);

  if (isLoading) return <div className="flex justify-center items-center h-64 text-white bg-gray-800 rounded-lg">Loading chart data...</div>;
  if (error) return <div className="text-red-400 text-center p-4 bg-gray-800 rounded-lg">Error: {error}</div>;
  if (!data.length) return <div className="text-white text-center p-4 bg-gray-800 rounded-lg">No {type} data available</div>;

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-center text-xl font-bold mb-6 text-white">
        {type === 'expense' ? 'Expense' : 'Income'} Distribution
      </h2>
      
      <div className="flex flex-col md:flex-row gap-8 justify-between items-center">
        <div className="w-full md:w-1/2 max-w-md">
          <div className="relative">
            <Pie ref={chartRef} data={chartData} options={options} />
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
            <h3 className="font-semibold mb-3 text-white flex items-center gap-2">
              <span className="bg-blue-400 h-1 w-6 rounded-full"></span>
              Categories
            </h3>
            
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {categories.map((category, index) => {
                const colorIndex = index % chartColors.length;
                const itemAmount = data.find(item => item.category === category)?.amount || 0;
                const percentage = Math.round((itemAmount / total) * 100) || 0;
                const isActive = activeSegment === category;
                
                return (
                  <div 
                    key={category} 
                    className={`flex items-center justify-between p-2 rounded-md transition-all duration-200 ${
                      excludedCategories.includes(category) 
                        ? 'bg-gray-600 text-gray-400 opacity-50' 
                        : isActive
                          ? 'bg-gray-600 text-white ring-2 ring-offset-1 ring-offset-gray-700 ring-blue-400'
                          : 'bg-gray-800 text-white hover:bg-gray-600'
                    }`}
                    onMouseEnter={() => setActiveSegment(category)}
                    onMouseLeave={() => setActiveSegment(null)}
                  >
                    <label className="flex items-center gap-2 cursor-pointer w-full">
                      <input
                        type="checkbox"
                        checked={!excludedCategories.includes(category)}
                        onChange={() => handleExcludeCategory(category)}
                        className="h-4 w-4 rounded border-gray-500 text-blue-600 focus:ring-blue-500 bg-gray-700"
                      />
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: chartColors[colorIndex] }}
                      />
                      <span className="flex items-center gap-1 text-sm">
                        {getIconForCategory(category)}
                        {category}
                      </span>
                    </label>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">${itemAmount.toFixed(2)}</div>
                      <div className="text-xs text-gray-300">{percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #4a4a4a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6a6a6a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7a7a7a;
        }
      `}</style>
    </div>
  );
};

export default FinancePieChart;