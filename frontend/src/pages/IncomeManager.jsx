import React, { useState, useEffect } from 'react';
import AddIncome from '../components/AddIncome';
import DisplayIncomes from '../components/DisplayIncomes';
import UpdateIncome from '../components/UpdateIncome';
import ExcelUploadIncomeButton from '../components/ExcelUploadIncomeButton';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';



const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

const filterOptions = {
  source: [
    "bonus", "primary salary", "investment returns", "fixed deposit/interest", 
    "rental income", "business profit", "gift money", "royalty income", "other"
  ],
  amount: ["less than", "between", "greater than"],
  date: ["before", "between", "after"]
};

const IncomeManager = () => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [incomeToUpdate, setIncomeToUpdate] = useState(null);
  const [refetchIncomes, setRefetchIncomes] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [filteredIncomes, setFilteredIncomes] = useState([]);
  const navigate = useNavigate();
  // Active filters
  const [sourceFilter, setSourceFilter] = useState([]);
  const [amountFilter, setAmountFilter] = useState({ active: false, type: '', value1: '', value2: '' });
  const [dateFilter, setDateFilter] = useState({ active: false, type: '', value1: '', value2: '' });
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  // Collapsible sections
  const handleUpdateClick = (income) => {
    setShowUpdateForm(true);
    setIncomeToUpdate(income);
  };

  const handleCloseUpdateForm = () => {
    setShowUpdateForm(false);
    setIncomeToUpdate(null);
    setRefetchIncomes(prev => !prev); // Toggle to trigger refetch
  };

  const fetchIncomes = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_BASE}/api/incomes/get`, config);
      return response.data;
    } catch (error) {
      console.error("Error fetching incomes:", error);
      return []; // Return an empty array if there's an error
    }
  };

  // Handle source filter changes
  const handleSourceFilterChange = (source) => {
    setSourceFilter(prev => {
      if (prev.includes(source)) {
        return prev.filter(item => item !== source);
      } else {
        return [...prev, source];
      }
    });
  };

  // Handle amount filter changes
  const handleAmountFilterChange = (field, value) => {
    setAmountFilter(prev => ({
      ...prev,
      [field]: value,
      active: field === 'type' || prev.active
    }));
  };

  // Handle date filter changes
  const handleDateFilterChange = (field, value) => {
    setDateFilter(prev => ({
      ...prev,
      [field]: value,
      active: field === 'type' || prev.active
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSourceFilter([]);
    setAmountFilter({ active: false, type: '', value1: '', value2: '' });
    setDateFilter({ active: false, type: '', value1: '', value2: '' });
  };

  // Apply filters
  const applyFilters = () => {
    let result = [...incomes];
    
    // Apply source filter
    if (sourceFilter.length > 0) {
      result = result.filter(income => sourceFilter.includes(income.source));
    }
    
    // Apply amount filter
    if (amountFilter.active && amountFilter.type) {
      const amount1 = parseFloat(amountFilter.value1);
      const amount2 = parseFloat(amountFilter.value2);
      
      switch (amountFilter.type) {
        case 'less than':
          if (!isNaN(amount1)) {
            result = result.filter(income => parseFloat(income.amount) < amount1);
          }
          break;
        case 'greater than':
          if (!isNaN(amount1)) {
            result = result.filter(income => parseFloat(income.amount) > amount1);
          }
          break;
        case 'between':
          if (!isNaN(amount1) && !isNaN(amount2)) {
            result = result.filter(income => 
              parseFloat(income.amount) >= amount1 && 
              parseFloat(income.amount) <= amount2
            );
          }
          break;
        default:
          break;
      }
    }
    
    // Apply date filter
    if (dateFilter.active && dateFilter.type) {
      switch (dateFilter.type) {
        case 'before':
          if (dateFilter.value1) {
            result = result.filter(income => 
              new Date(income.date) < new Date(dateFilter.value1)
            );
          }
          break;
        case 'after':
          if (dateFilter.value1) {
            result = result.filter(income => 
              new Date(income.date) > new Date(dateFilter.value1)
            );
          }
          break;
        case 'between':
          if (dateFilter.value1 && dateFilter.value2) {
            result = result.filter(income => {
              const incomeDate = new Date(income.date);
              return incomeDate >= new Date(dateFilter.value1) && 
                     incomeDate <= new Date(dateFilter.value2);
            });
          }
          break;
        default:
          break;
      }
    }
    
    setFilteredIncomes(result);
  };
  useEffect(() => {
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            window.location.reload();
          }
        }, [navigate]);
  // Fetch incomes when component mounts or refetch is triggered
  useEffect(() => {
    const getIncomes = async () => {
      const incomesData = await fetchIncomes();
      setIncomes(incomesData);
      setFilteredIncomes(incomesData);
    };
    getIncomes();
  }, [refetchIncomes]);

  // Apply filters whenever filters change
  useEffect(() => {
    applyFilters();
  }, [sourceFilter, amountFilter, dateFilter, incomes]);

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Incomes");
  
    // Define headers
    worksheet.columns = [
      { header: "Source", key: "source", width: 20 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Date", key: "date", width: 20 },
    ];
  
    // Add data
    filteredIncomes.forEach(income => worksheet.addRow(income));
  
    // Create the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
    // Trigger download
    saveAs(blob, "IncomeData.xlsx");
  };
  return (
    <div className="flex justify-center w-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-gradient-to-br from-gray-900 to-black min-h-screen p-8 w-full max-w-5xl"
      >
        <h1 className="text-3xl text-amber-400 font-bold mb-8 text-center">Income Manager</h1>
        
        <div className="flex flex-col items-center w-full">
          <motion.div
            className="bg-gray-700 p-6 rounded-lg shadow-md border-2 border-black-500 w-full mb-8"
            whileHover={{ scale: 1.02, boxShadow: "0px 0px 16px rgba(128,0,128,0.5)" }}
          >
            <AddIncome refetchIncomes={refetchIncomes} setRefetchIncomes={setRefetchIncomes} />
          </motion.div>

          {/* Download Button */}
          <div className="flex flex-col" >
          <motion.button
            onClick={downloadExcel}
            className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded flex items-center gap-2 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <FaDownload /> Download Income Data
          </motion.button>
            <ExcelUploadIncomeButton />

          </div>
          {/* Filter Section */}
          <motion.div 
            className="bg-gray-800 p-6 rounded-lg shadow-lg w-full mb-8" 
            whileHover={{ scale: 1.01 , boxShadow: "0px 0px 16px rgba(128,0,128,0.5)"}}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <FaSearch className="text-white text-xl" />
                <h3 className="text-white text-xl">Filter Incomes</h3>
              </div>
              <button 
                onClick={clearAllFilters}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded flex items-center gap-1"
              >
                <FaTimes /> Clear Filters
              </button>
            </div>

            {/* Source Filter */}
            <div className="mb-4">
              <h4 className="text-white mb-2">Source</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {filterOptions.source.map((item) => (
                  <label key={item} className="flex items-center gap-2 text-white">
                    <input 
                      type="checkbox" 
                      checked={sourceFilter.includes(item)}
                      onChange={() => handleSourceFilterChange(item)} 
                    /> 
                    {item}
                  </label>
                ))}
              </div>
            </div>

            {/* Amount Filter */}
            <div className="mb-4">
              <h4 className="text-white mb-2">Amount</h4>
              <div className="flex flex-col gap-2">
                <select 
                  className="bg-gray-700 text-white p-2 rounded" 
                  value={amountFilter.type}
                  onChange={(e) => handleAmountFilterChange('type', e.target.value)}
                >
                  <option value="">Select Amount Filter</option>
                  {filterOptions.amount.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                
                {amountFilter.type === 'between' ? (
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Min Amount" 
                      className="bg-gray-700 p-2 text-white rounded w-full" 
                      value={amountFilter.value1}
                      onChange={(e) => handleAmountFilterChange('value1', e.target.value)} 
                    />
                    <input 
                      type="number" 
                      placeholder="Max Amount" 
                      className="bg-gray-700 p-2 text-white rounded w-full" 
                      value={amountFilter.value2}
                      onChange={(e) => handleAmountFilterChange('value2', e.target.value)} 
                    />
                  </div>
                ) : amountFilter.type ? (
                  <input 
                    type="number" 
                    placeholder="Enter Amount" 
                    className="bg-gray-700 p-2 text-white rounded" 
                    value={amountFilter.value1}
                    onChange={(e) => handleAmountFilterChange('value1', e.target.value)} 
                  />
                ) : null}
              </div>
            </div>

            {/* Date Filter */}
            <div className="mb-4">
              <h4 className="text-white mb-2">Date</h4>
              <div className="flex flex-col gap-2">
                <select 
                  className="bg-gray-700 text-white p-2 rounded" 
                  value={dateFilter.type}
                  onChange={(e) => handleDateFilterChange('type', e.target.value)}
                >
                  <option value="">Select Date Filter</option>
                  {filterOptions.date.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                
                {dateFilter.type === 'between' ? (
                  <div className="flex gap-2">
                    <input 
                      type="date" 
                      className="bg-gray-700 p-2 text-white rounded w-full" 
                      value={dateFilter.value1}
                      onChange={(e) => handleDateFilterChange('value1', e.target.value)} 
                    />
                    <input 
                      type="date" 
                      className="bg-gray-700 p-2 text-white rounded w-full" 
                      value={dateFilter.value2}
                      onChange={(e) => handleDateFilterChange('value2', e.target.value)} 
                    />
                  </div>
                ) : dateFilter.type ? (
                  <input 
                    type="date" 
                    className="bg-gray-700 p-2 text-white rounded" 
                    value={dateFilter.value1}
                    onChange={(e) => handleDateFilterChange('value1', e.target.value)} 
                  />
                ) : null}
              </div>
            </div>

            <div className="mt-2 text-gray-300">
              {filteredIncomes.length} of {incomes.length} incomes shown
            </div>
          </motion.div>

          {/* Income List */}
          <motion.div
            className="bg-gray-700 p-6 rounded-lg shadow-md border-2 border-black-500 w-full"
            whileHover={{  boxShadow: "0px 0px 16px rgba(128,0,128,0.5)" }}
          >
            <DisplayIncomes 
              onUpdateClick={handleUpdateClick} 
              refetchIncomes={refetchIncomes}
              incomes={filteredIncomes} 
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Update Form Sidebar */}
      {showUpdateForm && incomeToUpdate && (
        <motion.div
          className="fixed right-0 w-full md:w-1/3 md:h-1/2 bg-gray-800 p-6 shadow-lg z-20 align-top justify-center min-h-screen"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
        >
          <button 
            onClick={handleCloseUpdateForm} 
            className="text-white hover:text-amber-400 mb-4"
          >
            ← Back to Incomes
          </button>
          <UpdateIncome income={incomeToUpdate} onClose={handleCloseUpdateForm} />
        </motion.div>
      )}
    </div>
  );
};

export default IncomeManager;
