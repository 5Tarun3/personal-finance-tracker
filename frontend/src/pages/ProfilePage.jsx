import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  Settings,
  LogOut,
  DollarSign,
  TrendingUp,
  CreditCard,
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProfilePage = () => {
  // Hardcoded user data
  const user = {
    totalIncome: 125000,
    netWorth: 350000,
    totalExpenses: 45000,
  };
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // Hardcoded monthly savings data for the graph
  const savingsData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'Monthly Savings',
        data: [1000, 1200, 900, 1500, 1300, 1700, 1600, 1800, 1400, 1900, 2000, 2100],
        fill: true,
        backgroundColor: 'rgba(76, 217, 100, 0.2)',
        borderColor: 'rgba(76, 217, 100, 1)',
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: '#4CD964', // green color consistent with theme
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: 'Savings Over the Year',
        color: '#4CD964',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(76, 217, 100, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#A0AEC0', // grayish text
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
      },
      y: {
        ticks: {
          color: '#A0AEC0',
          font: {
            size: 12,
          },
          callback: function(value) {
            return '₹' + value;
          },
        },
        grid: {
          color: 'rgba(255,255,255,0.1)',
        },
      },
    },
  };

  return (
    <div className="bg-[#121317] min-h-screen text-white flex">
      {/* Sidebar */}
      <div className="w-[280px] bg-[#1C1D22] p-6 flex flex-col">
        {/* Profile Circle */}
        <div className="w-40 h-40 rounded-full border-4 border-green-500 mx-auto mb-6"></div>

        {/* Profile Actions */}
        <div className="space-y-4 mt-6">
          <button className="w-full bg-[#2C2D33] text-white py-3 rounded-lg flex items-center justify-center hover:bg-[#3C3D43] transition">
            <Settings className="mr-2" size={20} /> Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-[#2C2D33] text-white py-3 rounded-lg flex items-center justify-center hover:bg-[#3C3D43] transition"
          >
            <LogOut className="mr-2" size={20} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 space-y-8">
        {/* Financial Summary */}
        <div className="bg-[#1C1D22] rounded-2xl p-6">
          <h2 className="text-2xl font-semibold mb-6">Financial Summary</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-[#2C2D33] rounded-2xl p-4 text-center">
              <DollarSign className="mx-auto mb-2 text-green-500" size={32} />
              <p className="text-gray-400 mb-2">Total Income</p>
              <h3 className="text-2xl font-bold">₹{user.totalIncome.toLocaleString()}</h3>
            </div>
            <div className="bg-[#2C2D33] rounded-2xl p-4 text-center">
              <TrendingUp className="mx-auto mb-2 text-blue-500" size={32} />
              <p className="text-gray-400 mb-2">Net Worth</p>
              <h3 className="text-2xl font-bold">₹{user.netWorth.toLocaleString()}</h3>
            </div>
            <div className="bg-[#2C2D33] rounded-2xl p-4 text-center">
              <CreditCard className="mx-auto mb-2 text-purple-500" size={32} />
              <p className="text-gray-400 mb-2">Expenses</p>
              <h3 className="text-2xl font-bold">₹{user.totalExpenses.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        {/* Savings Graph */}
        <div className="bg-[#1C1D22] rounded-2xl p-6">
          <Line data={savingsData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
