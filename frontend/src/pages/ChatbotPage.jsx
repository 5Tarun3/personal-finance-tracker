import React, { useState, useEffect } from 'react';
import { FaRobot, FaPaperPlane, FaChartPie, FaWallet, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';
import '../styles/ChatbotPage.css';
import { useNavigate } from'react-router-dom';
const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hello! How can I assist you with your financial summary today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);
  useEffect(() => {
          const token = localStorage.getItem('token');
          if (!token) {
            navigate('/login');
            window.location.reload();
          }
        }, [navigate]);
  // Gemini API URL and key
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  const API_KEY = import.meta.env.VITE_CHAT_API_KEY || import.meta.env.CHAT_API_KEY;
  
  // Function to call your backend APIs
  const callFinancialAPI = async (endpoint) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      
      const response = await fetch(`http://localhost:8000/api${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error calling financial API:', error);
      throw error;
    }
  };

  // Function to determine which APIs to call based on user query
  const getRelevantFinancialData = async (query) => {
    const lowerQuery = query.toLowerCase();
    const currentYear = new Date().getFullYear();
    let dataPackage = { query };
    
    try {
      // Get general finance overview data for most queries
      if (lowerQuery.includes('finance') || lowerQuery.includes('overview') || 
          lowerQuery.includes('summary') || lowerQuery.includes('money')) {
        dataPackage.financeOverview = await callFinancialAPI('/finance-overview');
      }
      
      // Get expense data
      if (lowerQuery.includes('expense') || lowerQuery.includes('spend') || 
          lowerQuery.includes('cost') || lowerQuery.includes('budget')) {
        dataPackage.expenses = await callFinancialAPI('/expenses/get');
        dataPackage.expenseOverview = await callFinancialAPI('/expenses/finance-overview');
        
        // Get expense categories if mentioned
        if (lowerQuery.includes('category') || lowerQuery.includes('breakdown')) {
          dataPackage.expensesByCategory = await callFinancialAPI('/expenses/hierarchical-spending');
        }
        
        // Get monthly trends if mentioned
        if (lowerQuery.includes('month') || lowerQuery.includes('trend') || 
            lowerQuery.includes('time') || lowerQuery.includes('year')) {
          dataPackage.monthlyExpenses = await callFinancialAPI(`/expenses/monthwise-total/${currentYear}`);
          dataPackage.categoryTrend = await callFinancialAPI(`/expenses/category-trend/${currentYear}`);
        }
      }
      
      // Get income data
      if (lowerQuery.includes('income') || lowerQuery.includes('earn') || 
          lowerQuery.includes('revenue') || lowerQuery.includes('money')) {
        dataPackage.incomes = await callFinancialAPI('/incomes/get');
        dataPackage.totalIncome = await callFinancialAPI('/incomes/total');
        
        // Get monthly income if time is mentioned
        if (lowerQuery.includes('month') || lowerQuery.includes('trend') || 
            lowerQuery.includes('time') || lowerQuery.includes('year')) {
          dataPackage.monthlyIncome = await callFinancialAPI(`/incomes/monthwise-total/${currentYear}`);
        }
      }
      
      // Get comparison data if comparing income and expenses
      if ((lowerQuery.includes('income') && lowerQuery.includes('expense')) || 
          lowerQuery.includes('vs') || lowerQuery.includes('versus') || 
          lowerQuery.includes('compare') || lowerQuery.includes('net')) {
        dataPackage.monthlyNet = await callFinancialAPI(`/incomes/monthwise-net/${currentYear}`);
      }
      
      // Get user profile data if relevant
      if (lowerQuery.includes('profile') || lowerQuery.includes('goal') || 
          lowerQuery.includes('budget') || lowerQuery.includes('target')) {
        dataPackage.userProfile = await callFinancialAPI('/users/profile');
      }
      
      return dataPackage;
    } catch (error) {
      console.error('Error fetching financial data:', error);
      return { query, error: error.message };
    }
  };

  // Function to send data to Gemini API with financial context
  const sendToGemini = async (userQuery, financialData) => {
    try {
      // Format financial data to provide context for Gemini
      const context = `
        I am a financial assistant with access to the user's financial data. 
        Here is the relevant financial data for this query: ${JSON.stringify(financialData, null, 2)}
        
        Based on this data, provide a detailed and personalized financial analysis or advice.
        Use specific numbers from the data.
        Format the response in a readable way using bullet points or indents where appropriate however strictly no emphasis/strong text.
        Keep your response under 200 words - only provide a short summary.
        For your information - All financial data is in rupees (INR) as the currency.
        User query: ${userQuery}
      `;
      
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: context }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || 
        'Sorry, I could not analyze your financial data at this time.';
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // 1. Get relevant financial data based on the query
      const financialData = await getRelevantFinancialData(input);
      
      // 2. Send both the query and financial data to Gemini
      const botReply = await sendToGemini(input, financialData);
      
      // 3. Display the response
      const botMessage = { sender: 'assistant', text: botReply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      let errorMessage = 'Sorry, I encountered an issue processing your request.';
      
      if (!isLoggedIn) {
        errorMessage = 'Please log in to access your financial data.';
      } else if (error.message.includes('Not authenticated')) {
        errorMessage = 'Your session has expired. Please log in again.';
      }
      
      setMessages(prev => [...prev, { sender: 'assistant', text: errorMessage }]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading) {
        handleSend();
      }
    }
  };

  const handlePresetQuery = (query) => {
    setInput(query);
    // Optional: Auto-send the preset query
    // setTimeout(() => handleSend(), 100);
  };

  // Preset queries based on available routes
  const presetQueries = [
    { icon: <FaChartPie />, text: "Show my spending by category", query: "What are my top spending categories this month?" },
    { icon: <FaWallet />, text: "Monthly budget", query: "How am I doing against my monthly budget?" },
    { icon: <FaDollarSign />, text: "Income vs expenses", query: "What's my income vs expenses this month?" },
    { icon: <FaCalendarAlt />, text: "Year overview", query: "Show me my financial trends for this year" }
  ];

  return (
    <div className="chatbot-page">
      <h2>Financial Summary Chatbot</h2>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.sender}`}>
            {msg.sender === 'assistant' && <FaRobot className="chat-icon" />}
            <div className="chat-text">{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-message assistant">
            <FaRobot className="chat-icon" />
            <div className="chat-text">
              <span className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </span>
            </div>
          </div>
        )}
      </div>
      
      {isLoggedIn && (
        <div className="preset-queries">
          {presetQueries.map((item, index) => (
            <button 
              key={index}
              className="preset-query-btn"
              onClick={() => handlePresetQuery(item.query)}
            >
              {item.icon}
              <span>{item.text}</span>
            </button>
          ))}
        </div>
      )}
      
      <div className="chat-input-area">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here..."
          rows={2}
        />
        <button 
          onClick={handleSend} 
          disabled={loading || !input.trim()} 
          aria-label="Send message"
          className={loading ? 'sending' : ''}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;