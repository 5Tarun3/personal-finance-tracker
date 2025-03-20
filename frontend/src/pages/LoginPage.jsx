import React from 'react';
import SignInForm from '../components/SignInForm';

const LoginPage = () => {
  return (
    <div className='flex min-h-screen items-center justify-end bg-gradient-to-br from-violet-950 to-black-900'>
      <div className=' w-full md:w-1/3 p-8 rounded-lg shadow-md '>
        <SignInForm />
      </div>
    </div>
  );
};

export default LoginPage;
