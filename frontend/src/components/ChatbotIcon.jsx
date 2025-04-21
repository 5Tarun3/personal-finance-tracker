import React from 'react';
import { FaRobot } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ChatbotIcon = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/chatbot');
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Open Chatbot"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#4CD964',
        border: 'none',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      title="Chatbot"
    >
      <FaRobot size={30} color="#fff" />
    </button>
  );
};

export default ChatbotIcon;
