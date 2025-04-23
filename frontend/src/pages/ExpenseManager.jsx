import React, { useState, useEffect } from 'react';
import AddExpense from '../components/AddExpense';
import DisplayExpenses from '../components/DisplayExpenses';
import UpdateExpense from '../components/UpdateExpense';
import DrillableSunburstChart from '../components/DrillableSunburstChart';
import CategoryTrendOverTime from '../components/CategoryTrendOverTime';
import SpendingHabitsRadarChart from '../components/SpendingHabitsRadarChart';
import ExcelUploadButton from '../components/ExcelUploadButton';
import { motion } from 'framer-motion';
import { FaSearch, FaTimes, FaDownload, FaChartPie, FaChartLine, FaChartBar, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useNavigate } from'react-router-dom';

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
};

const filterOptions = {
  category: [
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
  ],
  amount: ["less than", "between", "greater than"],
  date: ["before", "between", "after"]
};

const ExpenseManager = () => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [expenseToUpdate, setExpenseToUpdate] = useState(null);
  const [refetchExpenses, setRefetchExpenses] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [activeCharts, setActiveCharts] = useState({
    categoryTrend: true,
    sunburst: true,
    radar: true
  });
  const navigate = useNavigate();
  // Active filters
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [amountFilter, setAmountFilter] = useState({ active: false, type: '', value1: '', value2: '' });
  const [dateFilter, setDateFilter] = useState({ active: false, type: '', value1: '', value2: '' });
  
  // Collapsible sections
  const [collapsedSections, setCollapsedSections] = useState({
    filters: false,
    charts: {}
  });
  useEffect(() => {
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            window.location.reload();
          }
        }, [navigate]);
  const handleUpdateClick = (expense) => {
    setShowUpdateForm(true);
    setExpenseToUpdate(expense);
  };

  const handleCloseUpdateForm = () => {
    setShowUpdateForm(false);
    setExpenseToUpdate(null);
    setRefetchExpenses(prev => !prev); // Toggle to trigger refetch
  };

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_BASE}/api/expenses/get`, config);
      return response.data;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      return []; // Return an empty array if there's an error
    }
  };

  // Handle category filter changes
  const handleCategoryFilterChange = (category) => {
    setCategoryFilter(prev => {
      if (prev.includes(category)) {
        return prev.filter(item => item !== category);
      } else {
        return [...prev, category];
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
    setCategoryFilter([]);
    setAmountFilter({ active: false, type: '', value1: '', value2: '' });
    setDateFilter({ active: false, type: '', value1: '', value2: '' });
  };

  // Toggle chart visibility
  const toggleChart = (chartName) => {
    setActiveCharts(prev => ({
      ...prev,
      [chartName]: !prev[chartName]
    }));
  };

  // Toggle section collapse
  const toggleSectionCollapse = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Toggle chart collapse
  const toggleChartCollapse = (chartName) => {
    setCollapsedSections(prev => ({
      ...prev,
      charts: {
        ...prev.charts,
        [chartName]: !prev.charts[chartName]
      }
    }));
  };

  // Apply filters
  const applyFilters = () => {
    let result = [...expenses];
    
    // Apply category filter
    if (categoryFilter.length > 0) {
      result = result.filter(expense => categoryFilter.includes(expense.category));
    }
    
    // Apply amount filter
    if (amountFilter.active && amountFilter.type) {
      const amount1 = parseFloat(amountFilter.value1);
      const amount2 = parseFloat(amountFilter.value2);
      
      switch (amountFilter.type) {
        case 'less than':
          if (!isNaN(amount1)) {
            result = result.filter(expense => parseFloat(expense.amount) < amount1);
          }
          break;
        case 'greater than':
          if (!isNaN(amount1)) {
            result = result.filter(expense => parseFloat(expense.amount) > amount1);
          }
          break;
        case 'between':
          if (!isNaN(amount1) && !isNaN(amount2)) {
            result = result.filter(expense => 
              parseFloat(expense.amount) >= amount1 && 
              parseFloat(expense.amount) <= amount2
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
            result = result.filter(expense => 
              new Date(expense.date) < new Date(dateFilter.value1)
            );
          }
          break;
        case 'after':
          if (dateFilter.value1) {
            result = result.filter(expense => 
              new Date(expense.date) > new Date(dateFilter.value1)
            );
          }
          break;
        case 'between':
          if (dateFilter.value1 && dateFilter.value2) {
            result = result.filter(expense => {
              const expenseDate = new Date(expense.date);
              return expenseDate >= new Date(dateFilter.value1) && 
                     expenseDate <= new Date(dateFilter.value2);
            });
          }
          break;
        default:
          break;
      }
    }
    
    setFilteredExpenses(result);
  };

  // Fetch expenses when component mounts or refetch is triggered
  useEffect(() => {
    const getExpenses = async () => {
      const expensesData = await fetchExpenses();
      setExpenses(expensesData);
      setFilteredExpenses(expensesData);
    };
    getExpenses();
  }, [refetchExpenses]);

  // Apply filters whenever filters change
  useEffect(() => {
    applyFilters();
  }, [categoryFilter, amountFilter, dateFilter, expenses]);

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Expenses");
  
    // Define headers
    worksheet.columns = [
      { header: "Category", key: "category", width: 20 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Date", key: "date", width: 20 },
    ];
  
    // Add data
    filteredExpenses.forEach(expense => worksheet.addRow(expense));
  
    // Create the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
    // Trigger download
    saveAs(blob, "ExpenseData.xlsx");
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
        <h1 className="text-3xl text-amber-400 font-bold mb-8 text-center">Expense Manager</h1>
        
        <div className="flex flex-col items-center w-full">
          <motion.div
            className="bg-gray-700 p-6 rounded-lg shadow-md border-2 border-black-500 w-full mb-8"
             whileHover={{ boxShadow: "0px 0px 16px rgba(128,0,128,0.5)" }}
          >
            <AddExpense refetchExpenses={refetchExpenses} setRefetchExpenses={setRefetchExpenses} />
          </motion.div>
          
          <div className="flex flex-wrap gap-4 w-full mb-6">
            <motion.button
              onClick={downloadExcel}
              className="bg-green-500 hover:bg-green-400 text-white px-4 py-2 rounded flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <FaDownload /> Download Expense Data
            </motion.button>
            <ExcelUploadButton />
            <div className="flex-grow"></div>
            
            <div className="flex gap-2">
              <motion.button
                onClick={() => toggleChart('categoryTrend')}
                className={`px-3 py-2 rounded flex items-center gap-1 text-sm ${
                  activeCharts.categoryTrend ? 'bg-amber-500 text-black' : 'bg-gray-700 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaChartLine /> Trends
              </motion.button>
              
              <motion.button
                onClick={() => toggleChart('sunburst')}
                className={`px-3 py-2 rounded flex items-center gap-1 text-sm ${
                  activeCharts.sunburst ? 'bg-amber-500 text-black' : 'bg-gray-700 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaChartPie /> Distribution
              </motion.button>
              
              <motion.button
                onClick={() => toggleChart('radar')}
                className={`px-3 py-2 rounded flex items-center gap-1 text-sm ${
                  activeCharts.radar ? 'bg-amber-500 text-black' : 'bg-gray-700 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaChartBar /> Habits
              </motion.button>
            </div>
          </div>

          
          
          {/* CHARTS */}
          {activeCharts.categoryTrend && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className="flex justify-between items-center cursor-pointer bg-gray-800 p-4 rounded-t-lg border-b border-gray-700"
                onClick={() => toggleChartCollapse('categoryTrend')}
              >
                <div className="flex items-center gap-2">
                  <FaChartLine className="text-amber-400" />
                  <h3 className="text-amber-400 font-bold">Category Trends Over Time</h3>
                </div>
                {collapsedSections.charts.categoryTrend ? <FaChevronDown className="text-white" /> : <FaChevronUp className="text-white" />}
              </div>
              {!collapsedSections.charts.categoryTrend && <CategoryTrendOverTime />}
            </motion.div>
          )}
          
          {activeCharts.sunburst && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div 
                className="flex justify-between items-center cursor-pointer bg-gray-800 p-4 rounded-t-lg border-b border-gray-700"
                onClick={() => toggleChartCollapse('sunburst')}
              >
                <div className="flex items-center gap-2">
                  <FaChartPie className="text-amber-400" />
                  <h3 className="text-amber-400 font-bold">Spending Distribution</h3>
                </div>
                {collapsedSections.charts.sunburst ? <FaChevronDown className="text-white" /> : <FaChevronUp className="text-white" />}
              </div>
              {!collapsedSections.charts.sunburst && <DrillableSunburstChart />}
            </motion.div>
          )}
          
          {activeCharts.radar && (
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div 
                className="flex justify-between items-center cursor-pointer bg-gray-800 p-4 rounded-t-lg border-b border-gray-700"
                onClick={() => toggleChartCollapse('radar')}
              >
                <div className="flex items-center gap-2">
                  <FaChartBar className="text-amber-400" />
                  <h3 className="text-amber-400 font-bold">Spending Habits Analysis</h3>
                </div>
                {collapsedSections.charts.radar ? <FaChevronDown className="text-white" /> : <FaChevronUp className="text-white" />}
              </div>
              {!collapsedSections.charts.radar && <SpendingHabitsRadarChart />}
            </motion.div>
          )}
          {/* Filter Section */}
          <motion.div 
            className="bg-gray-800 p-6 rounded-lg shadow-lg w-full mb-8" 
            whileHover={{ boxShadow: "0px 0px 16px rgba(128,0,128,0.5)" }}
          >
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleSectionCollapse('filters')}
            >
              <div className="flex items-center gap-2">
                <FaSearch className="text-white text-xl" />
                <h3 className="text-white text-xl">Filter Expenses</h3>
              </div>
              <div className="flex items-center">
                <div className="text-gray-300 mr-4">
                  {filteredExpenses.length} of {expenses.length} expenses shown
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAllFilters();
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded flex items-center gap-1 mr-2"
                >
                  <FaTimes /> Clear
                </button>
                {collapsedSections.filters ? <FaChevronDown className="text-white" /> : <FaChevronUp className="text-white" />}
              </div>
            </div>

            {!collapsedSections.filters && (
              <div className="mt-4">
                {/* Category Filter */}
                <div className="mb-4">
                  <h4 className="text-white mb-2">Category</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {filterOptions.category.map((item) => (
                      <label key={item} className="flex items-center gap-2 text-white">
                        <input 
                          type="checkbox" 
                          checked={categoryFilter.includes(item)}
                          onChange={() => handleCategoryFilterChange(item)} 
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
              </div>
            )}
          </motion.div>
          {/* Expense List */}
          <motion.div
            className="bg-gray-700 p-6 rounded-lg shadow-md border-2 border-black-500 w-full mt-8"
            whileHover={{ boxShadow: "0px 0px 16px rgba(128,0,128,0.5)" }}
          >
            <DisplayExpenses 
              onUpdateClick={handleUpdateClick} 
              refetchExpenses={refetchExpenses}
              expenses={filteredExpenses} 
            />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Update Form */}
      {showUpdateForm && expenseToUpdate && (
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
              ← Back to Expenses
            </button>
            <UpdateExpense expense={expenseToUpdate} onClose={handleCloseUpdateForm} />
          </motion.div>
      )}
    </div>
  );
};

export default ExpenseManager;