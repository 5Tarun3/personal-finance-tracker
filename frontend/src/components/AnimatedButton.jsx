import React, { useState } from 'react';
import './AnimatedButton.css';

const AnimatedButton = ({ label, onClick, buttonColor, textColor }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    setIsClicked(true);
    onClick?.(e);
    setTimeout(() => setIsClicked(false), 500);
  };

  return (
    <button
      onClick={handleClick}
      className={`animated-button ${isClicked ? 'explode' : ''}`}
      style={{
        backgroundColor: buttonColor,
        color: textColor,
        text: "rgb(255,215,0)"
      }}
    >
      {label}
    </button>
  );
};

export default AnimatedButton;
