// src/components/NotificationAlert.jsx
import React from 'react';
import { motion } from 'framer-motion';

const NotificationAlert = ({ message }) => {
  return (
    <motion.div
      className="bg-red-500 text-white p-4 rounded-lg shadow-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {message}
    </motion.div>
  );
};

export default NotificationAlert;
