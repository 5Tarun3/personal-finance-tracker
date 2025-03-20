// signUpPage.jsx
import React from 'react';
import SignUpForm from '../components/SignUpForm';

const SignUpPage = () => {
  return (
    <div className='flex justify-end items-center h-screen bg-black' style={{ padding: '10px' }}>

      <div className="w-full md:w-1/3">
        <SignUpForm className="bg-gray-800 p-6 rounded-lg shadow-md" />

      </div>
    </div>
  );
};

export default SignUpPage;
