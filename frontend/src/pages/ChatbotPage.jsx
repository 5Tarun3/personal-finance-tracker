import React, { useState } from 'react';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';
import '../styles/ChatbotPage.css';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hello! How can I assist you with your financial summary today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    // Simulate assistant response (placeholder)
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'assistant', text: 'This is a placeholder response for your query: "' + input + '"' }]);
    }, 1000);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
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
