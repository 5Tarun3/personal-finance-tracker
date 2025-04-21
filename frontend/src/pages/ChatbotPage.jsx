import React, { useState } from 'react';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';
import '../styles/ChatbotPage.css';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hello! How can I assist you with your financial summary today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Replace with your actual API endpoint
  const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  // API key from environment variable (access via import.meta.env for Vite)
  const API_KEY = import.meta.env.VITE_CHAT_API_KEY || import.meta.env.CHAT_API_KEY;

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: input }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const botReply = data?.candidates?.[0]?.content || 'Sorry, I did not understand that.';
      const botMessage = { sender: 'assistant', text: botReply };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'assistant', text: 'Error: Unable to get response from chatbot.' };
      setMessages(prev => [...prev, errorMessage]);
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
      </div>
      <div className="chat-input-area">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question here..."
          rows={2}
        />
        <button onClick={handleSend} aria-label="Send message">
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default ChatbotPage;
