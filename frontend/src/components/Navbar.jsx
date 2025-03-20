import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-black p-4">

      <div className="container mx-auto flex justify-between items-center">
        <img src="/logo-removebg-preview.png" alt ="logo" className="h-10 w-10" />
        <Link to="/" className="text-gold-300 text-3xl font-bold text-shadow-lg ">Finance Tracker</Link>

        <div className="flex items-center">
          <Link to="/" className="text-gold-300 mx-2">Home</Link>
          <Link to="/dashboard" className="text-gold-300 mx-2">Dashboard</Link>
          <Link to="/budgeting-tools" className="text-gold-300 mx-2">Budgeting Tools</Link>
          <Link to="/login" className="text-gold-300 mx-2">Login</Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
