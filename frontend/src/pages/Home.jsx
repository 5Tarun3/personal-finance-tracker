// src/pages/index.jsx
import React, { useContext } from "react";
import AnimatedButton from "../components/AnimatedButton";
import { Navigate, useLocation, useNavigate } from 'react-router-dom'; // Import Navigate and useNavigate

import AuthContext from '../context/AuthContext.jsx'; // Updated import statement

const Home = () => {
  const { userLoggedIn } = useContext(AuthContext); // Access userLoggedIn from context
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen justify-center items-center bg-gradient-to-br from-gray-900 to-black-700 p-10">
      <h1 className="text-5xl text-gold-300 font-bold mb-8 text-center">

        Finance Tracker
      </h1>
      <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-5xl space-y-4 md:space-y-0 md:space-x-6">
        {userLoggedIn ? (
        <AnimatedButton
          label="Go to Dashboard"
          buttonColor="green"
          textColor="white"
          style={{ backgroundColor: 'black', borderRadius: '20px' }}

            onClick={() => {
              navigate('/dashboard');
            }}
          />
        ) : (
          <Navigate to="/login" state={{ from: location }} replace />
        )}
        <AnimatedButton
          label="Go to Budgeting Tools"
          buttonColor="blue"
          textColor="white"
          style={{ backgroundColor: 'black', borderRadius: '20px' }}

          onClick={() => {
            navigate('/budgeting-tools');
          }}
        />
        <AnimatedButton
          label="Go to Login"
          buttonColor="red"
          textColor="white"
          style={{ backgroundColor: 'black', borderRadius: '20px' }}

          onClick={() => {
            navigate('/login');
          }}
        />
      </div>
    </div>
  );
};

export default Home;
