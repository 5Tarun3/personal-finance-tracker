// src/components/AnimatedProgressBar.jsx
import React from 'react';
import { motion } from 'framer-motion';

const AnimatedProgressBar = ({ percentage }) => {
  return (
    <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-green-500"
        style={{ width: `${percentage}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1 }}
      />
    </div>
  );
};

export default AnimatedProgressBar;
